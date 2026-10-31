<?php

namespace App\Controller\Api;

use App\Repository\VenueRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Salles d'entraînement (liste non paginée)
 */
class VenueController extends AbstractController
{
    use PublicCache;

    #[Route('/api/venues', name: 'api_venues', methods: ['GET'])]
    public function list(VenueRepository $repository): Response
    {
        return $this->publicCache($this->json($repository->findAllOrdered(), context: ['groups' => ['venue:read']]));
    }
}
