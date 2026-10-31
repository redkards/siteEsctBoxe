<?php

namespace App\Tests\Functional;

use App\Entity\{Article, Comment, ConsentLog, Discipline, Membership, Message, RefreshToken, User};
use App\Service\GdprService;
use Symfony\Component\Mime\Email;

/** Parcours du compte membre : rectification, export et suppression des données du club. */
class GdprApiTest extends ApiTestCase
{
    private const PASSWORD = 'Boxe-Membre-2026!';

    private function member(string $name = 'alice'): User
    {
        $user = (new User())->setEmail($name.'@example.com')->setFirstName(ucfirst($name))->setLastName('Démo')->setIsVerified(true);
        $user->setPassword(static::getContainer()->get('security.user_password_hasher')->hashPassword($user, self::PASSWORD));
        static::getContainer()->get(GdprService::class)->recordConsent($user, '203.0.113.7');
        $this->em->persist($user);
        $this->em->flush();
        return $user;
    }

    private function auth(User $user): array
    {
        $data = $this->jsonRequest('POST', '/api/login', ['email' => $user->getEmail(), 'password' => self::PASSWORD]);
        self::assertResponseIsSuccessful();
        return ['Authorization' => 'Bearer '.$data['token']];
    }

    private function personalData(User $user): void
    {
        $discipline = (new Discipline())->setName('Boxe test')->setSlug('boxe-test')->setShortDescription('Test')->setDescription('Test');
        $article = (new Article())->setTitle('Actualité test')->setSlug('actualite-test')->setExcerpt('Test')->setContent('<p>Test</p>');
        $this->em->persist($discipline);
        $this->em->persist($article);
        $this->em->persist((new Membership())->setUser($user)->setFirstName('Alice')->setLastName('Démo')
            ->setEmail('alice@example.com')->setBirthDate(new \DateTimeImmutable('2000-01-01'))
            ->setDiscipline($discipline)->setSeason('2026-2027')->setConsentAt(new \DateTimeImmutable()));
        $this->em->persist((new Message())->setSender($user)->setSubject('Première séance')->setBody('Comment participer ?'));
        $this->em->persist((new Comment())->setArticle($article)->setAuthor($user)->setBody('Merci au club'));
        $this->em->flush();
    }

    public function testUpdateProfile(): void
    {
        $alice = $this->member();
        $data = $this->jsonRequest('PATCH', '/api/me', ['firstName' => 'Alicia', 'lastName' => 'Martin', 'phone' => '0601020304', 'birthDate' => '2000-05-12'], $this->auth($alice));
        self::assertResponseIsSuccessful();
        self::assertSame('Alicia', $data['firstName']);
        self::assertSame('Martin', $data['lastName']);
        self::assertSame('2000-05-12', $data['birthDate']);
        self::assertSame('alice@example.com', $data['email']);
    }

    public function testChangePasswordRequiresCurrentAndRevokesSessions(): void
    {
        $this->member();
        $login = $this->jsonRequest('POST', '/api/login', ['email' => 'alice@example.com', 'password' => self::PASSWORD]);
        $headers = ['Authorization' => 'Bearer '.$login['token']];
        $this->jsonRequest('POST', '/api/me/password', ['currentPassword' => 'faux', 'newPassword' => 'Boxe-Nouveau-2027!'], $headers);
        self::assertResponseStatusCodeSame(422);
        $this->jsonRequest('POST', '/api/me/password', ['currentPassword' => self::PASSWORD, 'newPassword' => 'Boxe-Nouveau-2027!'], $headers);
        self::assertResponseIsSuccessful();
        $this->jsonRequest('POST', '/api/token/refresh', ['refresh_token' => $login['refresh_token']]);
        self::assertResponseStatusCodeSame(401);
        $this->jsonRequest('POST', '/api/login', ['email' => 'alice@example.com', 'password' => 'Boxe-Nouveau-2027!']);
        self::assertResponseIsSuccessful();
    }

    public function testExportContainsClubPersonalDataAndExcludesOtherMembers(): void
    {
        $alice = $this->member();
        $bob = $this->member('bob');
        $this->personalData($alice);
        $this->em->persist((new Message())->setSender($bob)->setSubject('Privé Bob')->setBody('Ne pas exporter'));
        $this->em->flush();
        $data = $this->jsonRequest('GET', '/api/me/export', [], $this->auth($alice));
        self::assertResponseIsSuccessful();
        self::assertResponseHeaderSame('Content-Disposition', sprintf('attachment; filename="esctboxe-mes-donnees-%s.json"', date('Y-m-d')));
        self::assertSame('alice@example.com', $data['account']['email']);
        self::assertSame('203.0.113.7', $data['consents'][0]['ipAddress']);
        self::assertSame('Boxe test', $data['memberships'][0]['discipline']);
        self::assertCount(1, $data['messages']);
        self::assertSame('Première séance', $data['messages'][0]['subject']);
        self::assertSame('Merci au club', $data['comments'][0]['body']);
        self::assertArrayNotHasKey('password', $data['account']);
        self::assertResponseHeaderSame('Cache-Control', 'no-store, private');
    }

