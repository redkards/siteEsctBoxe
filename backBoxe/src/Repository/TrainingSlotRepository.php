<?php

namespace App\Repository;

use App\Entity\TrainingSlot;
use App\Entity\Discipline;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<TrainingSlot>
 */
class TrainingSlotRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TrainingSlot::class);
    }

    /**
     * Planning hebdomadaire trié par jour puis heure
     *
     * @return list<TrainingSlot>
     */
    public function findPlanning(?Discipline $discipline = null): array
    {
        $qb = $this->createQueryBuilder('s')
            ->join('s.discipline', 'd')->addSelect('d')
            ->join('s.venue', 'v')->addSelect('v')
            ->leftJoin('s.coach', 'c')->addSelect('c')
            ->orderBy('s.dayOfWeek', 'ASC')
            ->addOrderBy('s.startTime', 'ASC')
            ->addOrderBy('s.id', 'ASC');

        if ($discipline) {
            $qb->andWhere('s.discipline = :discipline')->setParameter('discipline', $discipline);
        }

        return $qb->getQuery()->getResult();
    }
}
