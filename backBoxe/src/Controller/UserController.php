<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\MessagerieRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use JMS\Serializer\SerializerInterface;
use JMS\Serializer\SerializationContext;
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
use Symfony\Component\HttpFoundation\File\UploadedFile;

class UserController extends AbstractController
{
    /**
     * Cette méthode permet de récupérer l'ensemble des utilisateurs
     */
    #[Route('/api/users', name: 'users', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: "Retourne la liste des utilisateurs",
        content: new OA\JsonContent(
            type: "array",
            items: new OA\Items(ref: new Model(type: User::class, groups: ["getUser"]))
        )
    )]
    #[OA\Tag(name: "Users")]
    public function getAllUsers(UserRepository $userRepository, SerializerInterface $serializer, TagAwareCacheInterface $cache): JsonResponse
    {
        $idCache = "getAllUsers";
        $jsonUserList = $cache->get($idCache, function (ItemInterface $item) use ($userRepository, $serializer) {
            $item->tag("usersCache");
            $userList = $userRepository->findAll();
            $context = SerializationContext::create()->setGroups(['getUsers', 'getMessageries', 'getAdresses']);
            return $serializer->serialize($userList, 'json', $context);
        });

        return new JsonResponse($jsonUserList, Response::HTTP_OK, [], true);
    }

    /**
     * Cette méthode permet de récupérer un utilisateur spécifique par son ID
     */
    #[Route('/api/users/{id}', name: 'detailUser', methods: ['GET'])]
    #[OA\Tag(name: "Users")]
    public function getUserDetails(User $user, SerializerInterface $serializer): JsonResponse
    {
        $context = SerializationContext::create()->setGroups(['getUsers']);
        $jsonUser = $serializer->serialize($user, 'json', $context);
        return new JsonResponse($jsonUser, Response::HTTP_OK, [], true);
    }

    /**
     * Cette méthode permet de supprimer un utilisateur en fonction de son id
     */
    #[Route('/api/users/{id}', name: 'deleteUser', methods: ['DELETE'])]
    #[OA\Tag(name: "Users")]
    public function deleteUser(User $user, EntityManagerInterface $em, TagAwareCacheInterface $cachePool): JsonResponse
    {
        $cachePool->invalidateTags(["usersCache"]);
        $em->remove($user);
        $em->flush();
        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }

    /**
 * Cette méthode permet de créer un nouvel utilisateur
 */
