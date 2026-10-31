<?php

namespace App\Controller\Api;

use App\Dto\ContactRequest;
use App\Entity\ContactMessage;
use App\Service\MailService;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\RateLimiter\RateLimiterFactoryInterface;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Formulaire de contact public : message enregistré (back-office) et notifié au club par email.
 */
class ContactController extends AbstractController
{
    #[Route('/api/contact', name: 'api_contact', methods: ['POST'])]
    public function send(
        #[MapRequestPayload] ContactRequest $payload,
        Request $request,
        EntityManagerInterface $em,
        MailService $mail,
        LoggerInterface $logger,
        RateLimiterFactoryInterface $contactLimiter,
    ): Response {
        if (!$contactLimiter->create($request->getClientIp())->consume()->isAccepted()) {
            return $this->json(['message' => 'Trop de messages, réessayez dans quelques minutes.'], Response::HTTP_TOO_MANY_REQUESTS);
        }

        $message = (new ContactMessage())
            ->setName(trim($payload->name))
            ->setEmail(mb_strtolower(trim($payload->email)))
            ->setSubject(trim($payload->subject))
            ->setMessage(trim($payload->message));
        $em->persist($message);
        $em->flush();

        try {
            $mail->sendContactNotification($message);
        } catch (TransportExceptionInterface $e) {
            $logger->error('Echec email de contact', ['contactId' => $message->getId(), 'error' => $e->getMessage()]);
        }

        return $this->json(['message' => 'Merci, votre message a bien été transmis au club.'], Response::HTTP_ACCEPTED);
    }
}
