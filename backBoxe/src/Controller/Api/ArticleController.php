<?php

namespace App\Controller\Api;

use App\Enum\ArticleCategory;
use App\Repository\ArticleRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Actualités du club (public, lecture seule)
 */
#[Route('/api/articles')]
class ArticleController extends AbstractController
{
    use PublicCache;

    public function __construct(private readonly ArticleRepository $articles)
    {
    }

    /**
     * Filtre : ?category=club|competition|gala|stage|vie-du-club
     */
    #[Route('', name: 'api_articles', methods: ['GET'])]
    public function list(
        #[MapQueryParameter] int $page = 1,
        #[MapQueryParameter] int $limit = 9,
        #[MapQueryParameter] ?string $category = null,
    ): Response {
        $page = Paginated::clampPage($page);
        $limit = Paginated::clampLimit($limit);
        $categoryEnum = $category ? ArticleCategory::tryFrom($category) : null;

        if ($category && !$categoryEnum) {
            return $this->json(['message' => 'Catégorie inconnue ('.implode(', ', ArticleCategory::values()).').'], Response::HTTP_BAD_REQUEST);
        }

        $result = $this->articles->findPublishedPage($page, $limit, $categoryEnum);

        return $this->publicCache($this->json(Paginated::from($result, $page, $limit), context: ['groups' => ['article:list']]));
    }

    #[Route('/{slug}', name: 'api_article_show', requirements: ['slug' => '[a-z0-9-]+'], methods: ['GET'])]
    public function show(string $slug): Response
    {
        $article = $this->articles->findOnePublishedBySlug($slug);
        if (!$article) {
            return $this->json(['message' => 'Article introuvable.'], Response::HTTP_NOT_FOUND);
        }

        return $this->publicCache($this->json($article, context: ['groups' => ['article:read']]));
    }
}