#[Route('/api/users', name: 'createUser', methods: ['POST'])]
#[OA\Post(
    path: "/api/users",
    summary: "Crée un nouvel utilisateur",
    tags: ["Users"],
    requestBody: new OA\RequestBody(
        description: "Les informations de l'utilisateur à créer",
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
                    new OA\Property(property: "id", type: "integer"),
                    new OA\Property(property: "messagerieId", type: "integer"),
                    new OA\Property(property: "email", type: "string"),
                    new OA\Property(property: "roles", type: "string"),
                    new OA\Property(property: "password", type: "string"),
                    new OA\Property(property: "nom", type: "string"),
                    new OA\Property(property: "prenom", type: "string"),
                    new OA\Property(property: "tel", type: "string"),
                    new OA\Property(property: "dateNaissance", type: "string"),
                    new OA\Property(property: "profilePicture", type: "string"),
                ]
            )
        ),
        new OA\Response(
            response: 400,
            description: "Erreur de validation"
        )
    ]
)]
#[OA\Tag(name: "Users")]
public function createUser(Request $request, EntityManagerInterface $em,
 UserPasswordHasherInterface $hasher, ValidatorInterface $validator, MessagerieRepository $messagerieRepository): JsonResponse
{
    // Décoder le contenu JSON de la requête
    $data = json_decode($request->getContent(), true);

    // Vérifier si tous les champs requis sont présents
    $requiredFields = ['email', 'password', 'nom', 'prenom', 'tel', 'dateNaissance'];
    foreach ($requiredFields as $field) {
        if (!isset($data[$field])) {
            return new JsonResponse(['message' => "Le champ '$field' est requis."], Response::HTTP_BAD_REQUEST);
        }
    }

    // Vérifier si la messagerie est fournie
    $messagerie = isset($data['messagerieId']) ? $messagerieRepository->find($data['messagerieId']) : null;

    // Créer un nouvel utilisateur
    $user = new User();
    $user->setEmail($data['email']);
    $user->setPassword($hasher->hashPassword($user, $data['password']));
    $user->setNom($data['nom']);
    $user->setPrenom($data['prenom']);
    $user->setTel($data['tel']);
    $user->setDateNaissance(new \DateTimeImmutable($data['dateNaissance'])); 
    $user->setProfilePicture($data['profilePicture']);
    $user->setMessagerie($messagerie);

     // Attribuer le rôle par défaut
     $user->setRoles(['ROLE_User']); 

     // verifie la présence de profilPictures

if (isset($data['profilePicture'])) {
    $profilePicture = $data['profilePicture'];
} else {
    // Gérer le cas où 'profilePicture' n'est pas présent
    $profilePicture = null; 
}

    // Valider les données de l'utilisateur
    $errors = $validator->validate($user);
    if (count($errors) > 0) {
        return new JsonResponse(['message' => 'Validation échouée', 'errors' => (string) $errors], Response::HTTP_BAD_REQUEST);
    }

    // Persist le nouvel utilisateur dans la base de données
    $em->persist($user);
    $em->flush();

    // Retourne une réponse de succès avec les détails de l'utilisateur créé
    return new JsonResponse(['message' => 'Utilisateur créé avec succès', 'userId' => $user->getId()], Response::HTTP_CREATED);
}

    /**
     * Cette méthode permet de mettre à jour un utilisateur
     */
    #[Route('/api/users/{id}', name: 'updateUser', methods: ['PUT'])]
    #[OA\Put(
        path: "/api/users/{id}",
        summary: "Met à jour un utilisateur existant",
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
                response: 200,
                description: "Utilisateur mis à jour avec succès",
                content: new OA\JsonContent(
                    type: "object",
                    properties: [
                        new OA\Property(property: "message", type: "string"),
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
    public function updateUser(Request $request, SerializerInterface $serializer, User $currentUser,
     EntityManagerInterface $em, ValidatorInterface $validator, TagAwareCacheInterface $cachePool,
      MessagerieRepository $messagerieRepository, UserPasswordHasherInterface $hasher): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (isset($data['messagerieId'])) {
            $messagerie = $messagerieRepository->find($data['messagerieId']);
            if (!$messagerie) {
                return new JsonResponse(['message' => 'Messagerie non trouvée'], Response::HTTP_NOT_FOUND);
            }
            $currentUser->setMessagerie($messagerie);
        }

        $currentUser->setEmail($data['email'] ?? $currentUser->getEmail());
        if (isset($data['password'])) {
            $currentUser->setPassword($hasher->hashPassword($currentUser, $data['password']));
        }
        $currentUser->setNom($data['nom'] ?? $currentUser->getNom());
        $currentUser->setPrenom($data['prenom'] ?? $currentUser->getPrenom());
        $currentUser->setTel($data['tel'] ?? $currentUser->getTel());
        $currentUser->setDateNaissance(new \DateTimeImmutable($data['dateNaissance'] ?? $currentUser->getDateNaissance()->format('Y-m-d')));
        $currentUser->setProfilePicture($data['profilePicture'] ?? $currentUser->getProfilePicture());
        $errors = $validator->validate($currentUser);
        if (count($errors) > 0) {
            return new JsonResponse($serializer->serialize($errors, 'json'), JsonResponse::HTTP_BAD_REQUEST, [], true);
        }

        $em->persist($currentUser);
        $em->flush();
        $cachePool->invalidateTags(["usersCache"]);

        return new JsonResponse(['message' => 'Utilisateur mis à jour avec succès'], JsonResponse::HTTP_OK);
    }

    /**
     * Cette méthode permet de récupérer un utilisateur par son email
     */
    #[Route('/api/users/email/{email}', name: 'getUserByEmail', methods: ['GET'])]
    #[OA\Tag(name: "Users")]
    public function getUserByEmail(string $email, UserRepository $userRepository, SerializerInterface $serializer): JsonResponse
    {
        $user = $userRepository->findOneBy(['email' => $email]);

        if (!$user) {
            return new JsonResponse(['message' => 'Utilisateur non trouvé'], Response::HTTP_NOT_FOUND);
        }

        $context = SerializationContext::create()->setGroups(['getUsers']);
        $jsonUser = $serializer->serialize($user, 'json', $context);
        return new JsonResponse($jsonUser, Response::HTTP_OK, [], true);
    }

 



#[Route('/api/users/{id}/upload-profile-picture', name: 'uploadProfilePicture', methods: ['POST'])]
public function uploadProfilePicture(Request $request, User $user, EntityManagerInterface $em, FileUploadController $fileUploadController): JsonResponse
{
    /** @var UploadedFile $file */
    $file = $request->files->get('file');

    if (!$file) {
        return new JsonResponse(['error' => 'No file uploaded'], Response::HTTP_BAD_REQUEST);
    }

    // Appel de la méthode d'upload dans le FileUploadController
    $uploadResponse = $fileUploadController->upload($request);

    if ($uploadResponse->getStatusCode() !== Response::HTTP_OK) {
        return $uploadResponse;
    }

    $filename = json_decode($uploadResponse->getContent(), true)['filename'];
    $user->setProfilePicture($filename);
    $em->persist($user);
    $em->flush();

    return new JsonResponse(['message' => 'Profile picture uploaded successfully', 'filename' => $filename], Response::HTTP_OK);
}

#[Route('/api/users/{id}/profile-picture', name: 'loadProfilePicture', methods: ['GET'])]
public function loadProfilePicture(User $user): JsonResponse
{
    $profilePicture = $user->getProfilePicture();

    if (!$profilePicture) {
        return new JsonResponse(['error' => 'No profile picture found'], Response::HTTP_NOT_FOUND);
    }

    // Vous pouvez renvoyer soit l'URL complète de l'image, soit le nom du fichier pour que le frontend puisse le gérer
    $profilePictureUrl = '/uploads/profile_pictures/' . $profilePicture;

    return new JsonResponse(['profilePicture' => $profilePictureUrl], Response::HTTP_OK);
}



}
