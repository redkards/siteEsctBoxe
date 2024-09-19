<?php

namespace App\Controller;

use App\Entity\Adresse;
use App\Repository\AdresseRepository;
use App\Repository\UserRepository;
use App\Repository\SalleRepository;
use Doctrine\ORM\EntityManagerInterface;
use JMS\Serializer\SerializerInterface;
use JMS\Serializer\SerializationContext;
use JMS\Serializer\Annotation\groups;
use Nelmio\ApiDocBundle\Annotation\Model;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Contracts\Cache\TagAwareCacheInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Contracts\Cache\ItemInterface;

class AdresseController extends AbstractController
{
    /**
     * Cette méthode permet de récupérer l'ensemble des adresses
     */
    // Définition d'une route pour obtenir tous les adresses via une requête GET.
    #[Route('/api/adresses', name: 'adresses', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: "Retourne la liste des adresses",
        content: new OA\JsonContent(
            type: "array",
            items: new OA\Items(ref: new Model(type: Adresse::class, groups: ["getAdresses"]))
        )
    )]
    #[OA\Tag(name: "Adresses")]
    public function getAllAdresses(AdresseRepository $adresseRepository, SerializerInterface $serializer, TagAwareCacheInterface $cache): JsonResponse
    {
        // Identifiant de cache pour cette requête
        $idCache = "getAllAdresses";

        // Récupération des données depuis le cache ou exécution de la requête si le cache est vide
        $jsonAdresseList = $cache->get($idCache, function (ItemInterface $item) use ($adresseRepository, $serializer) {
            $item->tag("adresseCache");
            $adresseList = $adresseRepository->findAll();
            $context = SerializationContext::create()->setGroups(['getAdresses','getUsers']);
            return $serializer->serialize($adresseList, 'json', $context);
        });

        // Retourne la liste des utilisateurs en JSON
        return new JsonResponse($jsonAdresseList, Response::HTTP_OK, [], true);
    }

     /**
     * Cette méthode permet de récupérer une adresse spécifique par son ID
     */
    // Définition d'une route pour récupérer les détails d'une adresse spécifique par son ID. La méthode HTTP autorisée est GET.
    #[Route('/api/adresses/{id}', name: 'detailAdresse', methods: ['GET'])]
    #[OA\Tag(name: "Adresses")]
    public function getAdresseDetails(Adresse $adresse, SerializerInterface $serializer): JsonResponse
    {
        $context = SerializationContext::create()->setGroups(['getAdresses']);
        // Sérialisation de l'utilisateur spécifié en JSON.
        $jsonAdresse = $serializer->serialize($adresse, 'json', $context);
        // Retour d'une réponse JSON avec les détails de l'utilisateur.
        return new JsonResponse($jsonAdresse, Response::HTTP_OK, [], true);
    }
     /**
     * Cette méthode permet de supprimer un utilisateur en fonction de son id
     */
    // Définition d'une route pour supprimer un utilisateur spécifique via une requête DELETE
    #[Route('/api/adresses/{id}', name: 'deleteAdresse', methods: ['DELETE'])]
    #[OA\Tag(name: "Adresses")]
    public function deleteAdresse(Adresse $adresse, EntityManagerInterface $em, TagAwareCacheInterface $cachePool, ): JsonResponse
    {
        // Invalide le cache associé aux users
        $cachePool->invalidateTags(["AdresseCache"]);

        // Suppression de l'utilsateur de la base de données
        $em->remove($adresse);

        // Application des changements dans la base de données
        $em->flush();

        // Retourne une réponse indiquant que le contenu n'existe plus
        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }
     /**
     * Cette méthode permet de mettre à jour une adresse
     */
    // Définition d'une route pour mettre à jour une adresse spécifique via une requête PUT
    #[Route('/api/adresses/{id}', name: 'updateAdresse', methods: ['PUT'])]
    #[OA\Put(
        path: "/api/adresses/{id}",
        summary: "Met à jour adresse existante",
        tags: ["Adresses"],
        requestBody: new OA\RequestBody(
            description: "Les informations de l'adresse à mettre à jour",
            required: true,
            content: new OA\JsonContent(
                ref: new Model(type: Adresse::class, groups: ["update"])
            )
        ),
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                description: "ID de l'adresse à mettre à jour",
                required: true,
                schema: new OA\Schema(type: "integer")
            )
        ],
        responses: [
            new OA\Response(
                response: 201,
                description: "adresse mis à jour avec succès",
                content: new OA\JsonContent(
                    type: "object",
                    properties: [
                        new OA\Property(property: "id", type: "integer"),
                        new OA\Property(property: "userId", type: "integer"),
                        new OA\Property(property: "salleId", type: "integer"),
                        new OA\Property(property: "numero", type: "integer"),
                        new OA\Property(property: "typeVoie", type: "string"),
                        new OA\Property(property: "nomVoie", type: "string"),
                        new OA\Property(property: "complementAdresse", type: "string"),
                        new OA\Property(property: "ville", type: "string"),
                        new OA\Property(property: "codePostal", type: "string"),
                        new OA\Property(property: "pays", type: "string"),
                    ]
                )
            ),
            new OA\Response(
                response: 400,
                description: "Données invalides fournies"
            ),
            new OA\Response(
                response: 404,
                description: "adresse non trouvé"
            )
        ]
    )]
    #[OA\Tag(name: "Adresses")]
    public function updateAdresse(int $id,
        Request $request,
        SerializerInterface $serializer,
        Adresse $currentAdresse,
        EntityManagerInterface $em,
        ValidatorInterface $validator,
        TagAwareCacheInterface $cachePool,
        UserRepository $userRepository,
        SalleRepository $salleRepository
    ): JsonResponse {
        // Décoder le contenu JSON de la requête
        $data = json_decode($request->getContent(), true);

// Vérifier que le décodage a fonctionné
if ($data === null) {
    return new JsonResponse(['message' => 'Le corps de la requête est invalide'], Response::HTTP_BAD_REQUEST);
}

        // Vérifiez que l'ID user est présent
        if (!isset($data['userId'])) {
            return new JsonResponse(['message' => "L'id user est requis"], Response::HTTP_BAD_REQUEST);
        }
        // Vérifiez que l'ID salle est présent
        if (!isset($data['salleId'])) {
            return new JsonResponse(['message' => "L'id salle est requis"], Response::HTTP_BAD_REQUEST);
        }

        // Récupérer l'utilisateur par l'ID
        $user = $userRepository->find($data['userId']);
        if (!$user) {
            return new JsonResponse(['message' => 'Utilisateur non trouvé'], Response::HTTP_NOT_FOUND);
        }

        // Récupérer l'utilisateur par l'ID
        $salle = $salleRepository->find($data['salleId']);
        if (!$salle) {
            return new JsonResponse(['message' => 'salle non trouvée'], Response::HTTP_NOT_FOUND);
        }

        // Vérification des champs de l'adresse dans $data
        $requiredFields = ['numero', 'typeVoie', 'NomVoie', 'complementAdresse', 'ville', 'codePostal', 'pays'];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field])) {
                return new JsonResponse(['message' => "Le champ $field est requis"], Response::HTTP_BAD_REQUEST);
            }
        }

        // Mise à jour des propriétés de l'adresse
        $currentAdresse->setNumero($data['numero']);
        $currentAdresse->setTypeVoie($data['typeVoie']);
        $currentAdresse->setNomVoie($data['NomVoie']);
        $currentAdresse->setComplementAdresse($data['complementAdresse']);
        $currentAdresse->setVille($data['ville']);
        $currentAdresse->setCodePostal($data['codePostal']);
        $currentAdresse->setPays($data['pays']);
        $currentAdresse->setUser($user);

        // Valider les nouvelles données de l'adresse
        $errors = $validator->validate($currentAdresse);
        if (count($errors) > 0) {
            return new JsonResponse($serializer->serialize($errors, 'json'), JsonResponse::HTTP_BAD_REQUEST, [], true);
        }

        // Persister les modifications dans la base de données
        try {
            $em->persist($currentAdresse);
            $em->flush();
        } catch (\Exception $e) {
            return new JsonResponse(['message' => 'Erreur lors de la mise à jour de l\'adresse'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        // Invalider le cache associé aux adresses
        $cachePool->invalidateTags(["adresseCache"]);

        // Retourner une réponse de succès
        return new JsonResponse(['message' => 'Adresse mise à jour avec succès'], JsonResponse::HTTP_OK);
    }

}
