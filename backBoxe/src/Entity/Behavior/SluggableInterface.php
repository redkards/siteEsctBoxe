<?php

namespace App\Entity\Behavior;

/**
 * Entité dotée d'un slug généré automatiquement (voir App\EventListener\SlugListener).
 */
interface SluggableInterface
{
    public function getId(): ?int;

    public function getSlug(): ?string;

    public function setSlug(?string $slug): static;

    /**
     * Texte à partir duquel le slug est construit quand il est laissé vide.
     */
    public function getSlugSource(): string;
}
