<?php
// Déclaration de l'espace de noms pour ce contrôleur, permettant son utilisation dans l'application.
namespace App\Controller;

use App\Entity\Message;
use App\Entity\Messagerie;
use App\Repository\MessageRepository;
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

class MessageController extends AbstractController
{
    /**
     * Cette méthode permet de récupérer l'ensemble des messages
     */
    // Définition d'une route pour récupérer tous les messages. La méthode HTTP autorisée est GET.
    #[Route('/api/messages', name: 'message', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: "Retourne la liste des messages",
        content: new OA\JsonContent(
            type: "array",
            items: new OA\Items(ref: new Model(type: Message::class, groups: ["getMessages"]))
        )
    )]
    #[OA\Tag(name: "messages")]
    public function getAllMessages(MessageRepository $messageRepository, SerializerInterface $serializer, TagAwareCacheInterface $cache): JsonResponse
    {
        // Identifiant de cache pour cette requête
        $idCache = "getAllMessages";

        // Récupération des données depuis le cache ou exécution de la requête si le cache est vide
        $jsonMessageList = $cache->get($idCache, function (ItemInterface $item) use ($messageRepository, $serializer) {
            $item->tag("messagesCache");
            $messageList = $messageRepository->findAll();
            $context = SerializationContext::create()->setGroups(['getMessages']);

            return $serializer->serialize($messageList, 'json', $context);
        });


        // Retourne la liste des messages en JSON
        return new JsonResponse($jsonMessageList, Response::HTTP_OK, [], true);
    }

    /**
     * Cette méthode permet de récupérer un message spécifique par son ID
     */
    // Définition d'une route pour récupérer les détails d'un message spécifique par son ID. La méthode HTTP autorisée est GET.
    #[Route('/api/messages/{id}', name: 'detailmessage', methods: ['GET'])]
    #[OA\Tag(name: "messages")]
    public function getMessageDetail(Message $message, SerializerInterface $serializer): JsonResponse
    {
        // Contexte de sérialisation pour le groupe 'getmessages'
        $context = SerializationContext::create()->setGroups(['getMessages']);

        // Sérialisation de la message en JSON
        $jsonMessage = $serializer->serialize($message, 'json', $context);

        // Retourne les détails de la message en JSON
        return new JsonResponse($jsonMessage, Response::HTTP_OK, [], true);
    }

    /**
     * Cette méthode supprimer une message en fonction de son id
     */
    // Définition d'une route pour supprimer une message spécifique par son ID. La méthode HTTP autorisée est DELETE.
    #[Route('/api/messages/{id}', name: 'deletemessage', methods: ['DELETE'])]
    #[OA\Tag(name: "messages")]
    public function deleteMessage(message $message, EntityManagerInterface $em, TagAwareCacheInterface $cachePool): JsonResponse
    {
        // Invalide le cache associé aux messages
        $cachePool->invalidateTags(["messagesCache"]);

        // Suppression de la message de la base de données
        $em->remove($message);
        $em->flush();

        // Retourne une réponse indiquant que le contenu n'existe plus
        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }

    /**
     * Cette méthodde permet de créer un nouveau message
     */
    // Définition d'une route pour créer un nouveau message. La méthode HTTP autorisée est POST.
    #[Route('/api/messages', name: 'createmessage', methods: ['POST'])]
    #[OA\Post(
        path: "/api/messages",
        summary: "Crée un nouveau message",
        tags: ["messages"],
        requestBody: new OA\RequestBody(
            description: "Les informations d'un message à créer",
            required: true,
            content: new OA\JsonContent(
                ref: new Model(type: message::class, groups: ["create"])
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: "message crée avec succès",
                content: new OA\JsonContent(
                    type: "object",
                    properties: [
                        new OA\Property(property: "id", type: "integer"),
                        new OA\Property(property: "contenu", type: "string"),
                        new OA\Property(property: "destinataire", type: "string"),
                        new OA\Property(property: "expediteur", type: "string"),
                        new OA\Property(property: "msgDate", type: "string", format: "date"),

                    ]
                )
            ),
            new OA\Response(
                response: 400,
                description: "Erreur de validation",
            )
        ]
    )]
    #[OA\Tag(name: "messages")]
    public function createMessage(Request $request, SerializerInterface $serializer, EntityManagerInterface $em, UrlGeneratorInterface $urlGenerator, ValidatorInterface $validator, TagAwareCacheInterface $cachePool): JsonResponse
    {
        // Invalide le cache associé aux messages
        $cachePool->invalidateTags(["messagesCache"]);

        // Désérialisation du contenu de la requête pour créer une instance de message
        $data = json_decode($request->getContent(), true);



        // Désérialisation des données en objet message
        $message = $serializer->deserialize(json_encode($data), Message::class, 'json');

        // Récupération des données envoyées avec la requête
        $content = $request->toArray();

         // Exemple : relation avec une messagerie (messagerieID dans la requête JSON)
    if (isset($data['messagerieId'])) {
        $messagerie = $em->getRepository(Messagerie::class)->find($data['messagerieId']);
        if (!$messagerie) {
            return new JsonResponse(['error' => 'messagerie not found'], JsonResponse::HTTP_BAD_REQUEST);
        }
        $message->setMessagerie($messagerie); // Associe la messagerie au message
    }


        // Vérification des erreurs
        $errors = $validator->validate($message);
        if ($errors->count() > 0) {
            return new JsonResponse($serializer->serialize($errors, 'json'), JsonResponse::HTTP_BAD_REQUEST, [], true);
        }

        // Persistance de la nouvelle message en base de données
        $em->persist($message);
        $em->flush();

        // Sérialisation du message créée pour la réponse
        $context = SerializationContext::create()->setGroups(['getMessages']);
        $jsonMessage = $serializer->serialize($message, 'json', $context);

        // Génération de l'URL de la nouvelle ressource
        $location = $urlGenerator->generate('detailmessage', ['id' => $message->getId()], UrlGeneratorInterface::ABSOLUTE_URL);

        // Retourne la message créée avec l'URL de la nouvelle ressource
        return new JsonResponse($jsonMessage, Response::HTTP_CREATED, ['Location' => $location], true);
    }



    /**
     * Cette méthode permet de mettre à jour un message
     */
    // Définition d'une route pour mettre à jour une message spécifique par son ID. La méthode HTTP autorisée est PUT.
    #[Route('/api/messages/{id}', name: 'updatemessage', methods: ['PUT'])]
    #[OA\Put(
        path: "/api/messages/{id}",
        summary: "Met à jour un message existante",
        tags: ["messages"],
        requestBody: new OA\RequestBody(
            description: "Les informations du message à mettre à jour",
            required: true,
            content: new OA\JsonContent(
                ref: new Model(type: message::class, groups: ["update"])
            )
        ),
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                description: "L'identifiant du message à mettre à jour",
                required: true,
                schema: new OA\Schema(type: "integer")
            )
        ],
        responses: [
            new OA\Response(
                response: 204,
                description: "message mis à jour avec succès",
                content: new OA\JsonContent(
                    type: "object",
                    properties: [
                        new OA\Property(property: "id", type: "integer"),
                        new OA\Property(property: "contenu", type: "string"),
                        new OA\Property(property: "destinataire", type: "string"),
                        new OA\Property(property: "expediteur", type: "string"),
                        new OA\Property(property: "msgDate", type: "string", format: "date"),
                    ]
                )
            ),
            new OA\Response(
                response: 400,
                description: "Erreur de validation"
            ),
            new OA\Response(
                response: 404,
                description: "message non trouvé"
            )
        ]
    )]
    #[OA\Tag(name: "messages")]
    public function updateMessage(Request $request, SerializerInterface $serializer, Message $currentMessage, EntityManagerInterface $em, ValidatorInterface $validator, TagAwareCacheInterface $cachePool): JsonResponse
    {
        // Invalide le cache associé aux messages
        $cachePool->invalidateTags(["messagesCache"]);

        // Désérialisation du contenu de la requête pour créer une instance de message
        $data = json_decode($request->getContent(), true);



        // Désérialisation des nouvelles données en objet message
        $newMessage = $serializer->deserialize(json_encode($data), message::class, 'json');

        // Mise à jour des propriétés de l'objet message existant
        $currentMessage->setContenu($newMessage->getContenu());
        $currentMessage->setDestinataire($newMessage->getDestinataire());
        $currentMessage->setExpediteur($newMessage->getExpediteur());
        $currentMessage->setMsgDate($newMessage->getMsgDate());

        // On vérifie les erreurs
        $errors = $validator->validate($currentMessage);
        if ($errors->count() > 0) {
            return new JsonResponse($serializer->serialize($errors, 'json'), JsonResponse::HTTP_BAD_REQUEST, [], true);
        }

        $content = $request->toArray();



        // Persistance des modifications en base de données
        $em->persist($currentMessage);
        $em->flush();


        // Retourne une réponse indiquant que la mise à jour a été effectuée avec succès
        return new JsonResponse(null, JsonResponse::HTTP_NO_CONTENT);
    }
}
