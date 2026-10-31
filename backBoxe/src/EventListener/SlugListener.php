<?php

namespace App\EventListener;

use App\Entity\Behavior\SluggableInterface;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsDoctrineListener;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Event\PrePersistEventArgs;
use Doctrine\ORM\Event\PreFlushEventArgs;
use Doctrine\ORM\Events;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Contracts\Service\ResetInterface;

/**
 * Slug généré depuis getSlugSource() quand il est laissé vide, dédoublonné (-2, -3…),
 * pour toute entité implémentant SluggableInterface (articles, disciplines, coachs, boxeurs, galas).
 * preFlush couvre le cas d'un slug vidé lors d'une modification. Un slug saisi à la main
 * est contrôlé par UniqueEntity.
 */
#[AsDoctrineListener(event: Events::prePersist)]
#[AsDoctrineListener(event: Events::preFlush)]
class SlugListener implements ResetInterface
{
    /**
     * Slugs attribués à des entités pas encore écrites en base (même flush), par classe
     *
     * @var array<class-string, array<string, true>>
     */
    private array $reserved = [];

    public function __construct(private readonly SluggerInterface $slugger)
    {
    }

    public function prePersist(PrePersistEventArgs $args): void
    {
        $entity = $args->getObject();
        if ($entity instanceof SluggableInterface) {
            $this->ensureSlug($entity, $args->getObjectManager());
        }
    }

    public function preFlush(PreFlushEventArgs $args): void
    {
        $em = $args->getObjectManager();
        foreach ($em->getUnitOfWork()->getIdentityMap() as $entities) {
            foreach ($entities as $entity) {
                if ($entity instanceof SluggableInterface) {
                    $this->ensureSlug($entity, $em);
                }
            }
        }
    }

    public function reset(): void
    {
        $this->reserved = [];
    }

    private function ensureSlug(SluggableInterface $entity, EntityManagerInterface $em): void
    {
        if ('' !== trim((string) $entity->getSlug())) {
            return;
        }

        $class = $em->getClassMetadata($entity::class)->getName();
        $base = mb_substr($this->slugger->slug($entity->getSlugSource())->lower()->toString(), 0, 190) ?: 'element';

        $slug = $base;
        for ($i = 2; isset($this->reserved[$class][$slug]) || $this->slugExists($em, $class, $slug, $entity->getId()); ++$i) {
            $slug = $base.'-'.$i;
        }

        $this->reserved[$class][$slug] = true;
        $entity->setSlug($slug);
    }

    /**
     * @param class-string $class
     */
    private function slugExists(EntityManagerInterface $em, string $class, string $slug, ?int $exceptId): bool
    {
        $qb = $em->createQueryBuilder()
            ->select('COUNT(e.id)')
            ->from($class, 'e')
            ->where('e.slug = :slug')
            ->setParameter('slug', $slug);

        if ($exceptId) {
            $qb->andWhere('e.id != :id')->setParameter('id', $exceptId);
        }

        return (int) $qb->getQuery()->getSingleScalarResult() > 0;
    }
}
