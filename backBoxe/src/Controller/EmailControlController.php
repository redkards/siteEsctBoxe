<?php

namespace App\Controller;

use App\Entity\EmailTable; // Importer l'entité EmailTable
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Annotation\Route;

class EmailControlController extends AbstractController
{
    private $mailer;
    private $entityManager;

    public function __construct(MailerInterface $mailer, EntityManagerInterface $entityManager)
    {
        $this->mailer = $mailer;
        $this->entityManager = $entityManager;
    }

    #[Route('/api/send-email', name: 'send_email', methods: ['POST'])]
    public function sendEmail(Request $request): JsonResponse
    {
        // Récupération des données de la requête
        $data = json_decode($request->getContent(), true);
        $emailAddress = $data['email'] ?? null; // L'email de l'expéditeur
        $messageContent = $data['message'] ?? null; // Le contenu du message

        // Vérifier les données
        if (!$emailAddress || !$messageContent) {
            return new JsonResponse(['error' => 'Données manquantes'], 400);
        }

        // Créer et envoyer l'email
        $email = (new Email())
            ->from('redkardss@gmail.com') // Adresse de l'expéditeur Mailgun
            ->to('redkardss@gmail.com') // Adresse de destination
            ->subject('Nouveau message du formulaire de contact')
            ->text($messageContent)
            ->replyTo($emailAddress);

        // Envoi de l'email via Mailgun
        try {
            $this->mailer->send($email);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Échec de l\'envoi de l\'email: ' . $e->getMessage()], 500);
        }

        // Enregistrement dans la base de données
        $emailEntity = new EmailTable(); // Utiliser l'entité EmailTable
        $emailEntity->setEmailAdresse($emailAddress); // Assurez-vous que cette méthode existe
        $emailEntity->setEmailMsg($messageContent); // Assurez-vous que cette méthode existe

        $this->entityManager->persist($emailEntity);
        $this->entityManager->flush();

        // Envoyer une notification à votre adresse e-mail
        $notificationEmail = (new Email())
            ->from($emailAddress) // Adresse de l'expéditeur
            ->to('redkardss@gmail.com') // Remplacez par votre adresse e-mail
            ->subject('Nouvel e-mail enregistré')
            ->text("Un nouvel e-mail a été enregistré:\n\nExpéditeur: $emailAddress\nMessage: $messageContent");

        // Envoi de la notification via Mailgun
        try {
            $this->mailer->send($notificationEmail);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Échec de l\'envoi de la notification: ' . $e->getMessage()], 500);
        }

        return new JsonResponse(['message' => 'Email envoyé et enregistré avec succès'], 200);
    }
}


    //     #[Route('/api/send-email', name: 'send_email', methods: ['POST'])]
    // public function sendEmail(Request $request, MailerInterface $mailer, EntityManagerInterface $entityManager): JsonResponse
    // {
    //     $data = json_decode($request->getContent(), true);
    //     $emailAddress = $data['email'] ?? null; // L'email de l'expéditeur
    //     $messageContent = $data['message'] ?? null; // Le contenu du message

    //     // Vérifier les données
    //     if (!$emailAddress || !$messageContent) {
    //         return new JsonResponse(['error' => 'Données manquantes'], 400);
    //     }

    //     // Créer et envoyer l'email
    //     $email = (new SymfonyEmail())
    //         ->from($emailAddress) // L'adresse de l'expéditeur est maintenant l'email saisi
    //         ->to('bboutard@gmail.com') // L'adresse de destination
    //         ->subject('Nouveau message du formulaire de contact')
    //         ->text($messageContent)
    //         ->replyTo($emailAddress);

    //     // Envoi de l'email
    //     try {
    //         $mailer->send($email);
    //     } catch (\Exception $e) {
    //         return new JsonResponse(['error' => 'Erreur lors de l\'envoi de l\'email: ' . $e->getMessage()], 500);
    //     }

    //     // Enregistrement dans la base de données
    //     $emailEntity = new EmailTable(); // Utiliser l'entité EmailTable
    //     $emailEntity->setEmailAdresse($emailAddress); // Assurez-vous que cette méthode existe
    //     $emailEntity->setEmailMsg($messageContent); // Assurez-vous que cette méthode existe
    //     $emailEntity->setCreatedAt(new \DateTimeImmutable()); // Ajout de la date de création

    //     $entityManager->persist($emailEntity);
    //     $entityManager->flush();

    //     // Envoyer une notification à votre adresse e-mail
    //     $notificationEmail = (new SymfonyEmail())
    //         ->from($emailAddress) // L'adresse de l'expéditeur est maintenant l'email saisi
    //         ->to('redkardss@gmail.com') // Remplacez par votre adresse e-mail pour la notification
    //         ->subject('Nouvel e-mail enregistré')
    //         ->text("Un nouvel e-mail a été enregistré:\n\nExpéditeur: $emailAddress\nMessage: $messageContent");

    //     // Envoi de la notification
    //     try {
    //         $mailer->send($notificationEmail);
    //     } catch (\Exception $e) {
    //         // Optionnel : vous pouvez enregistrer cette erreur dans les logs
    //         error_log('Erreur lors de l\'envoi de la notification: ' . $e->getMessage());
    //     }

    //     return new JsonResponse(['message' => 'Email envoyé et enregistré avec succès'], 200);
    // }
