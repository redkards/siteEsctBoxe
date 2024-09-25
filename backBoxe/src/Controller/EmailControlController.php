<?php
namespace App\Controller;

use App\Entity\EmailTable; // Importer l'entité EmailTable
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email as SymfonyEmail;
use Symfony\Component\Routing\Annotation\Route;

class EmailControlController extends AbstractController
{
    #[Route('/api/send-email', name: 'send_email', methods: ['POST'])]
    public function sendEmail(Request $request, MailerInterface $mailer, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $emailAddress = $data['email'] ?? null; // L'email de l'expéditeur
        $messageContent = $data['message'] ?? null; // Le contenu du message

        // Vérifier les données
        if (!$emailAddress || !$messageContent) {
            return new JsonResponse(['error' => 'Données manquantes'], 400);
        }

        // Créer et envoyer l'email
        $email = (new SymfonyEmail())
            ->from($emailAddress)
            ->to('bboutard@gmail.com')
            ->subject('Nouveau message du formulaire de contact')
            ->text($messageContent)
            ->replyTo($emailAddress);

        // Envoi de l'email
        $mailer->send($email);

        // Enregistrement dans la base de données
        $emailEntity = new EmailTable(); // Utiliser l'entité EmailTable
        $emailEntity->setEmailAdresse($emailAddress); // Assurez-vous que cette méthode existe
        $emailEntity->setEmailMsg($messageContent); // Assurez-vous que cette méthode existe

        $entityManager->persist($emailEntity);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Email envoyé et enregistré avec succès'], 200);
    }
}
