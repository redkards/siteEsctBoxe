<?php

namespace App\Controller\Api;

use App\Dto\CommentRequest;
use App\Entity\Comment;
use App\Entity\User;
use App\Repository\ArticleRepository;
use App\Repository\CommentRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\RateLimiter\RateLimiterFactoryInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Security\Http\Attribute\IsGranted;

/**
 * Commentaires des actualités : publiés après modération par un coach.
 */
#[Route('/api/articles/{slug}/comments', requirements: ['slug' => '[a-z0-9-]+'])]
class CommentController extends AbstractController
{
    use PublicCache;

    public function __construct(
        private readonly ArticleRepository $articles,
        private readonly CommentRepository $comments,
    ) {
    }

    #[Route('', name: 'api_article_comments', methods: ['GET'])]
    public function list(string $slug, #[MapQueryParameter] int $page = 1, #[MapQueryParameter] int $limit = 20): Response
    {
        $article = $this->articles->findOnePublishedBySlug($slug);
        if (!$article) {
            return $this->json(['message' => 'Article introuvable.'], Response::HTTP_NOT_FOUND);
        }

        $page = Paginated::clampPage($page);
        $limit = Paginated::clampLimit($limit);

        return $this->publicCache(
            $this->json(Paginated::from($this->comments->findPublishedPage($article, $page, $limit), $page, $limit), context: ['groups' => ['comment:read']]),
            60,
        );
    }

    #[Route('', name: 'api_article_comment_create', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function create(
        string $slug,
        #[MapRequestPayload] CommentRequest $payload,
        #[CurrentUser] User $user,
        EntityManagerInterface $em,
        RateLimiterFactoryInterface $commentLimiter,
    ): Response {
        $article = $this->articles->findOnePublishedBySlug($slug);
        if (!$article) {
            return $this->json(['message' => 'Article introuvable.'], Response::HTTP_NOT_FOUND);
        }

        if (!$commentLimiter->create('user-'.$user->getId())->consume()->isAccepted()) {
            return $this->json(['message' => 'Trop de commentaires, réessayez dans quelques minutes.'], Response::HTTP_TOO_MANY_REQUESTS);
        }

        $comment = (new Comment())
            ->setArticle($article)
            ->setAuthor($user)
            ->setBody(trim($payload->body));
        $em->persist($comment);
        $em->flush();

        return $this->json([
            'id' => $comment->getId(),
            'status' => $comment->getStatus()->value,
            'message' => 'Merci ! Votre commentaire sera publié après relecture par le club.',
        ], Response::HTTP_CREATED);
    }
}
