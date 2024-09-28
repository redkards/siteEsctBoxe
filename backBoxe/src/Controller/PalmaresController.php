<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class PalmaresController extends AbstractController
{
    #[Route('/palmares', name: 'app_palmares')]
    public function index(): Response
    {
        return $this->render('palmares/index.html.twig', [
            'controller_name' => 'PalmaresController',
        ]);
    }
}