    public function testDeletionNeedsPasswordAndEmailThenRemovesMessagesAndComments(): void
    {
        $alice = $this->member();
        $id = $alice->getId();
        $this->personalData($alice);
        $headers = $this->auth($alice);
        $this->jsonRequest('DELETE', '/api/me', ['password' => 'mauvais'], $headers);
        self::assertResponseStatusCodeSame(422);
        self::assertEmailCount(0);
        $this->jsonRequest('DELETE', '/api/me', ['password' => self::PASSWORD], $headers);
        self::assertResponseStatusCodeSame(202);
        $email = $this->getMailerMessage();
        self::assertInstanceOf(Email::class, $email);
        preg_match('#suppression-compte\?token=([a-f0-9]{64})#', (string) $email->getTextBody(), $matches);
        self::assertNotEmpty($matches[1] ?? null);
        $this->em->clear();
        self::assertSame('alice@example.com', $this->em->find(User::class, $id)->getEmail());
        $this->jsonRequest('POST', '/api/account-deletion/confirm', ['token' => $matches[1]]);
        self::assertResponseIsSuccessful();
        $this->em->clear();
        $user = $this->em->find(User::class, $id);
        self::assertNull($user->getEmail());
        self::assertNotNull($user->getAnonymizedAt());
        self::assertSame([], $this->em->getRepository(Message::class)->findAll());
        self::assertSame([], $this->em->getRepository(Comment::class)->findAll());
        self::assertNull($this->em->getRepository(Membership::class)->findOneBy([])->getUser());
        self::assertSame([], $this->em->getRepository(RefreshToken::class)->findBy(['username' => 'alice@example.com']));
        foreach ($this->em->getRepository(ConsentLog::class)->findBy(['user' => $user]) as $log) self::assertNull($log->getIpAddress());
        $this->jsonRequest('POST', '/api/login', ['email' => 'alice@example.com', 'password' => self::PASSWORD]);
        self::assertResponseStatusCodeSame(401);
        $this->jsonRequest('POST', '/api/account-deletion/confirm', ['token' => $matches[1]]);
        self::assertResponseStatusCodeSame(400);
    }

    public function testExpiredDeletionLinkIsRefused(): void
    {
        $alice = $this->member();
        [$token] = static::getContainer()->get(GdprService::class)->requestDeletion($alice);
        $alice->setDeletionTokenExpiresAt(new \DateTimeImmutable('-1 minute'));
        $this->em->flush();
        $this->jsonRequest('POST', '/api/account-deletion/confirm', ['token' => $token]);
        self::assertResponseStatusCodeSame(400);
        $this->em->clear();
        self::assertNotNull($this->em->find(User::class, $alice->getId())->getEmail());
    }

    public function testCleanupPurgesOldIpsAndAnonymizesInactiveAccounts(): void
    {
        $recent = $this->member('recent');
        $dormant = $this->member('dormant');
        $dormant->setLastLoginAt(new \DateTimeImmutable('-3 years -1 day'));
        $oldLog = (new ConsentLog())->setCguVersion('1.0')->setIpAddress('198.51.100.1');
        $recent->addConsentLog($oldLog);
        $this->em->persist($oldLog);
        $this->em->flush();
        $this->em->getConnection()->executeStatement('UPDATE consent_log SET created_at = ? WHERE id = ?', [(new \DateTimeImmutable('-91 days'))->format('Y-m-d H:i:s'), $oldLog->getId()]);
        $result = static::getContainer()->get(GdprService::class)->cleanup();
        self::assertSame(1, $result['ipPurged']);
        self::assertSame(1, $result['accountsAnonymized']);
        $this->em->clear();
        self::assertNull($this->em->find(User::class, $dormant->getId())->getEmail());
        self::assertSame('recent@example.com', $this->em->find(User::class, $recent->getId())->getEmail());
        self::assertNull($this->em->find(ConsentLog::class, $oldLog->getId())->getIpAddress());
    }
}
