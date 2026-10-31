<?php
namespace App\Tests\Functional;

use App\DataFixtures\AppFixtures;
use App\Entity\User;

class ClubApiTest extends ApiTestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        static::getContainer()->get(AppFixtures::class)->load($this->em);
    }

    public function testPublicPagesUseClubDemoData(): void
    {
        foreach (['club', 'disciplines', 'coaches', 'venues', 'planning', 'pricing', 'partners', 'boxers/featured'] as $path) {
            $data = $this->jsonRequest('GET', '/api/'.$path);
            self::assertResponseIsSuccessful($path);
            self::assertNotEmpty($data, $path);
        }
        foreach (['articles', 'boxers', 'galas'] as $path) {
            $page = $this->jsonRequest('GET', '/api/'.$path);
            self::assertResponseIsSuccessful($path);
            self::assertGreaterThan(0, $page['total']);
            $detail = $this->jsonRequest('GET', '/api/'.$path.'/'.$page['items'][0]['slug']);
            self::assertResponseIsSuccessful($path.' détail');
            self::assertNotEmpty($detail['slug']);
        }
        $discipline = $this->jsonRequest('GET', '/api/disciplines/boxe-anglaise');
        self::assertResponseIsSuccessful();
        self::assertNotEmpty($discipline['slots']);
        self::assertNotEmpty($discipline['coaches']);
        $boxer = $this->jsonRequest('GET', '/api/boxers/alex-demo');
        self::assertArrayNotHasKey('birthDate', $boxer);
        self::assertSame(1, $boxer['record']['wins']);
        self::assertCount(1, $boxer['fights']);
    }

    private function auth(string $account): array
    {
        $login = $this->jsonRequest('POST', '/api/login', ['email' => $account.'@esctboxe.local', 'password' => AppFixtures::DEMO_PASSWORD]);
        self::assertResponseIsSuccessful();
        return ['Authorization' => 'Bearer '.$login['token']];
    }

    public function testMembershipIsLinkedToItsMemberAndMinorNeedsGuardian(): void
    {
        $discipline = $this->jsonRequest('GET', '/api/disciplines')[0]['id'];
        $headers = $this->auth('demo');
        $payload = ['firstName' => 'Léa', 'lastName' => 'Démo', 'email' => 'demo@esctboxe.local', 'birthDate' => '2000-05-12', 'discipline' => $discipline, 'consent' => true];
        $created = $this->jsonRequest('POST', '/api/memberships', $payload, $headers);
        self::assertResponseStatusCodeSame(201);
        self::assertSame('en_attente', $created['status']);
        $mine = $this->jsonRequest('GET', '/api/me/memberships', [], $headers);
        self::assertResponseIsSuccessful();
        self::assertContains($created['id'], array_column($mine, 'id'));
        $other = $this->jsonRequest('GET', '/api/me/memberships', [], $this->auth('coach'));
        self::assertSame([], $other);
        $payload['birthDate'] = (new \DateTimeImmutable('-10 years'))->format('Y-m-d');
        $this->jsonRequest('POST', '/api/memberships', $payload);
        self::assertResponseStatusCodeSame(422);
    }

    public function testMessageAccessIsRestrictedToRecipient(): void
    {
        $headers = $this->auth('demo');
        $messages = $this->jsonRequest('GET', '/api/me/messages', [], $headers);
        self::assertResponseIsSuccessful();
        self::assertSame('received', $messages['items'][0]['direction']);
        $id = $messages['items'][0]['id'];
        $this->jsonRequest('POST', '/api/me/messages/'.$id.'/read', [], $headers);
        self::assertResponseIsSuccessful();
        $this->jsonRequest('POST', '/api/me/messages/'.$id.'/read', [], $this->auth('coach'));
        self::assertResponseStatusCodeSame(404);
    }

    public function testBackOfficeRejectsMemberAndAcceptsStaff(): void
    {
        foreach (['demo' => 403, 'coach' => 200, 'admin' => 200] as $account => $status) {
            $user = $this->em->getRepository(User::class)->findOneBy(['email' => $account.'@esctboxe.local']);
            $this->client->loginUser($user, 'main');
            $this->client->request('GET', '/admin');
            self::assertResponseStatusCodeSame($status, $account);
        }
    }
}
