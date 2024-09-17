<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\MessagerieRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use JMS\Serializer\SerializerInterface;
use JMS\Serializer\SerializationContext;
use JMS\Serializer\Annotation\groups;
use Nelmio\ApiDocBundle\Annotation\Model;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\Cache\TagAwareCacheInterface;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Contracts\Cache\ItemInterface;

class UserController extends AbstractController
{
    /**
     * Cette méthode permet de récupérer l'ensemble des utilisateurs
     */
    // Définition d'une route pour obtenir tous les utilisateurs via une requête GET.
    #[Route('/api/users', name: 'users', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: "Retourne la liste des utilisateur",
        content: new OA\JsonContent(
            type: "array",
            items: new OA\Items(ref: new Model(type: User::class, groups: ["getUser"]))
        )
    )]
    #[OA\Tag(name: "Users")]
    public function getAllUsers(UserRepository $userRepository, SerializerInterface $serializer, TagAwareCacheInterface $cache): JsonResponse
    {
        // Identifiant de cache pour cette requête
        $idCache = "getAllUsers";

        // Récupération des données depuis le cache ou exécution de la requête si le cache est vide
        $jsonUserList = $cache->get($idCache, function (ItemInterface $item) use ($userRepository, $serializer) {
            $item->tag("usersCache");
            $userList = $userRepository->findAll();
            $context = SerializationContext::create()->setGroups(['getUsers']);
            return $serializer->serialize($userList, 'json', $context);
        });

        // Retourne la liste des utilisateurs en JSON
        return new JsonResponse($jsonUserList, Response::HTTP_OK, [], true);
    }

    /**
     * Cette méthode permet de récupérer un utilisateur spécifique par son ID
     */
    // Définition d'une route pour récupérer les détails d'un utilisateur spécifique par son ID. La méthode HTTP autorisée est GET.
    #[Route('/api/users/{id}', name: 'detailUser', methods: ['GET'])]
    #[OA\Tag(name: "Users")]
    public function getUserDetails(User $user, SerializerInterface $serializer): JsonResponse
    {
        $context = SerializationContext::create()->setGroups(['getUsers']);
        // Sérialisation de l'utilisateur spécifié en JSON.
        $jsonUser = $serializer->serialize($user, 'json', $context);
        // Retour d'une réponse JSON avec les détails de l'utilisateur.
        return new JsonResponse($jsonUser, Response::HTTP_OK, [], true);
    }

    /**
     * Cette méthode permet de supprimer un utilisateur en fonction de son id
     */
    // Définition d'une route pour supprimer un utilisateur spécifique via une requête DELETE
    #[Route('/api/users/{id}', name: 'deleteUser', methods: ['DELETE'])]
    #[OA\Tag(name: "Users")]
    public function deleteUser(User $user, EntityManagerInterface $em, TagAwareCacheInterface $cachePool, MessagerieRepository $messagerieRepository): JsonResponse
    {
        // Invalide le cache associé aux users
        $cachePool->invalidateTags(["usersCache"]);

        // Suppression de l'utilsateur de la base de données
        $em->remove($user);

        // Application des changements dans la base de données
        $em->flush();

        // Retourne une réponse indiquant que le contenu n'existe plus
        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }

    /**
     * Cette méthode permet de mettre à jour un utilisateur
     */
    // Définition d'une route pour mettre à jour un utilisateur spécifique via une requête PUT
    #[Route('/api/users/{id}', name: 'updateUser', methods: ['PUT'])]
    #[OA\Put(
        path: "/api/users/{id}",
        summary: "Met à jour utilisateur existant",
        tags: ["Users"],
        requestBody: new OA\RequestBody(
            description: "Les informations de l'utilisateur à mettre à jour",
            required: true,
            content: new OA\JsonContent(
                ref: new Model(type: User::class, groups: ["update"])
            )
        ),
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                description: "ID de l'utilisateur à mettre à jour",
                required: true,
                schema: new OA\Schema(type: "integer")
            )
        ],
        responses: [
            new OA\Response(
                response: 201,
                description: "Utilisateur mis à jour avec succès",
                content: new OA\JsonContent(
                    type: "object",
                    properties: [
                        new OA\Property(property: "id", type: "integer"),
                        new OA\Property(property: "messagerieId", type: "integer"),
                        new OA\Property(property: "email", type: "string"),
                        new OA\Property(property: "roles", type: "string"),
                        new OA\Property(property: "password", type: "string"),
                        new OA\Property(property: "nom", type: "string"),
                        new OA\Property(property: "prenom", type: "string"),
                        new OA\Property(property: "tel", type: "string"),
                        new OA\Property(property: "dateNaissance", type: "string"),
                    ]
                )
            ),
            new OA\Response(
                response: 400,
                description: "Données invalides fournies"
            ),
            new OA\Response(
                response: 404,
                description: "Utilisateur non trouvé"
            )
        ]
    )]
    #[OA\Tag(name: "Users")]
    public function updateUser(Request $request, SerializerInterface $serializer, User $currentUser, EntityManagerInterface $em, ValidatorInterface $validator, TagAwareCacheInterface $cachePool, EcoleRepository $ecoleRepository): JsonResponse
    {
        // Décoder le contenu JSON de la requête
        $data = json_decode($request->getContent(), true);

        // Vérifiez que l'ID de la messagerie est présent
        if (!isset($data['messagerieId'])) {
            return new JsonResponse(['message' => "L'id de la messagerie est requis"], Response::HTTP_BAD_REQUEST);
        }

        $messagerie = $messagerieRepository->find($data['messagerieId']);
        if (!$messagerie) {
            return new JsonResponse(['message' => 'messagerie non trouvée'], Response::HTTP_NOT_FOUND);
        }

        // Vérifiez que le rôle est présent
        if (!isset($data['roles'])) {
            return new JsonResponse(['message' => "Le rôle est requis"], Response::HTTP_BAD_REQUEST);
        }

        // Mettre à jour les propriétés de l'utilisateur
        $currentUser->setEmail($data['email']);
        $currentUser->setPassword(password_hash($data['password'], PASSWORD_BCRYPT));
        $currentUser->setNom($data['nom']);
        $currentUser->setprenom($data['prenom']);
        $currentUser->setTel($data['tel']);
        $currentUser->setDateNaissance($data['adresse']);
        $currentUser->setMessagerie($messagerie);
        $currentUser->setRoles([$data['roles']]);

        // Valider les nouvelles données de l'utilisateur
        $errors = $validator->validate($currentUser);
        if (count($errors) > 0) {
            return new JsonResponse($serializer->serialize($errors, 'json'), JsonResponse::HTTP_BAD_REQUEST, [], true);
        }

        // Persister les modifications dans la base de données
        $em->persist($currentUser);
        $em->flush();

        // Invalider le cache associé aux utilisateurs
        $cachePool->invalidateTags(["usersCache"]);

        // Retourner une réponse de succès
        return new JsonResponse(['message' => 'Utilisateur mis à jour avec succès'], JsonResponse::HTTP_CREATED);
    }

    /**
     * Cette méthode permet de récupérer un utilisateur par son email
     */
    #[Route('/api/users/email/{email}', name: 'getUserByEmail', methods: ['GET'])]
    #[OA\Tag(name: "Users")]
    public function getUserByEmail(string $email, UserRepository $userRepository, SerializerInterface $serializer): JsonResponse
    {
        // Recherche de l'utilisateur par son email
        $user = $userRepository->findOneBy(['email' => $email]);

        // Vérification si l'utilisateur existe
        if (!$user) {
            return new JsonResponse(['message' => 'Utilisateur non trouvé'], Response::HTTP_NOT_FOUND);
        }

        // Sérialisation de l'utilisateur en JSON
        $context = SerializationContext::create()->setGroups(['getUsers']);
        $jsonUser = $serializer->serialize($user, 'json', $context);

        // Retourne les détails de l'utilisateur en JSON
        return new JsonResponse($jsonUser, Response::HTTP_OK, [], true);
    }


    /**
     * Cette méthode permet à un utilisateur de modifier son mot de passe
     */
    #[Route('/api/users/changepassword/{email}', name: 'changePassword', methods: ['PUT'])]
    #[OA\Tag(name: "Users")]
    public function changePassword(User $user, Request $request, EntityManagerInterface $em, UserPasswordHasherInterface $hasher): JsonResponse
    {
        // Récupération du mot de passe actuel de l'utilisateur
        $currentPassword = $request->get('currentPassword');

        // Vérification si le mot de passe actuel est correct
        if (!$hasher->isPasswordValid($user, $currentPassword)) {
            return new JsonResponse(['message' => 'Mot de passe incorrect'], Response::HTTP_BAD_REQUEST);
        }

        // Récupération du nouveau mot de passes
        $newPassword = $request->get('newPassword');

        // Mise à jour du mot de passe de l'utilisateur
        $user->setPassword($hasher->hashPassword($user, $newPassword));

        // Persister les modifictions dans la base de données
        $em->persist($user);
        $em->flush();

        // Retourne une réponse de succès
        return new JsonResponse(['message' => 'Mot de passe mis à jour avec succès'], Response::HTTP_OK);
    }
}
