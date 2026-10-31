<?php

namespace App\Repository;

use App\Entity\Fight;
use App\Entity\Boxer;
use App\Entity\Gala;
use App\Enum\FightResult;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Fight>
 */
class FightRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Fight::class);
    }

    /**
     * @return list<Fight>
     */
    public function findForBoxer(Boxer $boxer): array
    {
        return $this->createQueryBuilder('f')
            ->leftJoin('f.event', 'g')->addSelect('g')
            ->where('f.boxer = :boxer')
            ->setParameter('boxer', $boxer)
            ->orderBy('f.date', 'DESC')
            ->addOrderBy('f.id', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * @return list<Fight>
     */
    public function findForEvent(Gala $gala): array
    {
        return $this->createQueryBuilder('f')
            ->join('f.boxer', 'b')->addSelect('b')
            ->where('f.event = :gala')
            ->setParameter('gala', $gala)
            ->orderBy('f.date', 'ASC')
            ->addOrderBy('f.id', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function countVictories(): int
    {
        return $this->count(['result' => FightResult::Victoire]);
    }
}
