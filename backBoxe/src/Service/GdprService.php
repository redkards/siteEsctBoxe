<?php

namespace App\Service;

use App\Entity\Comment;
use App\Entity\ConsentLog;
use App\Entity\Membership;
use App\Entity\Message;
use App\Entity\RefreshToken;
use App\Entity\User;
use App\Repository\ConsentLogRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

/**
 * Traitements RGPD : consentement, export (droit d'accès / portabilité),
 * effacement par anonymisation, purges automatiques.
 */
class GdprService
{
    public const DELETION_TTL = '+1 hour';
    public const IP_RETENTION = '-90 days';
    public const INACTIVITY_LIMIT = '-3 years';
    public const ANONYMOUS_LABEL = 'Utilisateur supprimé';

    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly ConsentLogRepository $consentLogs,
        #[Autowire(env: 'CGU_VERSION')]
        private readonly string $cguVersion,
    ) {
    }

    public function getCurrentCguVersion(): string
    {
        return $this->cguVersion;
    }

    /**
     * Enregistre l'acceptation des CGU sur l'utilisateur et en garde la preuve (ConsentLog).
     * Le flush est laissé à l'appelant.
     */
    public function recordConsent(User $user, ?string $ipAddress): ConsentLog
    {
        $now = new \DateTimeImmutable();

        $user->setConsentVersion($this->cguVersion);
        $user->setConsentAt($now);

        $log = (new ConsentLog())
            ->setCguVersion($this->cguVersion)
            ->setIpAddress($ipAddress);
        $user->addConsentLog($log);

        $this->em->persist($log);

        return $log;
    }

    /**
     * Droit d'accès et de portabilité : toutes les données rattachées au compte.
     *
     * @return array<string, mixed>
     */
    public function export(User $user): array
    {
        $date = static fn (?\DateTimeInterface $d) => $d?->format(\DATE_ATOM);
        $day = static fn (?\DateTimeInterface $d) => $d?->format('Y-m-d');

        $memberships = $this->em->getRepository(Membership::class)->findBy(['user' => $user], ['createdAt' => 'ASC']);
        $messages = $this->em->createQueryBuilder()
            ->select('m')->from(Message::class, 'm')
            ->where('m.sender = :user OR m.recipient = :user')
            ->setParameter('user', $user)
            ->orderBy('m.createdAt', 'ASC')
            ->getQuery()->getResult();
        $comments = $this->em->getRepository(Comment::class)->findBy(['author' => $user], ['createdAt' => 'ASC']);

        return [
            'exportedAt' => $date(new \DateTimeImmutable()),
            'account' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'firstName' => $user->getFirstName(),
                'lastName' => $user->getLastName(),
                'phone' => $user->getPhone(),
                'birthDate' => $day($user->getBirthDate()),
                'roles' => $user->getRoles(),
                'emailVerifiedAt' => $date($user->getEmailVerifiedAt()),
                'createdAt' => $date($user->getCreatedAt()),
                'lastLoginAt' => $date($user->getLastLoginAt()),
            ],
            'consents' => array_map(static fn (ConsentLog $c) => [
                'cguVersion' => $c->getCguVersion(),
                'acceptedAt' => $date($c->getCreatedAt()),
                'ipAddress' => $c->getIpAddress(),
            ], $user->getConsentLogs()->toArray()),
            'memberships' => array_map(static fn (Membership $m) => [
                'season' => $m->getSeason(),
                'discipline' => $m->getDiscipline()?->getName(),
                'pricing' => $m->getPricing()?->getLabel(),
                'firstName' => $m->getFirstName(),
                'lastName' => $m->getLastName(),
                'email' => $m->getEmail(),
                'phone' => $m->getPhone(),
                'birthDate' => $day($m->getBirthDate()),
                'legalGuardian' => $m->getLegalGuardian(),
                'medicalCertificate' => $m->isMedicalCertificate(),
                'message' => $m->getMessage(),
                'status' => $m->getStatus()->value,
                'consentAt' => $date($m->getConsentAt()),
                'createdAt' => $date($m->getCreatedAt()),
            ], $memberships),
            'messages' => array_map(static fn (Message $m) => [
                'direction' => $m->getSender() === $user ? 'sent' : 'received',
                'subject' => $m->getSubject(),
                'body' => $m->getBody(),
                'createdAt' => $date($m->getCreatedAt()),
                'readAt' => $date($m->getReadAt()),
            ], $messages),
            'comments' => array_map(static fn (Comment $c) => [
                'article' => $c->getArticle()?->getTitle(),
                'body' => $c->getBody(),
                'status' => $c->getStatus()->value,
                'createdAt' => $date($c->getCreatedAt()),
            ], $comments),
        ];
    }

    /**
     * UC14, étape 1 : génère le jeton de confirmation (seule son empreinte est stockée).
     *
     * @return array{0: string, 1: \DateTimeImmutable} jeton en clair, expiration
     */
    public function requestDeletion(User $user): array
    {
        $plainToken = bin2hex(random_bytes(32));
        $expiresAt = new \DateTimeImmutable(self::DELETION_TTL);

        $user->setDeletionToken(hash('sha256', $plainToken))
            ->setDeletionTokenExpiresAt($expiresAt);
        $this->em->flush();

        return [$plainToken, $expiresAt];
    }

    /**
     * UC14, étape 2 : lien cliqué depuis l'email. Retourne false si le jeton est invalide ou expiré.
     */
    public function confirmDeletion(string $plainToken): bool
    {
        if ('' === $plainToken) {
            return false;
        }

        $user = $this->em->getRepository(User::class)->findOneBy(['deletionToken' => hash('sha256', $plainToken)]);
        if (!$user || $user->getDeletionTokenExpiresAt() < new \DateTimeImmutable()) {
            return false;
        }

        $this->anonymize($user);

        return true;
    }

    /**
     * Effacement : le compte n'est plus rattachable à une personne.
     * Messagerie et commentaires sont supprimés. Les demandes d'inscription sont des pièces
     * administratives du club (licence, assurance) : elles sont conservées mais détachées du compte.
     */
    public function anonymize(User $user): void
    {
        if ($user->isAnonymized()) {
            return;
        }

        $identifier = $user->getUserIdentifier();

        // Sessions ouvertes : refresh tokens révoqués
        if ('' !== $identifier) {
            $this->em->createQueryBuilder()
                ->delete(RefreshToken::class, 'r')
                ->where('r.username = :username')
                ->setParameter('username', $identifier)
                ->getQuery()
                ->execute();
        }

        $messageIds = array_column($this->em->createQueryBuilder()->select('m.id')->from(Message::class, 'm')
            ->where('m.sender = :user OR m.recipient = :user')
            ->setParameter('user', $user)->getQuery()->getScalarResult(), 'id');
        if ($messageIds) {
            $this->em->createQueryBuilder()->update(Message::class, 'm')->set('m.replyTo', ':none')
                ->where('m.replyTo IN (:ids)')
                ->setParameter('none', null)->setParameter('ids', $messageIds)->getQuery()->execute();
            $this->em->createQueryBuilder()->delete(Message::class, 'm')->where('m.id IN (:ids)')
                ->setParameter('ids', $messageIds)->getQuery()->execute();
        }
        $this->em->createQueryBuilder()->delete(Comment::class, 'c')->where('c.author = :user')
            ->setParameter('user', $user)->getQuery()->execute();
        $this->em->createQueryBuilder()->update(Membership::class, 'ms')->set('ms.user', ':none')
            ->where('ms.user = :user')
            ->setParameter('none', null)->setParameter('user', $user)->getQuery()->execute();

        // La preuve de consentement est conservée, sans l'adresse IP
        foreach ($user->getConsentLogs() as $log) {
            $log->setIpAddress(null);
        }

        $user->setEmail(null)
            ->setFirstName('Utilisateur')
            ->setLastName('supprimé')
            ->setPhone(null)
            ->setBirthDate(null)
            // Hash invalide : aucune connexion possible
            ->setPassword('!anonymized')
            ->setRoles([])
            ->setIsVerified(false)
            ->setVerificationToken(null)
            ->setVerificationTokenExpiresAt(null)
            ->setDeletionToken(null)
            ->setDeletionTokenExpiresAt(null)
            ->setLastLoginAt(null)
            ->setAnonymizedAt(new \DateTimeImmutable());

        $this->em->flush();
    }

    /**
     * Purge planifiée (cron) : IP de plus de 90 jours, comptes inactifs depuis 3 ans.
     *
     * @return array{ipPurged: int, accountsAnonymized: int}
     */
    public function cleanup(bool $dryRun = false): array
    {
        $ipLimit = new \DateTimeImmutable(self::IP_RETENTION);
        $inactiveLimit = new \DateTimeImmutable(self::INACTIVITY_LIMIT);

        /** @var list<User> $inactive */
        $inactive = $this->em->createQueryBuilder()
            ->select('u')
            ->from(User::class, 'u')
            ->where('u.anonymizedAt IS NULL')
            ->andWhere('(u.lastLoginAt IS NOT NULL AND u.lastLoginAt < :limit) OR (u.lastLoginAt IS NULL AND u.createdAt < :limit)')
            ->setParameter('limit', $inactiveLimit)
            ->getQuery()
            ->getResult();

        if ($dryRun) {
            return [
                'ipPurged' => (int) $this->em->createQueryBuilder()
                    ->select('COUNT(c.id)')->from(ConsentLog::class, 'c')
                    ->where('c.createdAt < :before')->andWhere('c.ipAddress IS NOT NULL')
                    ->setParameter('before', $ipLimit)
                    ->getQuery()->getSingleScalarResult(),
                'accountsAnonymized' => \count($inactive),
            ];
        }

        $ipPurged = $this->consentLogs->purgeIpAddressesOlderThan($ipLimit);
        foreach ($inactive as $user) {
            $this->anonymize($user);
        }

        return ['ipPurged' => $ipPurged, 'accountsAnonymized' => \count($inactive)];
    }
}
