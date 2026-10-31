<?php

namespace App\Repository;

use App\Entity\Membership;
use App\Entity\User;
use App\Enum\MembershipStatus;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Membership>
 */
class MembershipRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Membership::class);
    }

    /**
     * Demandes du membre : rattachées à son compte, ou déposées sans être connecté avec son email.
     *
     * @return list<Membership>
     */
    public function findForUser(User $user): array
    {
        return $this->createQueryBuilder('m')
            ->join('m.discipline', 'd')->addSelect('d')
            ->leftJoin('m.pricing', 'p')->addSelect('p')
            ->where('m.user = :user OR (m.user IS NULL AND m.email = :email)')
            ->setParameter('user', $user)
            ->setParameter('email', (string) $user->getEmail())
            ->orderBy('m.createdAt', 'DESC')
            ->addOrderBy('m.id', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function countPending(): int
    {
        return $this->count(['status' => MembershipStatus::EnAttente]);
    }

    public function countValidated(string $season): int
    {
        return $this->count(['status' => MembershipStatus::Validee, 'season' => $season]);
    }
}
