<?php

namespace App\Repository;

use App\Entity\Gala;
use App\Enum\GalaType;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\QueryBuilder;
use Doctrine\ORM\Tools\Pagination\Paginator;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Gala>
 */
class GalaRepository extends ServiceEntityRepository
{
    public const UPCOMING = 'upcoming';
    public const PAST = 'past';

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Gala::class);
    }

    /**
     * Événements publiés. « À venir » : pas encore terminés (fin, ou début à défaut, dans le futur),
     * du plus proche au plus lointain ; « passés » : du plus récent au plus ancien.
     *
     * @return Paginator<Gala>
     */
    public function findPublishedPage(int $page, int $limit, ?string $when = null, ?GalaType $type = null): Paginator
    {
        $qb = $this->published()
            ->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit);

        if (self::UPCOMING === $when) {
            $qb->andWhere('COALESCE(g.endsAt, g.startsAt) >= :now')->orderBy('g.startsAt', 'ASC');
        } elseif (self::PAST === $when) {
            $qb->andWhere('COALESCE(g.endsAt, g.startsAt) < :now')->orderBy('g.startsAt', 'DESC');
        } else {
            $qb->orderBy('g.startsAt', 'DESC');
        }
        if ($when) {
            $qb->setParameter('now', new \DateTimeImmutable());
        }
        $qb->addOrderBy('g.id', 'ASC');

        if ($type) {
            $qb->andWhere('g.type = :type')->setParameter('type', $type);
        }

        return new Paginator($qb);
    }

    public function findOnePublishedBySlug(string $slug): ?Gala
    {
        return $this->published()
            ->andWhere('g.slug = :slug')
            ->setParameter('slug', $slug)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function countUpcoming(): int
    {
        return (int) $this->published()
            ->select('COUNT(g.id)')
            ->andWhere('COALESCE(g.endsAt, g.startsAt) >= :now')
            ->setParameter('now', new \DateTimeImmutable())
            ->getQuery()
            ->getSingleScalarResult();
    }

    private function published(): QueryBuilder
    {
        return $this->createQueryBuilder('g')->where('g.published = true');
    }
}
