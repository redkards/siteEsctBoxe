<?php

namespace App\Entity;

use App\Repository\SalleRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SalleRepository::class)]
class Salle
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 150)]
    private ?string $nom = null;

    #[ORM\Column(nullable: true)]
    private ?int $capacité = null;

    /**
     * @var Collection<int, adresse>
     */
    #[ORM\OneToMany(targetEntity: adresse::class, mappedBy: 'salle', orphanRemoval: true)]
    private Collection $salleAdresse;

    #[ORM\ManyToOne(inversedBy: 'galaSalle')]
    #[ORM\JoinColumn(nullable: true)]
    private ?Gala $gala = null;

    /**
     * @var Collection<int, Entrainement>
     */
    #[ORM\ManyToMany(targetEntity: Entrainement::class, mappedBy: 'trainingSalle')]
    private Collection $entrainements;

    public function __construct()
    {
        $this->salleAdresse = new ArrayCollection();
        $this->entrainements = new ArrayCollection();
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

    public function getCapacité(): ?int
    {
        return $this->capacité;
    }

    public function setCapacité(?int $capacité): static
    {
        $this->capacité = $capacité;

        return $this;
    }

    /**
     * @return Collection<int, adresse>
     */
    public function getSalleAdresse(): Collection
    {
        return $this->salleAdresse;
    }

    public function addSalleAdresse(adresse $salleAdresse): static
    {
        if (!$this->salleAdresse->contains($salleAdresse)) {
            $this->salleAdresse->add($salleAdresse);
            $salleAdresse->setSalle($this);
        }

        return $this;
    }

    public function removeSalleAdresse(adresse $salleAdresse): static
    {
        if ($this->salleAdresse->removeElement($salleAdresse)) {
            // set the owning side to null (unless already changed)
            if ($salleAdresse->getSalle() === $this) {
                $salleAdresse->setSalle(null);
            }
        }

        return $this;
    }

    public function getGala(): ?Gala
    {
        return $this->gala;
    }

    public function setGala(?Gala $gala): static
    {
        $this->gala = $gala;

        return $this;
    }

    /**
     * @return Collection<int, Entrainement>
     */
    public function getEntrainements(): Collection
    {
        return $this->entrainements;
    }

    public function addEntrainement(Entrainement $entrainement): static
    {
        if (!$this->entrainements->contains($entrainement)) {
            $this->entrainements->add($entrainement);
            $entrainement->addTrainingSalle($this);
        }

        return $this;
    }

    public function removeEntrainement(Entrainement $entrainement): static
    {
        if ($this->entrainements->removeElement($entrainement)) {
            $entrainement->removeTrainingSalle($this);
        }

        return $this;
    }
}
