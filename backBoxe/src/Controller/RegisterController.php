<?php

namespace App\Controller;

use App\Entity\Messagerie;
use App\Entity\User;
use App\Repository\MessagerieRepository;
use Doctrine\ORM\EntityManagerInterface;
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

class RegisterController extends AbstractController
{
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
    public function register(Request $request, EntityManagerInterface $manager, SerializerSerializerInterface $serializer, ValidatorInterface $validator, MessagerieRepository $messagerieRepository): Response
    {
        // Décoder le contenu JSON de la requête
        $data = json_decode($request->getContent(), true);

        // // Vérifiez que l'ID de messagerie est présent
        // if (!isset($data['messagerieId'])) {
        //     return new JsonResponse(['message' => "L'id de messagerie est requis"], Response::HTTP_BAD_REQUEST);
        // }

        // $messagerie = $messagerieRepository->find($data['messagerieId']);
        // if (!$messagerie) {
        //     return new JsonResponse(['message' => 'messagerie non trouvée'], Response::HTTP_NOT_FOUND);
        // }

        // Créer un nouvel utilisateur et définir ses propriétés
        $user = new User();
        $user->setEmail($data['email']);
        $user->setRoles(['ROLE_USER']);
        $user->setPassword(password_hash($data['password'], PASSWORD_BCRYPT));
        $user->setNom($data['nom']);
        $user->setPrenom($data['prenom']);
        $user->setTel($data['tel']);
        $user->setDateNaissance($data['dateNaissance']);
        $user->setMessagerie($messagerie);

        // // Créer une nouvelle instance de Messagerie et l'associer à l'utilisateur
        // $messagerie = new Messagerie();
        // $manager->persist($messagerie);
        // $user->setMessagerie($messagerie);

        // Valider l'utilisateur
        $errors = $validator->validate($user);
        if (count($errors) > 0) {
            return new JsonResponse($serializer->serialize($errors, 'json'), JsonResponse::HTTP_BAD_REQUEST, [], true);
        }

        // Persister l'utilisateur dans la base de données
        $manager->persist($user);
        $manager->flush();

        // Retourner une réponse de succès
        return new JsonResponse(['message' => 'Utilisateur enregistré avec succès'], JsonResponse::HTTP_CREATED);
    }
}
