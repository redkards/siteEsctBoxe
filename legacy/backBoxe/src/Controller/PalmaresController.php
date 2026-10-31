<?php

namespace App\Controller;

use App\Entity\Palmares;
use App\Form\PalmaresType;
use App\Repository\PalmaresRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/palmares')]
final class PalmaresController extends AbstractController
{
    #[Route(name: 'app_palmares_index', methods: ['GET'])]
    public function index(PalmaresRepository $palmaresRepository): Response
    {
        return $this->render('palmares/index.html.twig', [
            'palmares' => $palmaresRepository->findAll(),
        ]);
    }

    #[Route('/new', name: 'app_palmares_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $palmare = new Palmares();
        $form = $this->createForm(PalmaresType::class, $palmare);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($palmare);
            $entityManager->flush();

            return $this->redirectToRoute('app_palmares_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('palmares/new.html.twig', [
            'palmare' => $palmare,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_palmares_show', methods: ['GET'])]
    public function show(Palmares $palmare): Response
    {
        return $this->render('palmares/show.html.twig', [
            'palmare' => $palmare,
        ]);
    }

    #[Route('/{id}/edit', name: 'app_palmares_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Palmares $palmare, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(PalmaresType::class, $palmare);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('app_palmares_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('palmares/edit.html.twig', [
            'palmare' => $palmare,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_palmares_delete', methods: ['POST'])]
    public function delete(Request $request, Palmares $palmare, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$palmare->getId(), $request->getPayload()->getString('_token'))) {
            $entityManager->remove($palmare);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_palmares_index', [], Response::HTTP_SEE_OTHER);
    }
}
