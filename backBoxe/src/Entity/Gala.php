<?php

namespace App\Entity;

use App\Entity\Behavior\SluggableInterface;
use App\Enum\GalaType;
use App\Repository\GalaRepository;
use App\Validator\ImagePath;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Événement du club : gala, compétition, stage ou portes ouvertes.
 * Visible publiquement seulement s'il est publié.
 */
#[ORM\Entity(repositoryClass: GalaRepository::class)]
#[ORM\Index(name: 'IDX_GALA_STARTS_AT', columns: ['starts_at'])]
#[UniqueEntity(fields: ['slug'], message: 'Ce slug est déjà utilisé.')]
class Gala implements SluggableInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['gala:list', 'gala:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    #[Assert\NotBlank]
    #[Assert\Length(max: 180)]
    #[Groups(['gala:list', 'gala:read', 'gala:ref'])]
    private ?string $title = null;

    /**
     * Généré automatiquement s'il est laissé vide (voir SlugListener)
     */
    #[ORM\Column(length: 200, unique: true)]
    #[Assert\Length(max: 200)]
    #[Assert\Regex(pattern: '/^[a-z0-9]+(?:-[a-z0-9]+)*$/', message: 'Minuscules, chiffres et tirets uniquement.')]
    #[Groups(['gala:list', 'gala:read', 'gala:ref'])]
    private ?string $slug = null;

    #[ORM\Column(length: 20, enumType: GalaType::class)]
    #[Assert\NotNull]
    #[Groups(['gala:list', 'gala:read'])]
    private GalaType $type = GalaType::Gala;

    #[ORM\Column]
    #[Assert\NotNull]
    #[Groups(['gala:list', 'gala:read', 'gala:ref'])]
    private ?\DateTimeImmutable $startsAt = null;

    #[ORM\Column(nullable: true)]
    #[Assert\GreaterThanOrEqual(propertyPath: 'startsAt', message: 'La fin doit être postérieure au début.')]
    #[Groups(['gala:list', 'gala:read'])]
    private ?\DateTimeImmutable $endsAt = null;

    /**
     * Lieu (texte libre : salle, gymnase…)
     */
    #[ORM\Column(length: 150)]
    #[Assert\NotBlank]
    #[Assert\Length(max: 150)]
    #[Groups(['gala:list', 'gala:read'])]
    private ?string $venue = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Assert\Length(max: 255)]
    #[Groups(['gala:list', 'gala:read'])]
    private ?string $address = null;

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank]
    #[Assert\Length(max: 100)]
    #[Groups(['gala:list', 'gala:read'])]
    private ?string $city = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['gala:list', 'gala:read'])]
    private ?string $description = null;

    /**
     * Affiche
     */
    #[ORM\Column(length: 500, nullable: true)]
    #[ImagePath]
    #[Groups(['gala:list', 'gala:read'])]
    private ?string $poster = null;

    #[ORM\Column(length: 500, nullable: true)]
    #[Assert\Url(requireTld: true)]
    #[Groups(['gala:list', 'gala:read'])]
    private ?string $ticketUrl = null;

    /**
     * Prix d'entrée en centimes (null = non communiqué, 0 = gratuit)
     */
    #[ORM\Column(nullable: true)]
    #[Assert\PositiveOrZero]
    #[Groups(['gala:list', 'gala:read'])]
    private ?int $price = null;

    #[ORM\Column(options: ['default' => false])]
    private bool $published = false;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(?string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(?string $slug): static
    {
        $this->slug = $slug;

        return $this;
    }

    public function getType(): GalaType
    {
        return $this->type;
    }

    public function setType(GalaType $type): static
    {
        $this->type = $type;

        return $this;
    }

    public function getStartsAt(): ?\DateTimeImmutable
    {
        return $this->startsAt;
    }

    public function setStartsAt(?\DateTimeImmutable $startsAt): static
    {
        $this->startsAt = $startsAt;

        return $this;
    }

    public function getEndsAt(): ?\DateTimeImmutable
    {
        return $this->endsAt;
    }

    public function setEndsAt(?\DateTimeImmutable $endsAt): static
    {
        $this->endsAt = $endsAt;

        return $this;
    }

    public function getVenue(): ?string
    {
        return $this->venue;
    }

    public function setVenue(?string $venue): static
    {
        $this->venue = $venue;

        return $this;
    }

    public function getAddress(): ?string
    {
        return $this->address;
    }

    public function setAddress(?string $address): static
    {
        $this->address = $address;

        return $this;
    }

    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(?string $city): static
    {
        $this->city = $city;

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

    public function getPoster(): ?string
    {
        return $this->poster;
    }

    public function setPoster(?string $poster): static
    {
        $this->poster = $poster;

        return $this;
    }

    public function getTicketUrl(): ?string
    {
        return $this->ticketUrl;
    }

    public function setTicketUrl(?string $ticketUrl): static
    {
        $this->ticketUrl = $ticketUrl;

        return $this;
    }

    public function getPrice(): ?int
    {
        return $this->price;
    }

    public function setPrice(?int $price): static
    {
        $this->price = $price;

        return $this;
    }

    public function isPublished(): bool
    {
        return $this->published;
    }

    public function setPublished(bool $published): static
    {
        $this->published = $published;

        return $this;
    }

    public function getSlugSource(): string
    {
        return (string) $this->title;
    }

    public function __toString(): string
    {
        return (string) $this->title;
    }
}
