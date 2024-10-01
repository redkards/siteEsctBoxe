<?php

namespace App\Controller;

use App\Entity\Boxeur;
use App\Repository\BoxeurRepository;
use App\Repository\CategorieRepository;
use App\Repository\BoxeTypeRepository;
use Doctrine\ORM\EntityManagerInterface;
use JMS\Serializer\SerializerInterface;
use JMS\Serializer\SerializationContext;
use JMS\Serializer\Annotation\Groups;
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
    // Récupération de tous les boxeurs
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
        $idCache = "getAllBoxeurs";

        $jsonBoxeurList = $cache->get($idCache, function (ItemInterface $item) use ($boxeurRepository, $serializer) {
            $item->tag("boxeursCache");
            $boxeurList = $boxeurRepository->findAll();
            $context = SerializationContext::create()->setGroups(['getBoxeurs']);
            return $serializer->serialize($boxeurList, 'json', $context);
        });

        return new JsonResponse($jsonBoxeurList, Response::HTTP_OK, [], true);
    }

    // Récupération d'un boxeur spécifique par son ID
    #[Route('/api/boxeurs/{id}', name: 'detailBoxeur', methods: ['GET'])]
    #[OA\Tag(name: "boxeurs")]
    public function getBoxeurDetail(Boxeur $boxeur, SerializerInterface $serializer): JsonResponse
    {
        $context = SerializationContext::create()->setGroups(['getBoxeurs']);
        $jsonBoxeur = $serializer->serialize($boxeur, 'json', $context);
        return new JsonResponse($jsonBoxeur, Response::HTTP_OK, [], true);
    }

    // Suppression d'un boxeur par son ID
    #[Route('/api/boxeurs/{id}', name: 'deleteBoxeur', methods: ['DELETE'])]
    #[OA\Tag(name: "boxeurs")]
    public function deleteBoxeur(Boxeur $boxeur, EntityManagerInterface $em, TagAwareCacheInterface $cachePool): JsonResponse
    {
        $cachePool->invalidateTags(["boxeursCache"]);
        $em->remove($boxeur);
        $em->flush();
        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }

    // Création d'un nouveau boxeur
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
                content: new OA\JsonContent(type: "object", properties: [
                    new OA\Property(property: "id", type: "integer"),
                    new OA\Property(property: "poids", type: "float"),
                    new OA\Property(property: "boxeurNom", type: "string"),
                    new OA\Property(property: "boxeurPrenom", type: "string"),
                    new OA\Property(property: "boxeurDateNaissance", type: "string", format: "date"),
                ])
            ),
            new OA\Response(
                response: 400,
                description: "Erreur de validation"
            )
        ]
    )]
    #[OA\Tag(name: "boxeurs")]
    public function createBoxeur(
        Request $request,
        SerializerInterface $serializer,
        EntityManagerInterface $em,
        UrlGeneratorInterface $urlGenerator,
        ValidatorInterface $validator,
        TagAwareCacheInterface $cachePool,
        CategorieRepository $categorieRepository,
        BoxeTypeRepository $boxeTypeRepository
    ): JsonResponse {
        $cachePool->invalidateTags(["boxeursCache"]);
        $data = json_decode($request->getContent(), true);

        // Gestion de la date
        if (isset($data['boxeurDateNaissance'])) {
            $date = \DateTimeImmutable::createFromFormat('Y-m-d', $data['boxeurDateNaissance']);
            if (!$date) {
                return new JsonResponse(['error' => 'Invalid date format, expected Y-m-d'], JsonResponse::HTTP_BAD_REQUEST);
            }
        }

        $boxeur = new Boxeur();
        $boxeur->setBoxeurNom($data['boxeurNom']);
        $boxeur->setBoxeurPrenom($data['boxeurPrenom']);
        $boxeur->setBoxeurDateNaissance($date);

        // Récupération de l'ID de la catégorie et association
        $categorieId = $data['categorieId'] ?? null;
        if ($categorieId) {
            $categorie = $categorieRepository->find($categorieId);
            if (!$categorie) {
                return new JsonResponse(['error' => 'Categorie not found'], JsonResponse::HTTP_BAD_REQUEST);
            }
            $boxeur->setCategorie($categorie);
        }

        // Récupération de l'ID du type de boxe et association
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

        $em->persist($boxeur);
        $em->flush();

        $context = SerializationContext::create()->setGroups(['getBoxeurs']);
        $jsonBoxeur = $serializer->serialize($boxeur, 'json', $context);
        $location = $urlGenerator->generate('detailBoxeur', ['id' => $boxeur->getId()], UrlGeneratorInterface::ABSOLUTE_URL);

        return new JsonResponse($jsonBoxeur, JsonResponse::HTTP_CREATED, ['Location' => $location], true);
    }

    // Mise à jour d'un boxeur
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
                description: "Classe mis à jour avec succès"
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
    public function updateBoxeur(
        Request $request,
        SerializerInterface $serializer,
        Boxeur $currentboxeur,
        EntityManagerInterface $em,
        ValidatorInterface $validator,
        TagAwareCacheInterface $cachePool,
        CategorieRepository $categorieRepository,
        BoxeTypeRepository $boxeTypeRepository
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        // Gestion de la date
        if (isset($data['boxeurDateNaissance'])) {
            $date = \DateTimeImmutable::createFromFormat('Y-m-d', $data['boxeurDateNaissance']);
            if (!$date) {
                return new JsonResponse(['error' => 'Invalid date format, expected Y-m-d'], JsonResponse::HTTP_BAD_REQUEST);
            }
        }

        // Mise à jour des attributs
        if (isset($data['poids'])) {
            $currentboxeur->setPoids($data['poids']);
        }
        if (isset($data['boxeurNom'])) {
            $currentboxeur->setBoxeurNom($data['boxeurNom']);
        }
        if (isset($data['boxeurPrenom'])) {
            $currentboxeur->setBoxeurPrenom($data['boxeurPrenom']);
        }
        if (isset($data['boxeurDateNaissance'])) {
            $currentboxeur->setBoxeurDateNaissance($date);
        }

        // Récupération de l'ID de la catégorie et mise à jour
        if (isset($data['categorieId'])) {
            $categorie = $categorieRepository->find($data['categorieId']);
            if (!$categorie) {
                return new JsonResponse(['error' => 'Categorie not found'], JsonResponse::HTTP_BAD_REQUEST);
            }
            $currentboxeur->setCategorie($categorie);
        }

        // Récupération de l'ID du type de boxe et mise à jour
        if (isset($data['boxeTypeId'])) {
            $boxeType = $boxeTypeRepository->find($data['boxeTypeId']);
            if (!$boxeType) {
                return new JsonResponse(['error' => 'BoxeType not found'], JsonResponse::HTTP_BAD_REQUEST);
            }
            $currentboxeur->setBoxeType($boxeType);
        }

        // Vérification des erreurs
        $errors = $validator->validate($currentboxeur);
        if ($errors->count() > 0) {
            return new JsonResponse($serializer->serialize($errors, 'json'), JsonResponse::HTTP_BAD_REQUEST, [], true);
        }

        $em->flush();
        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }
}
