<?php

namespace App\Controller;

use App\Entity\Messagerie;
use App\Repository\MessageRepository;
use App\Repository\MessagerieRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Contracts\Cache\ItemInterface;
use Symfony\Contracts\Cache\TagAwareCacheInterface;
use JMS\Serializer\SerializerInterface;
use JMS\Serializer\SerializationContext;
use Nelmio\ApiDocBundle\Annotation\Model;
use OpenApi\Attributes as OA;

// Déclaration de la classe messagerieController qui étend AbstractController de Symfony
class MessagerieController extends AbstractController
{
    /**
     * Cette méthode permet de récupérer l'ensemble de la messagerie
     */
    // Définition d'une route pour obtenir toutes les messageries via une requête GET.
    #[Route('/api/messageries', name: 'messageries', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: "Retourne la liste de la messagerie",
        content: new OA\JsonContent(
            type: "array",
            items: new OA\Items(ref: new Model(type: Messagerie::class, groups: ["getMessageries"]))
        )
    )]
    #[OA\Tag(name: "messageries")]
    public function getAllMessageries(MessagerieRepository $messagerieRepository, SerializerInterface $serializer, TagAwareCacheInterface $cache): JsonResponse
    {
        // Identifiant de cache pour cette requête
        $idCache = "getAllmessageries";

        // Récupération des données depuis le cache ou exécution de la requête si le cache est vide
        $jsonmessagerieList = $cache->get($idCache, function (ItemInterface $item) use ($messagerieRepository, $serializer) {
            $item->tag("messagerieCache");
            $messagerieList = $messagerieRepository->findAll();
            $context = SerializationContext::create()->setGroups(['getMessageries']);
            return $serializer->serialize($messagerieList, 'json', $context);
        });

        // Retourne la liste des messageries en JSON
        return new JsonResponse($jsonmessagerieList, Response::HTTP_OK, [], true);
    }

    /**
     * Cette méthode permet de récupérer une messagerie spécifique par son ID
     */
    // Définition d'une route pour récupérer les détails d'une messagerie spécifique par son ID. La méthode HTTP autorisée est GET.
    #[Route('/api/messageries/{id}', name: 'detailMessagerie', methods: ['GET'])]
    #[OA\Tag(name: "messageries")]
    public function getMessagerieDetail(Messagerie $messagerie, SerializerInterface $serializer): JsonResponse
    {
        // Contexte de sérialisation pour le groupe 'getMessageries'
        $context = SerializationContext::create()->setGroups(['getMessageries']);
        // Sérialisation de la messagerie en JSON
        $jsonmessagerie = $serializer->serialize($messagerie, 'json', $context);
        // Retour d'une réponse JSON avec les détails de la messagerie.
        return new JsonResponse($jsonmessagerie, Response::HTTP_OK, [], true);
    }

    /**
     * Cette méthode permet de supprimer une messagerie en fonction de son id
     */
    // Définition d'une route pour supprimer une messagerie spécifique via une requête DELETE
    #[Route('/api/messageries/{id}', name: 'deleteMessagerie', methods: ['DELETE'])]
    #[OA\Tag(name: "messageries")]
    public function deleteMessagerie(Messagerie $messagerie, EntityManagerInterface $entityManager, MessageRepository $messageRepository, TagAwareCacheInterface $cachePool): JsonResponse
    {
        $cachePool->invalidateTags(["messageriesCache"]);
        // Récupération des messages de la messagerie
        $message = $messageRepository->findBy(['messagerie' => $messagerie]);
        // Suppression des messages de la messagerie
        foreach ($message as $message) {
            $entityManager->remove($message);
        }
        // Suppression de la messagerie
        $entityManager->remove($messagerie);
        // Application des changements dans la base de données
        $entityManager->flush();
        // Retour d'une réponse JSON indiquant que l'école a été supprimée
        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }

    /**
     * Cette méthode permet de créer une nouvelle messagerie
     */
    // Définition d'une route pour créer une nouvelle messagerie via une requête POST
    #[Route('/api/messageries', name: 'createMessagerie', methods: ['POST'])]
    #[OA\Post(
        path: "/api/messageries",
        tags: ["messageries"],
        requestBody: new OA\RequestBody(
            description: "Créer une nouvelle messagerie",
            required: true,
            content: new OA\JsonContent(
                ref: new Model(type: Messagerie::class, groups: ["create"])
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: "messagerie créée avec succès",
                content: new OA\JsonContent(
                    type: "object",
                    properties: [
                        new OA\Property(property: "id", type: "integer"),

                    ]
                )
            ),
            new OA\Response(
                response: 400,
                description: "Données invalides fournies"
            )
        ]
    )]
    #[OA\Tag(name: "messageries")]
    public function createMessagerie(Request $request, SerializerInterface $serializer, EntityManagerInterface $entityManager, UrlGeneratorInterface $urlGenerator, ValidatorInterface $validator, TagAwareCacheInterface $cachePool): JsonResponse
    {
        $cachePool->invalidateTags(["messageriesCaches"]);
        // Désérialisation du contenu de la requête pour créer une nouvelle instance de messagerie.
        $messagerie = $serializer->deserialize($request->getContent(), Messagerie::class, 'json');
        // Vérification des erreurs
        $errors = $validator->validate($messagerie);

        if ($errors->count() > 0) {
            return new JsonResponse($serializer->serialize($errors, 'json'), JsonResponse::HTTP_BAD_REQUEST, [], true);
        }
        // Enregistrement de la messagerie dans la base de données.
        $entityManager->persist($messagerie);
        $entityManager->flush();
        // Sérialisation de la messagerie créé en JSON.
        $context = SerializationContext::create()->setGroups(['getMessageries']);
        $jsonClasse = $serializer->serialize($messagerie, 'json', $context);
        // Génération de l'URL vers les détails de la messagerie créé.
        $location = $urlGenerator->generate('detailmessagerie', ['id' => $messagerie->getId(), UrlGeneratorInterface::ABSOLUTE_URL]);
        // Retour d'une réponse JSON avec la messagerie créée et l'URL de ses détails.
        return new JsonResponse($jsonClasse, Response::HTTP_CREATED, ['Location' => $location], true);
    }

    /**
     * Cette méthode permet de mettre à jour une messagerie
     */
    // Définition d'une route pour mettre à jour une messagerie spécifique via une requête PUT.
    #[Route('/api/messageries/{id}', name: 'updatemessagerie', methods: ['PUT'])]
    #[OA\Put(
        path: "/api/messageries/{id}",
        summary: "Met à jour une messagerie existante",
        tags: ["messageries"],
        requestBody: new OA\RequestBody(
            description: "Données de la messagerie à mettre à jour",
            required: true,
            content: new OA\JsonContent(
                ref: new Model(type: Messagerie::class, groups: ["update"])
            )
        ),
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                description: "ID de la messagerie à mettre à jour",
                required: true,
                schema: new OA\Schema(type: "integer")
            )
        ],
        responses: [
            new OA\Response(
                response: 204,
                description: "messagerie mise à jour avec succès",
                content: new OA\JsonContent(
                    type: "object",
                    properties: [
                        new OA\Property(property: "id", type: "integer"),

                    ]
                )
            ),
            new OA\Response(
                response: 400,
                description: "Données invalides fournies"
            ),
            new OA\Response(
                response: 404,
                description: "messagerie non trouvé"
            )
        ]
    )]
    #[OA\Tag(name: "messageries")]
    public function updateMessagerie(Request $request, SerializerInterface $serializer, Messagerie $currentmessagerie, EntityManagerInterface $em, ValidatorInterface $validator, TagAwareCacheInterface $cachePool): JsonResponse
    {
        $newmessagerie = $serializer->deserialize($request->getContent(), Messagerie::class, 'json');
        $currentmessagerie->setMessages($newmessagerie->getMessages());

        $errors = $validator->validate($currentmessagerie);
        if ($errors->count() > 0) {
            return new JsonResponse($serializer->serialize($errors, 'json'), JsonResponse::HTTP_BAD_REQUEST, [], true);
        }
        $em->persist($currentmessagerie);
        $em->flush();
        $cachePool->invalidateTags(["messageriesCache"]);

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }
}
