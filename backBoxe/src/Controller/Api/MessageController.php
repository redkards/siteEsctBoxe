<?php

namespace App\Controller\Api;

use App\Dto\MessageRequest;
use App\Entity\Message;
use App\Entity\User;
use App\Repository\MessageRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\RateLimiter\RateLimiterFactoryInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

/**
 * Messagerie interne membre ↔ club (les coachs répondent depuis le back-office).
 * Chaque message porte direction = sent | received du point de vue du membre connecté.
 */
#[Route('/api/me/messages')]
#[IsGranted('ROLE_USER')]
class MessageController extends AbstractController
{
    use PublicCache;

    public function __construct(
        private readonly MessageRepository $messages,
        private readonly NormalizerInterface $normalizer,
    ) {
    }

    #[Route('', name: 'api_me_messages', methods: ['GET'])]
    public function list(#[CurrentUser] User $user, #[MapQueryParameter] int $page = 1, #[MapQueryParameter] int $limit = 20): Response
    {
        $page = Paginated::clampPage($page);
        $limit = Paginated::clampLimit($limit);

        $data = Paginated::from($this->messages->findPageForUser($user, $page, $limit), $page, $limit);
        $data['items'] = array_map(fn (Message $m) => $this->normalize($m, $user), $data['items']);

        return $this->noStore($this->json($data));
    }

    /**
     * Nouveau message adressé au club
     */
    #[Route('', name: 'api_me_message_create', methods: ['POST'])]
    public function create(
        #[MapRequestPayload] MessageRequest $payload,
        #[CurrentUser] User $user,
        EntityManagerInterface $em,
        RateLimiterFactoryInterface $memberMessageLimiter,
    ): Response {
        if (!$memberMessageLimiter->create('user-'.$user->getId())->consume()->isAccepted()) {
            return $this->json(['message' => 'Trop de messages envoyés, réessayez plus tard.'], Response::HTTP_TOO_MANY_REQUESTS);
        }

        $message = (new Message())
            ->setSender($user)
            ->setRecipient(null)
            ->setSubject(trim($payload->subject))
            ->setBody(trim($payload->body));
        $em->persist($message);
        $em->flush();

        return $this->noStore($this->json($this->normalize($message, $user), Response::HTTP_CREATED));
    }

    /**
     * Marque comme lu un message reçu par le membre (idempotent)
     */
    #[Route('/{id}/read', name: 'api_me_message_read', requirements: ['id' => '\d+'], methods: ['POST'])]
    public function markRead(int $id, #[CurrentUser] User $user, EntityManagerInterface $em): Response
    {
        $message = $this->messages->find($id);
        if (!$message || $message->getRecipient() !== $user) {
            return $this->json(['message' => 'Message introuvable.'], Response::HTTP_NOT_FOUND);
        }

        if (null === $message->getReadAt()) {
            $message->setReadAt(new \DateTimeImmutable());
            $em->flush();
        }

        return $this->noStore($this->json($this->normalize($message, $user)));
    }

    /**
     * @return array<string, mixed>
     */
    private function normalize(Message $message, User $viewer): array
    {
        $data = $this->normalizer->normalize($message, 'json', ['groups' => ['message:read']]);
        $data['direction'] = $message->getSender() === $viewer ? 'sent' : 'received';

        return $data;
    }
}
