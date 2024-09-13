<?php

namespace App\Entity;

use App\Repository\CategorieRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CategorieRepository::class)]
class Categorie
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $categorieNom = null;

    #[ORM\ManyToOne(inversedBy: 'boxeurCategorie')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Boxeur $boxeur = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCategorieNom(): ?string
    {
        return $this->categorieNom;
    }

    public function setCategorieNom(string $categorieNom): static
    {
        $this->categorieNom = $categorieNom;

        return $this;
    }

    public function getBoxeur(): ?Boxeur
    {
        return $this->boxeur;
    }

    public function setBoxeur(?Boxeur $boxeur): static
    {
        $this->boxeur = $boxeur;

        return $this;
    }
}
