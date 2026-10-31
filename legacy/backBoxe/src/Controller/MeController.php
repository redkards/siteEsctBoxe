<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\MessageRepository;
use Doctrine\ORM\EntityManagerInterface;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\Cache\TagAwareCacheInterface;

/**
 * Espace personnel de l'utilisateur connecté et exercice de ses droits RGPD
 */
#[OA\Tag(name: "Mon compte (RGPD)")]
class MeController extends AbstractController
{
    /**
     * Informations du compte connecté
     */
    #[Route('/api/me', name: 'me', methods: ['GET'])]
    public function me(): JsonResponse
    {
        return $this->json($this->profil($this->currentUser()));
    }

    /**
     * Droit d'accès et à la portabilité (art. 15 et 20 RGPD) : export de toutes les données
     */
    #[Route('/api/me/export', name: 'me_export', methods: ['GET'])]
    public function export(MessageRepository $messageRepository): JsonResponse
    {
        $user = $this->currentUser();
        $email = $user->getEmail();

        $adresses = [];
        foreach ($user->getUserAdresse() as $adresse) {
            $adresses[] = [
                'numero' => $adresse->getNumero(),
                'typeVoie' => $adresse->getTypeVoie(),
                'nomVoie' => $adresse->getNomVoie(),
                'complement' => $adresse->getComplementAdresse(),
                'codePostal' => $adresse->getCodePostal(),
                'ville' => $adresse->getVille(),
                'pays' => $adresse->getPays(),
            ];
        }

        $messages = [];
        foreach ($messageRepository->findBy(['expediteur' => $email]) as $message) {
            $messages[] = [
                'date' => $message->getMsgDate()?->format(\DATE_ATOM),
                'destinataire' => $message->getDestinataire(),
                'contenu' => $message->getContenu(),
            ];
        }

        $response = $this->json([
            'exportLe' => (new \DateTimeImmutable())->format(\DATE_ATOM),
            'compte' => $this->profil($user),
            'adresses' => $adresses,
            'messagesEnvoyes' => $messages,
        ]);
        $response->headers->set('Content-Disposition', 'attachment; filename="mes-donnees-esct-boxe.json"');

        return $response;
    }

    /**
     * Droit à l'effacement (art. 17 RGPD) : suppression définitive du compte.
     * Le mot de passe est redemandé pour confirmer l'action.
     */
    #[Route('/api/me', name: 'me_delete', methods: ['DELETE'])]
    public function delete(
        Request $request,
        UserPasswordHasherInterface $hasher,
        MessageRepository $messageRepository,
        EntityManagerInterface $em,
        TagAwareCacheInterface $cachePool,
    ): JsonResponse {
        $user = $this->currentUser();
        $data = json_decode($request->getContent(), true) ?? [];

        if (!$hasher->isPasswordValid($user, (string) ($data['password'] ?? ''))) {
            return $this->json(['message' => 'Mot de passe incorrect.'], Response::HTTP_FORBIDDEN);
        }

        // Les messages envoyés sont anonymisés plutôt que supprimés pour ne pas casser les conversations
        foreach ($messageRepository->findBy(['expediteur' => $user->getEmail()]) as $message) {
            $message->setExpediteur('Utilisateur supprimé');
        }
        foreach ($user->getUserAdresse() as $adresse) {
            $em->remove($adresse);
        }
        $em->remove($user);
        $em->flush();
        $cachePool->invalidateTags(['usersCache', 'messagesCache']);

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }

    private function currentUser(): User
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            throw $this->createAccessDeniedException();
        }
        return $user;
    }

    private function profil(User $user): array
    {
        return [
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'nom' => $user->getNom(),
            'prenom' => $user->getPrenom(),
            'tel' => $user->getTel(),
            'dateNaissance' => $user->getDateNaissance()?->format('Y-m-d'),
            'roles' => $user->getRoles(),
            'photoProfil' => $user->getProfilePicture(),
            'consentement' => [
                'date' => $user->getConsentAt()?->format(\DATE_ATOM),
                'version' => $user->getConsentVersion(),
            ],
        ];
    }
}
