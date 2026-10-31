<?php

namespace App\Controller\Api;

use App\Repository\PricingRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Tarifs de la saison (liste non paginée)
 */
class PricingController extends AbstractController
{
    use PublicCache;

    #[Route('/api/pricing', name: 'api_pricing', methods: ['GET'])]
    public function list(PricingRepository $repository): Response
    {
        return $this->publicCache($this->json($repository->findAllOrdered(), context: ['groups' => ['pricing:read']]));
    }
}
