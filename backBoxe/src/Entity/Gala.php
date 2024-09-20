<?php

namespace App\Entity;

use App\Repository\GalaRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: GalaRepository::class)]
class Gala
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[groups(['getGalas'])]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[groups(['getGalas'])]
    private ?string $nom = null;

    #[ORM\Column(length: 255)]
    #[groups(['getGalas'])]
    private ?string $lieu = null;

    #[ORM\Column(type: Types::DATE_IMMUTABLE)]
    #[groups(['getGalas'])]
    private ?\DateTimeImmutable $galaDate = null;

    #[ORM\Column(type: Types::TIME_IMMUTABLE)]
    #[groups(['getGalas'])]
    private ?\DateTimeImmutable $galaTime = null;

    /**
     * @var Collection<int, salle>
     */
    #[ORM\OneToMany(targetEntity: Salle::class, mappedBy: 'gala', orphanRemoval: true)]
    #[groups(['getSalles'])]
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

    public function addGalaSalle(Salle $galaSalle): static
    {
        if (!$this->galaSalle->contains($galaSalle)) {
            $this->galaSalle->add($galaSalle);
            $galaSalle->setGala($this);
        }

        return $this;
    }

    public function removeGalaSalle(Salle $galaSalle): static
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
