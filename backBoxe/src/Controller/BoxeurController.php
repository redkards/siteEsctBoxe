<?php

namespace App\Controller;

use App\Entity\Boxeur;
use App\Repository\BoxeurRepository;
use App\Repository\CategorieRepository;
use App\Repository\BoxeTypeRepository;
use Doctrine\ORM\EntityManagerInterface;
use JMS\Serializer\SerializerInterface;
use JMS\Serializer\SerializationContext;
use JMS\Serializer\Annotation\groups;
use Nelmio\ApiDocBundle\Annotation\Model;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Contracts\Cache\TagAwareCacheInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Contracts\Cache\ItemInterface;
use Symfony\Component\Serializer\Normalizer\DateTimeNormalizer;

class BoxeurController extends AbstractController
{
   /**
     * Cette méthode permet de récupérer l'ensemble des boxeurs
     */
    // Définition d'une route pour récupérer tous les boxeurs. La méthode HTTP autorisée est GET.
    #[Route('/api/boxeurs', name: 'boxeur', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: "Retourne la liste des boxeurs",
        content: new OA\JsonContent(
            type: "array",
            items: new OA\Items(ref: new Model(type: Boxeur::class, groups: ["getBoxeurs"]))
        )
    )]
    #[OA\Tag(name: "boxeurs")]
    public function getAllBoxeurs(BoxeurRepository $boxeurRepository, SerializerInterface $serializer, TagAwareCacheInterface $cache): JsonResponse
    {
        // Identifiant de cache pour cette requête
        $idCache = "getAllBoxeurs";

        // Récupération des données depuis le cache ou exécution de la requête si le cache est vide
        $jsonBoxeurList = $cache->get($idCache, function (ItemInterface $item) use ($boxeurRepository, $serializer) {
            $item->tag("boxeursCache");
            $boxeurList = $boxeurRepository->findAll();
            $context = SerializationContext::create()->setGroups(['getBoxeurs']);
            return $serializer->serialize($boxeurList, 'json', $context);
        });

        // Retourne la liste des boxeurs en JSON
        return new JsonResponse($jsonBoxeurList, Response::HTTP_OK, [], true);
    }

    /**
     * Cette méthode permet de récupérer un boxeur spécifique par son ID
     */
    // Définition d'une route pour récupérer les détails d'un boxeur spécifique par son ID. La méthode HTTP autorisée est GET.
    #[Route('/api/boxeurs/{id}', name: 'detailBoxeur', methods: ['GET'])]
    #[OA\Tag(name: "boxeurs")]
    public function getBoxeurDetail(Boxeur $boxeur, SerializerInterface $serializer): JsonResponse
    {
        // Contexte de sérialisation pour le groupe 'getBoxeurs'
        $context = SerializationContext::create()->setGroups(['getBoxeurs']);

        // Sérialisation de l'boxeur en JSON
        $jsonBoxeur = $serializer->serialize($boxeur, 'json', $context);

        // Retourne les détails de l'boxeur en JSON
        return new JsonResponse($jsonBoxeur, Response::HTTP_OK, [], true);
    }

    /**
     * Cette méthode supprimer un boxeur en fonction de son id
     */
    // Définition d'une route pour supprimer un boxeur spécifique par son ID. La méthode HTTP autorisée est DELETE.
    #[Route('/api/boxeurs/{id}', name: 'deleteBoxeur', methods: ['DELETE'])]
    #[OA\Tag(name: "boxeurs")]
    public function deleteBoxeur(Boxeur $boxeur, EntityManagerInterface $em, TagAwareCacheInterface $cachePool): JsonResponse
    {
        // Invalide le cache associé aux boxeurs
        $cachePool->invalidateTags(["boxeursCache"]);

        // Suppression du boxeur de la base de données
        $em->remove($boxeur);
        $em->flush();

        // Retourne une réponse indiquant que le contenu n'existe plus
        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }

    /**
     * Cette méthodde permet de créer un nouveau boxeur
     */
    // Définition d'une route pour créer un nouveau boxeur. La méthode HTTP autorisée est POST.
    #[Route('/api/boxeurs', name: 'createBoxeur', methods: ['POST'])]
    #[OA\Post(
        path: "/api/boxeurs",
        summary: "Créé un nouveau boxeur",
        tags: ["boxeurs"],
        requestBody: new OA\RequestBody(
            description: "Les informations d'un boxeur à créer",
            required: true,
            content: new OA\JsonContent(
                ref: new Model(type: Boxeur::class, groups: ["create"])
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: "boxeur créé avec succès",
                content: new OA\JsonContent(
                    type: "object",
                    properties: [
                        new OA\Property(property: "id", type: "integer"),
                        new OA\Property(property: "poids", type: "float", ),
                        new OA\Property(property: "boxeurNom", type: "integer"),
                        new OA\Property(property: "boxeurPrenom", type: "string"),
                        new OA\Property(property: "boxeurDateNaissance", type: "string" ,format:"date"),
                    ]
                )
            ),
            new OA\Response(
                response: 400,
                description: "Erreur de validation",
            )
        ]
    )]
    #[OA\Tag(name: "boxeurs")]
    public function createBoxeur(Request $request, SerializerInterface $serializer, EntityManagerInterface $em, UrlGeneratorInterface $urlGenerator, ValidatorInterface $validator, TagAwareCacheInterface $cachePool, CategorieRepository $categorieRepository,
    BoxeTypeRepository $boxeTypeRepository ): JsonResponse
    {
    //     // Invalide le cache associé aux boxeurs
    //     $cachePool->invalidateTags(["boxeursCache"]);

    //     // Désérialisation du contenu de la requête pour créer une instance d'boxeur
    //     $data = json_decode($request->getContent(), true);

    //     // Conversion de la date au format ISO 8601 si nécessaire
    //     if (isset($data['boxeurDateNaissance'])) {
    //         $date = \DateTime::createFromFormat('Y-m-d', $data['boxeurDateNaissance']);
    //         if ($date) {
    //             $data['boxeurDateNaissance'] = $date->format(\DateTime::ATOM);
    //         }
    //     }

    //     // Désérialisation des données en objet boxeur
    //     $boxeur = $serializer->deserialize(json_encode($data), Boxeur::class, 'json');

    //     // Récupération des données envoyées avec la requête
    //     $content = $request->toArray();


    //     // Vérification des erreurs
    //     $errors = $validator->validate($boxeur);
    //     if ($errors->count() > 0) {
    //         return new JsonResponse($serializer->serialize($errors, 'json'), JsonResponse::HTTP_BAD_REQUEST, [], true);
    //     }

    //     // Persistance du nouvel boxeur en base de données
    //     $em->persist($boxeur);
    //     $em->flush();

    //     // Sérialisation de l'boxeur créé pour la réponse
    //     $context = SerializationContext::create()->setGroups(['getBoxeurs']);
    //     $jsonBoxeur = $serializer->serialize($boxeur, 'json', $context);

    //     // Génération de l'URL de la nouvelle ressource
    //     $location = $urlGenerator->generate('detailboxeur', ['id' => $boxeur->getId()], UrlGeneratorInterface::ABSOLUTE_URL);

    //     // Retourne l'boxeur créé avec l'URL de la nouvelle ressource
    //     return new JsonResponse($jsonBoxeur, Response::HTTP_CREATED, ['Location' => $location], true);
    // }

     // Invalide le cache associé aux boxeurs
     $cachePool->invalidateTags(["boxeursCache"]);

     // Désérialisation du contenu de la requête pour créer une instance de boxeur
     $data = json_decode($request->getContent(), true);

     // Ajoutez le normalizer au serializer si nécessaire
$serializer = new Serializer([new DateTimeNormalizer(['datetime_format' => 'Y-m-d'])]);


     // Désérialisation des données en objet boxeur
     $boxeur = $serializer->deserialize(json_encode($data), Boxeur::class, 'json');

     // Gestion de la date
     if (isset($data['boxeurDateNaissance'])) {
        $date = \DateTimeImmutable::createFromFormat('Y-m-d', $data['boxeurDateNaissance']);
        if ($date) {
            $boxeur->setBoxeurDateNaissance($date);  // DateTimeImmutable avec format Y-m-d
        } else {
            return new JsonResponse(['error' => 'Invalid date format, expected Y-m-d'], JsonResponse::HTTP_BAD_REQUEST);
        }
    }

     // Récupérer l'ID de la catégorie depuis la requête et associer la catégorie
     $categorieId = $data['categorieId'] ?? null;
     if ($categorieId) {
         $categorie = $categorieRepository->find($categorieId);
         if (!$categorie) {
             return new JsonResponse(['error' => 'Categorie not found'], JsonResponse::HTTP_BAD_REQUEST);
         }
         $boxeur->setCategorie($categorie);
     }

     // Récupérer l'ID du type de boxe depuis la requête et associer le type de boxe
     $boxeTypeId = $data['boxeTypeId'] ?? null;
     if ($boxeTypeId) {
         $boxeType = $boxeTypeRepository->find($boxeTypeId);
         if (!$boxeType) {
             return new JsonResponse(['error' => 'BoxeType not found'], JsonResponse::HTTP_BAD_REQUEST);
         }
         $boxeur->setBoxeType($boxeType);
     }

     // Vérification des erreurs
     $errors = $validator->validate($boxeur);
     if ($errors->count() > 0) {
         return new JsonResponse($serializer->serialize($errors, 'json'), JsonResponse::HTTP_BAD_REQUEST, [], true);
     }

     // Persistance du nouveau boxeur en base de données
     $em->persist($boxeur);
     $em->flush();

     // Sérialisation du boxeur créé pour la réponse
     $context = SerializationContext::create()->setGroups(['getBoxeurs']);
     $jsonBoxeur = $serializer->serialize($boxeur, 'json', $context);

     // Génération de l'URL de la nouvelle ressource
     $location = $urlGenerator->generate('detailboxeur', ['id' => $boxeur->getId()], UrlGeneratorInterface::ABSOLUTE_URL);

     // Retourne le boxeur créé avec l'URL de la nouvelle ressource
     return new JsonResponse($jsonBoxeur, JsonResponse::HTTP_CREATED, ['Location' => $location], true);
 }

    /**
     * Cette méthode permet de mettre à jour un boxeur
     */
    // Définition d'une route pour mettre à jour un boxeur spécifique par son ID. La méthode HTTP autorisée est PUT.
    #[Route('/api/boxeurs/{id}', name: 'updateBoxeur', methods: ['PUT'])]
    #[OA\Put(
        path: "/api/boxeurs/{id}",
        summary: "Met à jour un boxeur existant",
        tags: ["boxeurs"],
        requestBody: new OA\RequestBody(
            description: "Les informations de l'boxeur à mettre à jour",
            required: true,
            content: new OA\JsonContent(
                ref: new Model(type: Boxeur::class, groups: ["update"])
            )
        ),
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                description: "L'identifiant de l'boxeur à mettre à jour",
                required: true,
                schema: new OA\Schema(type: "integer")
            )
        ],
        responses: [
            new OA\Response(
                response: 204,
                description: "Classe mis à jour avec succès",
                content: new OA\JsonContent(
                    type: "object",
                    properties: [
                        new OA\Property(property: "id", type: "integer"),
                        new OA\Property(property: "poids", type: "float", ),
                        new OA\Property(property: "boxeurNom", type: "integer"),
                        new OA\Property(property: "boxeurPrenom", type: "string"),
                        new OA\Property(property: "boxeurDateNaissance", type: "string" ,format:"date"),
                    ]
                )
            ),
            new OA\Response(
                response: 400,
                description: "Erreur de validation"
            ),
            new OA\Response(
                response: 404,
                description: "boxeur non trouvé"
            )
        ]
    )]
    #[OA\Tag(name: "boxeurs")]
    public function updateBoxeur(Request $request, SerializerInterface $serializer, boxeur $currentboxeur, EntityManagerInterface $em, ValidatorInterface $validator, TagAwareCacheInterface $cachePool, ClasseRepository $classeRepository): JsonResponse
    {
        // Désérialisation du contenu de la requête pour créer une instance d'boxeur
        $data = json_decode($request->getContent(), true);

        // Conversion de la date au format ISO 8601 si nécessaire
        if (isset($data['boxeurDateNaissance'])) {
            $date = \DateTime::createFromFormat('Y-m-d', $data['boxeurDateNaissance']);
            if ($date) {
                $data['boxeurDateNaissance'] = $date->format(\DateTime::ATOM);
            }
        }

        // Désérialisation des nouvelles données en objet boxeur
        $newboxeur = $serializer->deserialize(json_encode($data), Boxeur::class, 'json');

        // Mise à jour des propriétés de l'objet boxeur existant
        $currentboxeur->setPoids($newboxeur->getPoids());
        $currentboxeur->setBoxeurNom($newboxeur->getBoxeurNom());
        $currentboxeur->setBoxeurPrenom($newboxeur->getBoxeurPrenom());
        $currentboxeur->setBoxeurDateNaissance($newboxeur->getBoxeurDateNaissance());

        // On vérifie les erreurs
        $errors = $validator->validate($currentboxeur);
        if ($errors->count() > 0) {
            return new JsonResponse($serializer->serialize($errors, 'json'), JsonResponse::HTTP_BAD_REQUEST, [], true);
        }

        $content = $request->toArray();


        // Persistance des modifications en base de données
        $em->persist($currentboxeur);
        $em->flush();

        // Invalide le cache associé aux boxeurs
        $cachePool->invalidateTags(["boxeursCache"]);

        // Retourne une réponse indiquant que la mise à jour a été effectuée avec succès
        return new JsonResponse(null, JsonResponse::HTTP_NO_CONTENT);
    }
}
