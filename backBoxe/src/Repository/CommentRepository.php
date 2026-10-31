<?php

namespace App\Repository;

use App\Entity\Article;
use App\Entity\Comment;
use App\Enum\CommentStatus;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Tools\Pagination\Paginator;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Comment>
 */
class CommentRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Comment::class);
    }

    /**
     * Commentaires publiés d'un article, du plus ancien au plus récent (fil de discussion).
     *
     * @return Paginator<Comment>
     */
    public function findPublishedPage(Article $article, int $page, int $limit): Paginator
    {
        $qb = $this->createQueryBuilder('c')
            ->join('c.author', 'u')->addSelect('u')
            ->where('c.article = :article')
            ->andWhere('c.status = :status')
            ->setParameter('article', $article)
            ->setParameter('status', CommentStatus::Publie)
            ->orderBy('c.createdAt', 'ASC')
            ->addOrderBy('c.id', 'ASC')
            ->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit);

        return new Paginator($qb);
    }

    public function countPending(): int
    {
        return $this->count(['status' => CommentStatus::EnAttente]);
    }
}
