<?php

namespace App\Entity;

use App\Repository\AdresseRepository;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: AdresseRepository::class)]
class Adresse
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[groups(['getAdresses'])]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(nullable: true)]
    #[groups(['getAdresses'])]
    private ?int $numero = null;

    #[ORM\Column(length: 100)]
    #[groups(['getAdresses'])]
    private ?string $typeVoie = null;

    #[ORM\Column(length: 100)]
    #[groups(['getAdresses'])]
    private ?string $nomVoie = null;

    #[ORM\Column(length: 150, nullable: true)]
    #[groups(['getAdresses'])]
    private ?string $complementAdresse = null;

    #[ORM\Column(length: 100)]
    #[groups(['getAdresses'])]
    private ?string $ville = null;

    #[ORM\Column(length: 50)]
    #[groups(['getAdresses'])]
    private ?string $codePostal = null;

    #[ORM\Column(length: 100)]
    #[groups(['getAdresses'])]
    private ?string $pays = null;

    #[ORM\ManyToOne(inversedBy: 'userAdresse')]
    #[groups(['getUsers'])]
    #[ORM\JoinColumn(nullable: true)]
    private ?User $user = null;

    #[ORM\ManyToOne(inversedBy: 'salleAdresse')]
    #[groups(['getSalles'])]
    #[ORM\JoinColumn(nullable: true)]
    private ?Salle $salle = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNumero(): ?int
    {
        return $this->numero;
    }

    public function setNumero(?int $numero): static
    {
        $this->numero = $numero;

        return $this;
    }

    public function getTypeVoie(): ?string
    {
        return $this->typeVoie;
    }

    public function setTypeVoie(string $typeVoie): static
    {
        $this->typeVoie = $typeVoie;

        return $this;
    }

    public function getNomVoie(): ?string
    {
        return $this->nomVoie;
    }

    public function setNomVoie(string $nomVoie): static
    {
        $this->nomVoie = $nomVoie;

        return $this;
    }

    public function getComplementAdresse(): ?string
    {
        return $this->complementAdresse;
    }

    public function setComplementAdresse(?string $complementAdresse): static
    {
        $this->complementAdresse = $complementAdresse;

        return $this;
    }

    public function getVille(): ?string
    {
        return $this->ville;
    }

    public function setVille(string $ville): static
    {
        $this->ville = $ville;

        return $this;
    }

    public function getCodePostal(): ?string
    {
        return $this->codePostal;
    }

    public function setCodePostal(string $codePostal): static
    {
        $this->codePostal = $codePostal;

        return $this;
    }

    public function getPays(): ?string
    {
        return $this->pays;
    }

    public function setPays(string $pays): static
    {
        $this->pays = $pays;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getSalle(): ?Salle
    {
        return $this->salle;
    }

    public function setSalle(?Salle $salle): static
    {
        $this->salle = $salle;

        return $this;
    }
}
