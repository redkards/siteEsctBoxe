<?php

namespace App\Entity;

use App\Repository\EntraineurRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\Groups;


#[ORM\Entity(repositoryClass: EntraineurRepository::class)]
class Entraineur
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[groups(['getEntraineurs'])]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    #[groups(['getEntraineurs'])]
    private ?string $trainerNom = null;

    #[ORM\Column(length: 100)]
    #[groups(['getEntraineurs'])]
    private ?string $trainerPrenom = null;

    /**
     * @var Collection<int, entrainement>
     */
    #[ORM\ManyToMany(targetEntity: Entrainement::class, inversedBy: 'entraineurs')]
    private Collection $entraineurTraining;

    /**
     * @var Collection<int, boxeur>
     */
    #[ORM\ManyToMany(targetEntity: Boxeur::class, inversedBy: 'entraineurs')]
    #[groups(['getBoxeurs'])]
    private Collection $entraineurBoxeur;

    public function __construct()
    {
        $this->entraineurTraining = new ArrayCollection();
        $this->entraineurBoxeur = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTrainerNom(): ?string
    {
        return $this->trainerNom;
    }

    public function setTrainerNom(string $trainerNom): static
    {
        $this->trainerNom = $trainerNom;

        return $this;
    }

    public function getTrainerPrenom(): ?string
    {
        return $this->trainerPrenom;
    }

    public function setTrainerPrenom(string $trainerPrenom): static
    {
        $this->trainerPrenom = $trainerPrenom;

        return $this;
    }

    /**
     * @return Collection<int, entrainement>
     */
    public function getEntraineurTraining(): Collection
    {
        return $this->entraineurTraining;
    }

    public function addEntraineurTraining(Entrainement $entraineurTraining): static
    {
        if (!$this->entraineurTraining->contains($entraineurTraining)) {
            $this->entraineurTraining->add($entraineurTraining);
        }

        return $this;
    }

    public function removeEntraineurTraining(Entrainement $entraineurTraining): static
    {
        $this->entraineurTraining->removeElement($entraineurTraining);

        return $this;
    }

    /**
     * @return Collection<int, boxeur>
     */
    public function getEntraineurBoxeur(): Collection
    {
        return $this->entraineurBoxeur;
    }

    public function addEntraineurBoxeur(Boxeur $entraineurBoxeur): static
    {
        if (!$this->entraineurBoxeur->contains($entraineurBoxeur)) {
            $this->entraineurBoxeur->add($entraineurBoxeur);
        }

        return $this;
    }

    public function removeEntraineurBoxeur(Boxeur $entraineurBoxeur): static
    {
        $this->entraineurBoxeur->removeElement($entraineurBoxeur);

        return $this;
    }
}
