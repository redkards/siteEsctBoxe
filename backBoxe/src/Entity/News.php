<?php

namespace App\Entity;

use App\Repository\NewsRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: NewsRepository::class)]
class News
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 120)]
    private ?string $titre = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $newsContent = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $newsPictures = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $publishedAt = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitre(): ?string
    {
        return $this->titre;
    }

    public function setTitre(string $titre): static
    {
        $this->titre = $titre;

        return $this;
    }

    public function getNewsContent(): ?string
    {
        return $this->newsContent;
    }

    public function setNewsContent(string $newsContent): static
    {
        $this->newsContent = $newsContent;

        return $this;
    }

    public function getNewsPictures(): ?string
    {
        return $this->newsPictures;
    }

    public function setNewsPictures(?string $newsPictures): static
    {
        $this->newsPictures = $newsPictures;

        return $this;
    }

    public function getPublishedAt(): ?\DateTimeImmutable
    {
        return $this->publishedAt;
    }

    public function setPublishedAt(\DateTimeImmutable $publishedAt): static
    {
        $this->publishedAt = $publishedAt;

        return $this;
    }
}
