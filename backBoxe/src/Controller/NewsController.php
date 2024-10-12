<?php

namespace App\Controller;

use App\Entity\News;
use App\Repository\NewsRepository;
use Doctrine\ORM\EntityManagerInterface;
use JMS\Serializer\SerializerInterface;
use JMS\Serializer\SerializationContext;
use Nelmio\ApiDocBundle\Annotation\Model;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\Cache\TagAwareCacheInterface;
use Symfony\Contracts\Cache\ItemInterface;

class NewsController extends AbstractController
{
    // Récupérer tous les articles de news
    #[Route('/api/news', name: 'app_news_index', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: "Retourne la liste des articles de news",
        content: new OA\JsonContent(
            type: "array",
            items: new OA\Items(ref: new Model(type: News::class, groups: ["getNews"]))
        )
    )]
    public function getNews(NewsRepository $newsRepository, SerializerInterface $serializer, TagAwareCacheInterface $cache): JsonResponse
    {
        $idCache = "getAllNews";

        try {
            $jsonNewsList = $cache->get($idCache, function (ItemInterface $item) use ($newsRepository, $serializer) {
                $item->tag("newsCache");
                $newsList = $newsRepository->findAll();
                $context = SerializationContext::create()->setGroups(['getNews']);
                return $serializer->serialize($newsList, 'json', $context);
            });

            return new JsonResponse($jsonNewsList, JsonResponse::HTTP_OK, [], true);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Une erreur est survenue lors de la récupération des nouvelles.'], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }


    // Récupérer les détails d'un article spécifique
    #[Route('/api/news/{id}', name: 'app_news_detail', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: "Retourne les détails d'un article de news",
        content: new OA\JsonContent(ref: new Model(type: News::class, groups: ["getNews"]))
    )]
    public function getNewsDetail(int $id, NewsRepository $newsRepository, SerializerInterface $serializer): JsonResponse
    {
        try {
            $news = $newsRepository->find($id);

            if (!$news) {
                return new JsonResponse(['error' => 'News not found'], JsonResponse::HTTP_NOT_FOUND);
            }

            $context = SerializationContext::create()->setGroups(['getNews']);
            $jsonNews = $serializer->serialize($news, 'json', $context);
            return new JsonResponse($jsonNews, JsonResponse::HTTP_OK, [], true);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Une erreur est survenue lors de la récupération des nouvelles.'], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // Créer un nouvel article
    #[Route('/api/news', name: 'app_news_add', methods: ['POST'])]
    public function createNews(Request $request, EntityManagerInterface $entityManager, SerializerInterface $serializer): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            $news = new News();
            $news->setTitre($data['titre'] ?? null);
            $news->setNewsContent($data['newsContent'] ?? null);
            $news->setNewsPictures($data['newsPictures'] ?? null);
            $news->setPublishedAt(new \DateTimeImmutable());

            $entityManager->persist($news);
            $entityManager->flush();

            $context = SerializationContext::create()->setGroups(['getNews']);
            $jsonNews = $serializer->serialize($news, 'json', $context);
            return new JsonResponse($jsonNews, JsonResponse::HTTP_CREATED, [], true);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Une erreur est survenue lors de la création de l\'article.'], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // Modifier un article existant
    #[Route('/api/news/{id}', name: 'app_news_edit', methods: ['PUT'])]
    public function edit(int $id, Request $request, NewsRepository $newsRepository, EntityManagerInterface $entityManager, SerializerInterface $serializer): JsonResponse
    {
        try {
            $news = $newsRepository->find($id);

            if (!$news) {
                return new JsonResponse(['error' => 'News not found'], JsonResponse::HTTP_NOT_FOUND);
            }

            $data = json_decode($request->getContent(), true);
            $news->setTitre($data['titre'] ?? $news->getTitre());
            $news->setNewsContent($data['newsContent'] ?? $news->getNewsContent());
            $news->setNewsPictures($data['newsPictures'] ?? $news->getNewsPictures());
            $entityManager->flush();

            return new JsonResponse(['status' => 'News updated!'], JsonResponse::HTTP_OK);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Une erreur est survenue lors de la mise à jour de l\'article.'], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // Supprimer un article
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
            return new JsonResponse(['error' => 'Une erreur est survenue lors de la suppression de l\'article.'], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
