<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class BoxeurController extends AbstractController
{
    #[Route('/boxeur', name: 'app_boxeur')]
    public function index(): Response
    {
        return $this->render('boxeur/index.html.twig', [
            'controller_name' => 'BoxeurController',
        ]);
    }
}
