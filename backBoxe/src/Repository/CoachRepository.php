<?php

namespace App\Repository;

use App\Entity\Coach;
use App\Entity\Discipline;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Coach>
 */
class CoachRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Coach::class);
    }

    /**
     * @return list<Coach>
     */
    public function findAllOrdered(?Discipline $discipline = null): array
    {
        $qb = $this->createQueryBuilder('c')
            ->leftJoin('c.disciplines', 'd')->addSelect('d')
            ->orderBy('c.position', 'ASC')
            ->addOrderBy('c.id', 'ASC');

        if ($discipline) {
            // Sous-requête : garder toutes les disciplines des coachs retenus
            $qb->andWhere(':discipline MEMBER OF c.disciplines')->setParameter('discipline', $discipline);
        }

        return $qb->getQuery()->getResult();
    }
}
