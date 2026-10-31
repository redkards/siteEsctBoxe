<?php

namespace App\Entity;

use App\Enum\FightMethod;
use App\Enum\FightResult;
use App\Repository\FightRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Context;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Serializer\Normalizer\DateTimeNormalizer;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Combat du palmarès détaillé d'un boxeur.
 */
#[ORM\Entity(repositoryClass: FightRepository::class)]
#[ORM\Index(name: 'IDX_FIGHT_DATE', columns: ['date'])]
class Fight
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['fight:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    #[Assert\NotNull]
    #[Groups(['fight:boxer'])]
    private ?Boxer $boxer = null;

    #[ORM\Column(type: Types::DATE_IMMUTABLE)]
    #[Assert\NotNull]
    #[Context([DateTimeNormalizer::FORMAT_KEY => 'Y-m-d'])]
    #[Groups(['fight:read'])]
    private ?\DateTimeImmutable $date = null;

    #[ORM\Column(length: 120)]
    #[Assert\NotBlank]
    #[Assert\Length(max: 120)]
    #[Groups(['fight:read'])]
    private ?string $opponent = null;

    #[ORM\Column(length: 150, nullable: true)]
    #[Assert\Length(max: 150)]
    #[Groups(['fight:read'])]
    private ?string $opponentClub = null;

    #[ORM\Column(length: 150, nullable: true)]
    #[Assert\Length(max: 150)]
    #[Groups(['fight:read'])]
    private ?string $location = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
    #[Groups(['fight:event'])]
    private ?Gala $event = null;

    #[ORM\Column(length: 20, enumType: FightResult::class)]
    #[Assert\NotNull]
    #[Groups(['fight:read'])]
    private FightResult $result = FightResult::Victoire;

    #[ORM\Column(length: 20, enumType: FightMethod::class)]
    #[Assert\NotNull]
    #[Groups(['fight:read'])]
    private FightMethod $method = FightMethod::Points;

    #[ORM\Column(nullable: true)]
    #[Assert\Range(min: 1, max: 12)]
    #[Groups(['fight:read'])]
    private ?int $rounds = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getBoxer(): ?Boxer
    {
        return $this->boxer;
    }

    public function setBoxer(?Boxer $boxer): static
    {
        $this->boxer = $boxer;

        return $this;
    }

    public function getDate(): ?\DateTimeImmutable
    {
        return $this->date;
    }

    public function setDate(?\DateTimeImmutable $date): static
    {
        $this->date = $date;

        return $this;
    }

    public function getOpponent(): ?string
    {
        return $this->opponent;
    }

    public function setOpponent(?string $opponent): static
    {
        $this->opponent = $opponent;

        return $this;
    }

    public function getOpponentClub(): ?string
    {
        return $this->opponentClub;
    }

    public function setOpponentClub(?string $opponentClub): static
    {
        $this->opponentClub = $opponentClub;

        return $this;
    }

    public function getLocation(): ?string
    {
        return $this->location;
    }

    public function setLocation(?string $location): static
    {
        $this->location = $location;

        return $this;
    }

    public function getEvent(): ?Gala
    {
        return $this->event;
    }

    public function setEvent(?Gala $event): static
    {
        $this->event = $event;

        return $this;
    }

    public function getResult(): FightResult
    {
        return $this->result;
    }

    public function setResult(FightResult $result): static
    {
        $this->result = $result;

        return $this;
    }

    public function getMethod(): FightMethod
    {
        return $this->method;
    }

    public function setMethod(FightMethod $method): static
    {
        $this->method = $method;

        return $this;
    }

    public function getRounds(): ?int
    {
        return $this->rounds;
    }

    public function setRounds(?int $rounds): static
    {
        $this->rounds = $rounds;

        return $this;
    }


    public function __toString(): string
    {
        return sprintf('%s vs %s (%s)', $this->boxer, $this->opponent, $this->date?->format('d/m/Y'));
    }
}
