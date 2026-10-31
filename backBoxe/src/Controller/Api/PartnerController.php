<?php

namespace App\Controller\Api;

use App\Repository\PartnerRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Partenaires du club (liste non paginée)
 */
class PartnerController extends AbstractController
{
    use PublicCache;

    #[Route('/api/partners', name: 'api_partners', methods: ['GET'])]
    public function list(PartnerRepository $repository): Response
    {
        return $this->publicCache($this->json($repository->findAllOrdered(), context: ['groups' => ['partner:read']]));
    }
}
