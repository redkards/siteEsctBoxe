<?php

namespace App\Entity;

use App\Enum\Audience;
use App\Repository\TrainingSlotRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Créneau hebdomadaire du planning d'entraînement.
 */
#[ORM\Entity(repositoryClass: TrainingSlotRepository::class)]
class TrainingSlot
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['slot:read'])]
    private ?int $id = null;

    /**
     * 1 = lundi … 7 = dimanche (ISO 8601)
     */
    #[ORM\Column(type: 'smallint')]
    #[Assert\NotNull]
    #[Assert\Range(min: 1, max: 7)]
    #[Groups(['slot:read'])]
    private ?int $dayOfWeek = null;

    /**
     * Heure de début, « 18:00 »
     */
    #[ORM\Column(length: 5)]
    #[Assert\NotBlank]
    #[Assert\Regex(pattern: '/^([01]\d|2[0-3]):[0-5]\d$/', message: 'Heure au format HH:MM.')]
    #[Groups(['slot:read'])]
    private ?string $startTime = null;

    #[ORM\Column(length: 5)]
    #[Assert\NotBlank]
    #[Assert\Regex(pattern: '/^([01]\d|2[0-3]):[0-5]\d$/', message: 'Heure au format HH:MM.')]
    #[Assert\GreaterThan(propertyPath: 'startTime', message: 'La fin doit être après le début.')]
    #[Groups(['slot:read'])]
    private ?string $endTime = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    #[Assert\NotNull]
    #[Groups(['slot:read'])]
    private ?Discipline $discipline = null;

    #[ORM\Column(length: 20, enumType: Audience::class)]
    #[Assert\NotNull]
    #[Groups(['slot:read'])]
    private Audience $audience = Audience::Tous;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
    #[Groups(['slot:read'])]
    private ?Coach $coach = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotNull]
    #[Groups(['slot:read'])]
    private ?Venue $venue = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDayOfWeek(): ?int
    {
        return $this->dayOfWeek;
    }

    public function setDayOfWeek(?int $dayOfWeek): static
    {
        $this->dayOfWeek = $dayOfWeek;

        return $this;
    }

    public function getStartTime(): ?string
    {
        return $this->startTime;
    }

    public function setStartTime(?string $startTime): static
    {
        $this->startTime = $startTime;

        return $this;
    }

    public function getEndTime(): ?string
    {
        return $this->endTime;
    }

    public function setEndTime(?string $endTime): static
    {
        $this->endTime = $endTime;

        return $this;
    }

    public function getDiscipline(): ?Discipline
    {
        return $this->discipline;
    }

    public function setDiscipline(?Discipline $discipline): static
    {
        $this->discipline = $discipline;

        return $this;
    }

    public function getAudience(): Audience
    {
        return $this->audience;
    }

    public function setAudience(Audience $audience): static
    {
        $this->audience = $audience;

        return $this;
    }

    public function getCoach(): ?Coach
    {
        return $this->coach;
    }

    public function setCoach(?Coach $coach): static
    {
        $this->coach = $coach;

        return $this;
    }

    public function getVenue(): ?Venue
    {
        return $this->venue;
    }

    public function setVenue(?Venue $venue): static
    {
        $this->venue = $venue;

        return $this;
    }

    public const DAYS = [1 => 'Lundi', 2 => 'Mardi', 3 => 'Mercredi', 4 => 'Jeudi', 5 => 'Vendredi', 6 => 'Samedi', 7 => 'Dimanche'];

    public function __toString(): string
    {
        return sprintf('%s %s-%s %s', self::DAYS[$this->dayOfWeek] ?? '?', $this->startTime, $this->endTime, $this->discipline);
    }
}
