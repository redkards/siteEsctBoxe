<?php

namespace App\Repository;

use App\Entity\Boxer;
use App\Enum\BoxerLevel;
use App\Enum\Sex;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\QueryBuilder;
use Doctrine\ORM\Tools\Pagination\Paginator;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Boxer>
 */
class BoxerRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Boxer::class);
    }

    /**
     * Boxeurs actifs, filtrables par discipline (slug), niveau, sexe et recherche libre (nom, prénom, surnom).
     *
     * @return Paginator<Boxer>
     */
    public function findActivePage(int $page, int $limit, ?string $discipline = null, ?BoxerLevel $level = null, ?Sex $sex = null, ?string $q = null): Paginator
    {
        $qb = $this->active()
            ->orderBy('b.featured', 'DESC')
            ->addOrderBy('b.lastName', 'ASC')
            ->addOrderBy('b.firstName', 'ASC')
            ->addOrderBy('b.id', 'ASC')
            ->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit);

        if ($discipline) {
            $qb->andWhere('d.slug = :discipline')->setParameter('discipline', $discipline);
        }
        if ($level) {
            $qb->andWhere('b.level = :level')->setParameter('level', $level);
        }
        if ($sex) {
            $qb->andWhere('b.sex = :sex')->setParameter('sex', $sex);
        }
        if (null !== $q && '' !== trim($q)) {
            $qb->andWhere("b.firstName LIKE :q ESCAPE '!' OR b.lastName LIKE :q ESCAPE '!' OR b.nickname LIKE :q ESCAPE '!'")
                ->setParameter('q', LikePattern::contains(trim($q)));
        }

        return new Paginator($qb);
    }

    /**
     * @return list<Boxer>
     */
    public function findFeatured(int $limit = 8): array
    {
        return $this->active()
            ->andWhere('b.featured = true')
            ->orderBy('b.wins', 'DESC')
            ->addOrderBy('b.id', 'ASC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    public function findOneActiveBySlug(string $slug): ?Boxer
    {
        return $this->active()
            ->andWhere('b.slug = :slug')
            ->setParameter('slug', $slug)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function countActive(): int
    {
        return $this->count(['active' => true]);
    }

    private function active(): QueryBuilder
    {
        return $this->createQueryBuilder('b')
            ->leftJoin('b.discipline', 'd')->addSelect('d')
            ->where('b.active = true');
    }
}
