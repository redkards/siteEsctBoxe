<?php

namespace App\Controller;

use App\Entity\Messagerie;
use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use JMS\Serializer\Annotation\Groups;
use JMS\Serializer\SerializerInterface as SerializerSerializerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Nelmio\ApiDocBundle\Annotation\Model;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class RegisterController extends AbstractController
{
    // Version de la politique de confidentialité acceptée à l'inscription
    public const CONSENT_VERSION = '2026-10';

    public function __construct(
        #[Autowire('%env(MAILER_FROM)%')] private string $mailerFrom,
    ) {
    }

    // Définition de la route pour l'inscription d'un nouvel utilisateur
    #[Route('/api/register', name: 'register', methods: ['POST'])]
    #[OA\Post(
        path: "/api/register",
        summary: "Inscription d'un nouvel utilisateur",
        tags: ["Inscription"],
        requestBody: new OA\RequestBody(
            description: "Les informations de l'utilisateur à inscrire",
            required: true,
            content: new OA\JsonContent(
                ref: new Model(type: User::class, groups: ["create"])
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: "Utilisateur créé avec succès",
                content: new OA\JsonContent(
                    type: "object",
                    properties: [
                        new OA\Property(property: "email", type: "string"),
                        new OA\Property(property: "password", type: "string"),
                        new OA\Property(property: "nom", type: "string"),
                        new OA\Property(property: "prenom", type: "string"),
                        new OA\Property(property: "tel", type: "string"),
                        new OA\Property(property: "dateNaissance", type: "string"),
                        new OA\Property(property: "messagerieId", type: "integer"),
                    ]
                )
            ),
            new OA\Response(
                response: 400,
                description: "Erreur de validation",
            )
        ]
    )]
    #[Groups(["getUser"])]
    public function register(Request $request, EntityManagerInterface $manager, SerializerSerializerInterface $serializer, ValidatorInterface $validator, UserRepository $userRepository, UserPasswordHasherInterface $hasher, MailerInterface $mailer): Response
    {
        // Décoder le contenu JSON de la requête
        $data = json_decode($request->getContent(), true);

        foreach (['email', 'password', 'nom', 'prenom', 'tel'] as $champ) {
            if (empty($data[$champ]) || !is_string($data[$champ])) {
                return new JsonResponse(['message' => "Le champ $champ est requis."], Response::HTTP_BAD_REQUEST);
            }
        }

        // RGPD : consentement explicite obligatoire (case non pré-cochée côté front)
        if (($data['consent'] ?? false) !== true) {
            return new JsonResponse(['message' => "Vous devez accepter la politique de confidentialité."], Response::HTTP_BAD_REQUEST);
        }

        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            return new JsonResponse(['message' => "Adresse email invalide."], Response::HTTP_BAD_REQUEST);
        }

        // Recommandation ANSSI/CNIL : 12 caractères minimum, majuscule, minuscule et chiffre
        if (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{12,}$/', $data['password'])) {
            return new JsonResponse(['message' => "Le mot de passe doit contenir au moins 12 caractères, dont une majuscule, une minuscule et un chiffre."], Response::HTTP_BAD_REQUEST);
        }

        if ($userRepository->findOneBy(['email' => $data['email']])) {
            return new JsonResponse(['message' => "Un compte existe déjà avec cet email."], Response::HTTP_CONFLICT);
        }

        // Créer un nouvel utilisateur et définir ses propriétés
        $user = new User();
        $user->setEmail($data['email']);
        $user->setRoles(['ROLE_USER']);
        $user->setPassword($hasher->hashPassword($user, $data['password']));
        $user->giveConsent(self::CONSENT_VERSION);
        $user->setNom($data['nom']);
        $user->setPrenom($data['prenom']);
        $user->setTel($data['tel']);

        // Vérifier et définir la date de naissance
        if (isset($data['dateNaissance'])) {
            $dateNaissance = \DateTimeImmutable::createFromFormat('Y-m-d', $data['dateNaissance']);
            if (!$dateNaissance) {
                return new JsonResponse(['message' => "Format de date de naissance invalide, utilisez YYYY-MM-DD."], Response::HTTP_BAD_REQUEST);
            }
            $user->setDateNaissance($dateNaissance);
        } else {
            return new JsonResponse(['message' => "La date de naissance est requise."], Response::HTTP_BAD_REQUEST);
        }

        // Créer une nouvelle instance de Messagerie et l'associer à l'utilisateur
        $messagerie = new Messagerie();
        $manager->persist($messagerie);
        $user->setMessagerie($messagerie);

        // Valider l'utilisateur
        $errors = $validator->validate($user);
        if (count($errors) > 0) {
            return new JsonResponse($serializer->serialize($errors, 'json'), JsonResponse::HTTP_BAD_REQUEST, [], true);
        }

        // Persister l'utilisateur dans la base de données
        $manager->persist($user);
        $manager->flush();

        // Envoi d'un e-mail de confirmation
        $this->sendConfirmationEmail($mailer, $user->getEmail());

        // Retourner une réponse de succès
        return new JsonResponse(['message' => 'Utilisateur enregistré avec succès'], JsonResponse::HTTP_CREATED);
    }

    private function sendConfirmationEmail(MailerInterface $mailer, string $email): void
    {
        $confirmationEmail = (new Email())
            ->from($this->mailerFrom)
            ->to($email)
            ->subject('Confirmation d\'inscription')
            ->text("Bienvenue à l'ESCT Boxe ! Votre compte a bien été créé.\n\n"
                . "Vous pouvez à tout moment consulter, exporter ou supprimer vos données depuis votre profil.");

        $mailer->send($confirmationEmail);
    }
}
