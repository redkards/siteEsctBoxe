<?php

namespace App\Entity;

use App\Enum\Audience;
use App\Enum\PricingPeriod;
use App\Repository\PricingRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Tarif d'adhésion (montants en centimes).
 */
#[ORM\Entity(repositoryClass: PricingRepository::class)]
class Pricing
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['pricing:read', 'pricing:ref'])]
    private ?int $id = null;

    #[ORM\Column(length: 120)]
    #[Assert\NotBlank]
    #[Assert\Length(max: 120)]
    #[Groups(['pricing:read', 'pricing:ref'])]
    private ?string $label = null;

    #[ORM\Column(length: 20, enumType: Audience::class)]
    #[Assert\NotNull]
    #[Groups(['pricing:read'])]
    private Audience $audience = Audience::Tous;

    #[ORM\Column]
    #[Assert\NotNull]
    #[Assert\PositiveOrZero]
    #[Groups(['pricing:read', 'pricing:ref'])]
    private ?int $priceCents = null;

    #[ORM\Column(length: 20, enumType: PricingPeriod::class)]
    #[Assert\NotNull]
    #[Groups(['pricing:read', 'pricing:ref'])]
    private PricingPeriod $period = PricingPeriod::Saison;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['pricing:read'])]
    private ?string $description = null;

    #[ORM\Column(options: ['default' => false])]
    #[Groups(['pricing:read'])]
    private bool $highlighted = false;

    /**
     * Ordre d'affichage (croissant)
     */
    #[ORM\Column(options: ['default' => 0])]
    #[Assert\PositiveOrZero]
    #[Groups(['pricing:read'])]
    private int $position = 0;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLabel(): ?string
    {
        return $this->label;
    }

    public function setLabel(?string $label): static
    {
        $this->label = $label;

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

    public function getPriceCents(): ?int
    {
        return $this->priceCents;
    }

    public function setPriceCents(?int $priceCents): static
    {
        $this->priceCents = $priceCents;

        return $this;
    }

    public function getPeriod(): PricingPeriod
    {
        return $this->period;
    }

    public function setPeriod(PricingPeriod $period): static
    {
        $this->period = $period;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function isHighlighted(): bool
    {
        return $this->highlighted;
    }

    public function setHighlighted(bool $highlighted): static
    {
        $this->highlighted = $highlighted;

        return $this;
    }

    public function getPosition(): int
    {
        return $this->position;
    }

    public function setPosition(int $position): static
    {
        $this->position = $position;

        return $this;
    }


    public function __toString(): string
    {
        return sprintf('%s (%s €)', $this->label, number_format(($this->priceCents ?? 0) / 100, 2, ',', ' '));
    }
}
