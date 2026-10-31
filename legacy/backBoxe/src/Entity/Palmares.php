<?php

namespace App\Entity;

use App\Repository\PalmaresRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PalmaresRepository::class)]
class Palmares
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[groups(['getPalmares'])]
    #[ORM\Column]
    private ?int $id = null;

    #[groups(['getPalmares'])]
    #[ORM\Column]
    private ?int $victoires = null;

    #[groups(['getPalmares'])]
    #[ORM\Column]
    private ?int $defaites = null;

    #[groups(['getPalmares'])]
    #[ORM\Column]
    private ?int $nul = null;


    #[groups(['getPalmares'])]
    #[ORM\ManyToOne(targetEntity: Boxeur::class, inversedBy:"palmares")]
    #[ORM\JoinColumn(nullable: false)]
    private $boxeur;

    #[groups(['getPalmares'])]
    #[ORM\ManyToOne(targetEntity: Categorie::class, inversedBy:"palmares")]
    #[ORM\JoinColumn(nullable: false)]

    private $categorie;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getVictoires(): ?int
    {
        return $this->victoires;
    }

    public function setVictoires(int $victoires): static
    {
        $this->victoires = $victoires;

        return $this;
    }

    public function getDefaites(): ?int
    {
        return $this->defaites;
    }

    public function setDefaites(int $defaites): static
    {
        $this->defaites = $defaites;

        return $this;
    }

    public function getNul(): ?int
    {
        return $this->nul;
    }

    public function setNul(int $nul): static
    {
        $this->nul = $nul;

        return $this;
    }
    public function getBoxeur(): ?Boxeur
    {
        return $this->boxeur;
    }

    public function setBoxeur(?Boxeur $boxeur): self
    {
        $this->boxeur = $boxeur;

        return $this;
    }

    public function getCategorie(): ?Categorie
    {
        return $this->categorie;
    }

    public function setCategorie(?Categorie $categorie): self
    {
        $this->categorie = $categorie;

        return $this;
    }
}
