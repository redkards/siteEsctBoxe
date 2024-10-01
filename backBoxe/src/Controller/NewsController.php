<?php

namespace App\Controller;

use App\Entity\News;
use App\Repository\NewsRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;

class NewsController extends AbstractController
{
    // Route pour récupérer tous les articles de news
    #[Route('/api/news', name: 'app_news_index', methods: ['GET'])]
    public function index(NewsRepository $newsRepository): JsonResponse
    {
        $newsList = $newsRepository->findAll();

        $data = [];
        foreach ($newsList as $news) {
            $data[] = [
                'id' => $news->getId(),
                'title' => $news->getTitle(),
                'content' => $news->getContent(),
                'publishedAt' => $news->getPublishedAt()->format('Y-m-d H:i:s'),
            ];
        }

        return new JsonResponse($data, JsonResponse::HTTP_OK);
    }

    // Route pour récupérer les détails d'un article spécifique
    #[Route('/api/news/{id}', name: 'app_news_detail', methods: ['GET'])]
    public function getNewsDetail(int $id, NewsRepository $newsRepository): JsonResponse
    {
        try {
            // Récupérer l'actualité par son id
            $news = $newsRepository->find($id);

            if (!$news) {
                return new JsonResponse(['error' => 'News not found'], JsonResponse::HTTP_NOT_FOUND);
            }

            // Transformer l'entité en tableau
            $data = [
                'id' => $news->getId(),
                'titre' => $news->getTitre(),
                'newsContent' => $news->getNewsContent(),
                'newsPictures' => $news->getPictures(),
                'publishedAt' => $news->getPublishedAt()->format('Y-m-d H:i:s'),
            ];

            return new JsonResponse($data, JsonResponse::HTTP_OK);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // Route pour créer un nouvel article
    #[Route('/api/news/add', name: 'app_news_add', methods: ['POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            $news = new News();
            $news->setTitre($data['titre']);
            $news->setNewsContent($data['newsContent']);
            $news->setNewsPictures($data['newsPictures']);
            $news->setPublishedAt(new \DateTimeImmutable());

            if (isset($data['newsPictures'])) {
                $news->setNewsPictures($data['newsPictures']);
            }

            $entityManager->persist($news);
            $entityManager->flush();

            return new JsonResponse(['status' => 'News created!'], JsonResponse::HTTP_CREATED);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // Route pour modifier un article existant
    #[Route('/api/news/{id}/edit', name: 'app_news_edit', methods: ['PUT'])]
    public function edit(int $id, Request $request, NewsRepository $newsRepository, EntityManagerInterface $entityManager): JsonResponse
    {
        try {
            $news = $newsRepository->find($id);

            if (!$news) {
                return new JsonResponse(['error' => 'News not found'], JsonResponse::HTTP_NOT_FOUND);
            }

            $data = json_decode($request->getContent(), true);
            $news->setTitre($data['titre']);
            $news->setNewsContent($data['newsContent']);
            $news->setNewsPictures($data['newsPictures']);
            $news->setPublishedAt(new \DateTimeImmutable());
            $entityManager->flush();

            return new JsonResponse(['status' => 'News updated!'], JsonResponse::HTTP_OK);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // Route pour supprimer un article
    #[Route('/api/news/{id}', name: 'app_news_delete', methods: ['DELETE'])]
    public function delete(int $id, NewsRepository $newsRepository, EntityManagerInterface $entityManager): JsonResponse
    {
        try {
            $news = $newsRepository->find($id);

            if (!$news) {
                return new JsonResponse(['error' => 'News not found'], JsonResponse::HTTP_NOT_FOUND);
            }

            $entityManager->remove($news);
            $entityManager->flush();

            return new JsonResponse(['status' => 'News deleted'], JsonResponse::HTTP_OK);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
