<?php

namespace App\Controller\Api;

use App\Repository\CoachRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class CoachController extends AbstractController
{
    use PublicCache;

    public const GROUPS = ['coach:list', 'discipline:ref'];

    #[Route('/api/coaches', name: 'api_coaches', methods: ['GET'])]
    public function list(CoachRepository $coaches): Response
    {
        return $this->publicCache($this->json($coaches->findAllOrdered(), context: ['groups' => self::GROUPS]));
    }
}
