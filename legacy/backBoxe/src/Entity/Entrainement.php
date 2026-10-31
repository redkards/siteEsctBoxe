<?php

namespace App\Entity;

use App\Repository\EntrainementRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: EntrainementRepository::class)]
class Entrainement
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[groups(['getTrainings'])]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATE_IMMUTABLE)]
    #[groups(['getTrainings'])]
    private ?\DateTimeImmutable $trainingDate = null;

    #[ORM\Column(type: Types::TIME_IMMUTABLE)]
    #[groups(['getTrainings'])]
    private ?\DateTimeImmutable $startTime = null;

    #[ORM\Column(type: Types::TIME_IMMUTABLE)]
    #[groups(['getTrainings'])]
    private ?\DateTimeImmutable $endTime = null;

    #[ORM\Column(length: 255)]
    #[groups(['getTrainings'])]
    private ?string $lieu = null;

    /**
     * @var Collection<int, Entraineur>
     */
    #[ORM\ManyToMany(targetEntity: Entraineur::class, mappedBy: 'entraineurTraining')]
    #[groups(['getEntraineurs'])]
    private Collection $entraineurs;

    /**
     * @var Collection<int, salle>
     */
    #[ORM\ManyToMany(targetEntity: Salle::class, inversedBy: 'entrainements')]
    #[groups(['getSalles'])]
    private Collection $trainingSalle;

    public function __construct()
    {
        $this->entraineurs = new ArrayCollection();
        $this->trainingSalle = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTrainingDate(): ?\DateTimeImmutable
    {
        return $this->trainingDate;
    }

    public function setTrainingDate(\DateTimeImmutable $trainingDate): static
    {
        $this->trainingDate = $trainingDate;

        return $this;
    }

    public function getStartTime(): ?\DateTimeImmutable
    {
        return $this->startTime;
    }

    public function setStartTime(\DateTimeImmutable $startTime): static
    {
        $this->startTime = $startTime;

        return $this;
    }

    public function getEndTime(): ?\DateTimeImmutable
    {
        return $this->endTime;
    }

    public function setEndTime(\DateTimeImmutable $endTime): static
    {
        $this->endTime = $endTime;

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

    /**
     * @return Collection<int, Entraineur>
     */
    public function getEntraineurs(): Collection
    {
        return $this->entraineurs;
    }

    public function addEntraineur(Entraineur $entraineur): static
    {
        if (!$this->entraineurs->contains($entraineur)) {
            $this->entraineurs->add($entraineur);
            $entraineur->addEntraineurTraining($this);
        }

        return $this;
    }

    public function removeEntraineur(Entraineur $entraineur): static
    {
        if ($this->entraineurs->removeElement($entraineur)) {
            $entraineur->removeEntraineurTraining($this);
        }

        return $this;
    }

    /**
     * @return Collection<int, salle>
     */
    public function getTrainingSalle(): Collection
    {
        return $this->trainingSalle;
    }

    public function addTrainingSalle(Salle $trainingSalle): static
    {
        if (!$this->trainingSalle->contains($trainingSalle)) {
            $this->trainingSalle->add($trainingSalle);
        }

        return $this;
    }

    public function removeTrainingSalle(Salle $trainingSalle): static
    {
        $this->trainingSalle->removeElement($trainingSalle);

        return $this;
    }
}
