<?php

namespace App\Controller\Api;

use App\Dto\AccountDeletionRequest;
use App\Dto\PasswordChangeRequest;
use App\Dto\ProfileUpdateRequest;
use App\Dto\RegisterRequest;
use App\Entity\RefreshToken;
use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\GdprService;
use App\Service\MailService;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\RateLimiter\RateLimiterFactoryInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api')]
class UserController extends AbstractController
{
    use PublicCache;

    private const VERIFICATION_TTL = '+24 hours';

    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly UserRepository $users,
        private readonly MailService $mailService,
        private readonly LoggerInterface $logger,
    ) {
    }

    /**
     * Créer un compte membre
     */
    #[Route('/register', name: 'api_register', methods: ['POST'])]
    public function register(
        #[MapRequestPayload] RegisterRequest $payload,
        Request $request,
        UserPasswordHasherInterface $hasher,
        GdprService $gdpr,
        RateLimiterFactoryInterface $registerLimiter,
    ): JsonResponse {
        if (!$registerLimiter->create($request->getClientIp())->consume()->isAccepted()) {
            return $this->json(['message' => 'Trop de tentatives, réessayez dans une minute.'], Response::HTTP_TOO_MANY_REQUESTS);
        }

        if ($this->users->findOneBy(['email' => mb_strtolower(trim($payload->email))])) {
            return $this->json(['message' => 'Un compte existe déjà avec cet email.'], Response::HTTP_CONFLICT);
        }
        $user = (new User())
            ->setEmail($payload->email)
            ->setFirstName($payload->firstName)
            ->setLastName($payload->lastName)
            ->setPhone($payload->phone)
            ->setBirthDate(self::date($payload->birthDate));
        $user->setPassword($hasher->hashPassword($user, $payload->password));

        $gdpr->recordConsent($user, $request->getClientIp());
        [$plainToken, $expiresAt] = $this->issueVerificationToken($user);

        $this->em->persist($user);
        $this->em->flush();

        $this->sendVerificationEmail($user, $plainToken, $expiresAt);

        return $this->json([
            'message' => 'Compte créé. Consultez votre boîte mail pour activer votre compte.',
        ], Response::HTTP_CREATED);
    }

    /**
     * Activation du compte depuis le lien reçu par email : POST {"token": "..."}
     * (GET ?token=... reste accepté pour les liens ouverts directement).
     */
    #[Route('/verify-email', name: 'api_verify_email', methods: ['POST', 'GET'])]
    public function verifyEmail(Request $request): JsonResponse
    {
        $token = (string) $request->query->get('token', '');
        if ('' === $token && $request->isMethod('POST') && '' !== $request->getContent()) {
            $token = (string) ($request->toArray()['token'] ?? '');
        }

        $user = '' !== $token ? $this->users->findOneByVerificationToken(hash('sha256', $token)) : null;

        if (!$user) {
            return $this->json(['code' => 'invalid', 'message' => 'Lien de vérification invalide ou déjà utilisé.'], Response::HTTP_BAD_REQUEST);
        }

        if ($user->getVerificationTokenExpiresAt() < new \DateTimeImmutable()) {
            return $this->json(['code' => 'expired', 'message' => 'Ce lien a expiré. Demandez-en un nouveau.'], Response::HTTP_GONE);
        }

        $user->setIsVerified(true)
            ->setVerificationToken(null)
            ->setVerificationTokenExpiresAt(null);
        $this->em->flush();

        return $this->json(['message' => 'Adresse email confirmée, vous pouvez vous connecter.']);
    }

    /**
     * Renvoi du lien (lien expiré ou perdu).
     * Réponse identique que le compte existe ou non (pas d'énumération des emails).
     */
    #[Route('/verify-email/resend', name: 'api_verify_email_resend', methods: ['POST'])]
    public function resendVerification(Request $request, RateLimiterFactoryInterface $verificationResendLimiter): JsonResponse
    {
        $email = mb_strtolower(trim((string) ($request->toArray()['email'] ?? '')));

        if (!$verificationResendLimiter->create($request->getClientIp().'|'.$email)->consume()->isAccepted()) {
            return $this->json(['message' => 'Trop de demandes, réessayez plus tard.'], Response::HTTP_TOO_MANY_REQUESTS);
        }

        $user = '' !== $email ? $this->users->findOneBy(['email' => $email]) : null;
        if ($user && !$user->isVerified()) {
            [$plainToken, $expiresAt] = $this->issueVerificationToken($user);
            $this->em->flush();
            $this->sendVerificationEmail($user, $plainToken, $expiresAt);
        }

        return $this->json([
            'message' => 'Si un compte non activé correspond à cet email, un nouveau lien vient d\'être envoyé.',
        ], Response::HTTP_ACCEPTED);
    }

    #[Route('/me', name: 'api_me', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function me(#[CurrentUser] User $user): Response
    {
        return $this->noStore($this->json($this->meData($user)));
    }

    /**
     * Modifier son profil (prénom, nom, téléphone, date de naissance)
     */
    #[Route('/me', name: 'api_me_update', methods: ['PATCH'])]
    #[IsGranted('ROLE_USER')]
    public function updateProfile(#[MapRequestPayload] ProfileUpdateRequest $payload, #[CurrentUser] User $user): Response
    {
        $user->setFirstName($payload->firstName)
            ->setLastName($payload->lastName)
            ->setPhone($payload->phone)
            ->setBirthDate(self::date($payload->birthDate));
        $this->em->flush();

        return $this->noStore($this->json($this->meData($user)));
    }

    /**
     * Changer son mot de passe : les autres sessions (refresh tokens) sont révoquées.
     */
    #[Route('/me/password', name: 'api_me_password', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function changePassword(
        #[MapRequestPayload] PasswordChangeRequest $payload,
        #[CurrentUser] User $user,
        UserPasswordHasherInterface $hasher,
    ): JsonResponse {
        $user->setPassword($hasher->hashPassword($user, $payload->newPassword));
        $this->em->createQueryBuilder()
            ->delete(RefreshToken::class, 'r')
            ->where('r.username = :username')
            ->setParameter('username', $user->getUserIdentifier())
            ->getQuery()
            ->execute();
        $this->em->flush();

        return $this->json(['message' => 'Mot de passe modifié. Vos autres sessions ont été déconnectées.']);
    }

    /**
     * Exporter ses données (RGPD, droit d'accès et de portabilité)
     */
    #[Route('/me/export', name: 'api_me_export', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function export(#[CurrentUser] User $user, GdprService $gdpr): JsonResponse
    {
        $response = $this->json($gdpr->export($user), context: ['json_encode_options' => \JSON_PRETTY_PRINT | \JSON_UNESCAPED_UNICODE | \JSON_UNESCAPED_SLASHES]);
        $response->headers->set('Content-Disposition', sprintf('attachment; filename="esctboxe-mes-donnees-%s.json"', date('Y-m-d')));
        $response->headers->set('Cache-Control', 'no-store');

        return $response;
    }

    /**
     * Supprimer son compte, étape 1 : mot de passe puis email de confirmation.
     */
    #[Route('/me', name: 'api_me_delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_USER')]
    public function requestDeletion(#[MapRequestPayload] AccountDeletionRequest $payload, #[CurrentUser] User $user, GdprService $gdpr): JsonResponse
    {
        [$plainToken, $expiresAt] = $gdpr->requestDeletion($user);

        try {
            $this->mailService->sendAccountDeletionConfirmation($user, $plainToken, $expiresAt);
        } catch (TransportExceptionInterface $e) {
            $this->logger->error('Echec email de suppression de compte', ['userId' => $user->getId(), 'error' => $e->getMessage()]);

            return $this->json(['message' => "L'email de confirmation n'a pas pu être envoyé, réessayez plus tard."], Response::HTTP_SERVICE_UNAVAILABLE);
        }

        return $this->json([
            'message' => 'Un email de confirmation vient de vous être envoyé. Le lien est valable 1 heure.',
        ], Response::HTTP_ACCEPTED);
    }

    /**
     * Suppression, étape 2 : lien reçu par email (public : la session peut avoir expiré entre-temps).
     */
    #[Route('/account-deletion/confirm', name: 'api_account_deletion_confirm', methods: ['POST'])]
    public function confirmDeletion(Request $request, GdprService $gdpr): JsonResponse
    {
        $token = (string) ($request->toArray()['token'] ?? '');

        if (!$gdpr->confirmDeletion($token)) {
            return $this->json(['message' => 'Lien de confirmation invalide ou expiré. Recommencez depuis votre espace.'], Response::HTTP_BAD_REQUEST);
        }

        return $this->json(['message' => 'Votre compte a été supprimé et vos données personnelles effacées.']);
    }

    /**
     * @return array<string, mixed>
     */
    private function meData(User $user): array
    {
        return [
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'phone' => $user->getPhone(),
            'birthDate' => $user->getBirthDate()?->format('Y-m-d'),
            'roles' => $user->getRoles(),
            'createdAt' => $user->getCreatedAt()?->format(\DATE_ATOM),
        ];
    }

    private static function date(?string $value): ?\DateTimeImmutable
    {
        return $value ? (\DateTimeImmutable::createFromFormat('!Y-m-d', $value) ?: null) : null;
    }

    /**
     * Génère un jeton aléatoire ; seule son empreinte est stockée.
     *
     * @return array{0: string, 1: \DateTimeImmutable}
     */
    private function issueVerificationToken(User $user): array
    {
        $plainToken = bin2hex(random_bytes(32));
        $expiresAt = new \DateTimeImmutable(self::VERIFICATION_TTL);

        $user->setVerificationToken(hash('sha256', $plainToken))
            ->setVerificationTokenExpiresAt($expiresAt);

        return [$plainToken, $expiresAt];
    }

    private function sendVerificationEmail(User $user, string $plainToken, \DateTimeImmutable $expiresAt): void
    {
        try {
            $this->mailService->sendVerificationEmail($user, $plainToken, $expiresAt);
        } catch (TransportExceptionInterface $e) {
            // Le compte existe : l'utilisateur pourra redemander un lien
            $this->logger->error('Echec envoi email de vérification', ['userId' => $user->getId(), 'error' => $e->getMessage()]);
        }
    }
}
