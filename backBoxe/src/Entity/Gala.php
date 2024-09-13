<?php

namespace App\Entity;

use App\Repository\GalaRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: GalaRepository::class)]
class Gala
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $nom = null;

    #[ORM\Column(length: 255)]
    private ?string $lieu = null;

    #[ORM\Column(type: Types::DATE_IMMUTABLE)]
    private ?\DateTimeImmutable $galaDate = null;

    #[ORM\Column(type: Types::TIME_IMMUTABLE)]
    private ?\DateTimeImmutable $galaTime = null;

    /**
     * @var Collection<int, salle>
     */
    #[ORM\OneToMany(targetEntity: salle::class, mappedBy: 'gala', orphanRemoval: true)]
    private Collection $galaSalle;

    public function __construct()
    {
        $this->galaSalle = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;

        return $this;
    }

    public function getLieu(): ?string
    {
        return $this->lieu;
    }

    public function setLieu(string $lieu): static
    {
        $this->lieu = $lieu;

        return $this;
    }

    public function getGalaDate(): ?\DateTimeImmutable
    {
        return $this->galaDate;
    }

    public function setGalaDate(\DateTimeImmutable $galaDate): static
    {
        $this->galaDate = $galaDate;

        return $this;
    }

    public function getGalaTime(): ?\DateTimeImmutable
    {
        return $this->galaTime;
    }

    public function setGalaTime(\DateTimeImmutable $galaTime): static
    {
        $this->galaTime = $galaTime;

        return $this;
    }

    /**
     * @return Collection<int, salle>
     */
    public function getGalaSalle(): Collection
    {
        return $this->galaSalle;
    }

    public function addGalaSalle(salle $galaSalle): static
    {
        if (!$this->galaSalle->contains($galaSalle)) {
            $this->galaSalle->add($galaSalle);
            $galaSalle->setGala($this);
        }

        return $this;
    }

    public function removeGalaSalle(salle $galaSalle): static
    {
        if ($this->galaSalle->removeElement($galaSalle)) {
            // set the owning side to null (unless already changed)
            if ($galaSalle->getGala() === $this) {
                $galaSalle->setGala(null);
            }
        }

        return $this;
    }
}
