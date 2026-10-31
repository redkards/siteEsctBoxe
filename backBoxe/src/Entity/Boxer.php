<?php

namespace App\Entity;

use App\Content\AgeCategory;
use App\Entity\Behavior\SluggableInterface;
use App\Enum\BoxerLevel;
use App\Enum\Sex;
use App\Repository\BoxerRepository;
use App\Validator\ImagePath;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Boxeur licencié au club. La date de naissance n'est jamais exposée par l'API publique
 * (RGPD, licenciés souvent mineurs) : seule la catégorie d'âge l'est.
 */
#[ORM\Entity(repositoryClass: BoxerRepository::class)]
#[UniqueEntity(fields: ['slug'], message: 'Ce slug est déjà utilisé.')]
class Boxer implements SluggableInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['boxer:list', 'boxer:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 80)]
    #[Assert\NotBlank]
    #[Assert\Length(max: 80)]
    #[Groups(['boxer:list', 'boxer:read', 'boxer:ref'])]
    private ?string $firstName = null;

    #[ORM\Column(length: 80)]
    #[Assert\NotBlank]
    #[Assert\Length(max: 80)]
    #[Groups(['boxer:list', 'boxer:read', 'boxer:ref'])]
    private ?string $lastName = null;

    /**
     * Généré automatiquement s'il est laissé vide (voir SlugListener)
     */
    #[ORM\Column(length: 200, unique: true)]
    #[Assert\Length(max: 200)]
    #[Assert\Regex(pattern: '/^[a-z0-9]+(?:-[a-z0-9]+)*$/', message: 'Minuscules, chiffres et tirets uniquement.')]
    #[Groups(['boxer:list', 'boxer:read', 'boxer:ref'])]
    private ?string $slug = null;

    #[ORM\Column(length: 80, nullable: true)]
    #[Assert\Length(max: 80)]
    #[Groups(['boxer:list', 'boxer:read'])]
    private ?string $nickname = null;

    #[ORM\Column(type: Types::DATE_IMMUTABLE, nullable: true)]
    private ?\DateTimeImmutable $birthDate = null;

    #[ORM\Column(length: 1, enumType: Sex::class)]
    #[Assert\NotNull]
    #[Groups(['boxer:list', 'boxer:read'])]
    private Sex $sex = Sex::M;

    #[ORM\Column(nullable: true)]
    #[Assert\Range(min: 20, max: 200)]
    #[Groups(['boxer:list', 'boxer:read'])]
    private ?float $weightKg = null;

    /**
     * Catégorie de poids, ex. « -63,5 kg »
     */
    #[ORM\Column(length: 30, nullable: true)]
    #[Assert\Length(max: 30)]
    #[Groups(['boxer:list', 'boxer:read'])]
    private ?string $weightClass = null;

    #[ORM\Column(length: 20, enumType: BoxerLevel::class)]
    #[Assert\NotNull]
    #[Groups(['boxer:list', 'boxer:read'])]
    private BoxerLevel $level = BoxerLevel::Amateur;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
    #[Groups(['boxer:list', 'boxer:read'])]
    private ?Discipline $discipline = null;

    #[ORM\Column(length: 500, nullable: true)]
    #[ImagePath]
    #[Groups(['boxer:list', 'boxer:read'])]
    private ?string $photo = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['boxer:read'])]
    private ?string $bio = null;

    /**
     * Bilan (peut inclure des combats antérieurs au club, non détaillés)
     */
    #[ORM\Column(options: ['default' => 0])]
    #[Assert\PositiveOrZero]
    #[Groups(['boxer:list', 'boxer:read'])]
    private int $wins = 0;

    #[ORM\Column(options: ['default' => 0])]
    #[Assert\PositiveOrZero]
    #[Groups(['boxer:list', 'boxer:read'])]
    private int $losses = 0;

    #[ORM\Column(options: ['default' => 0])]
    #[Assert\PositiveOrZero]
    #[Groups(['boxer:list', 'boxer:read'])]
    private int $draws = 0;

    #[ORM\Column(options: ['default' => 0])]
    #[Assert\PositiveOrZero]
    #[Groups(['boxer:list', 'boxer:read'])]
    private int $kos = 0;

    #[ORM\Column(options: ['default' => true])]
    private bool $active = true;

    #[ORM\Column(options: ['default' => false])]
    #[Groups(['boxer:list', 'boxer:read'])]
    private bool $featured = false;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(?string $firstName): static
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(?string $lastName): static
    {
        $this->lastName = $lastName;

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

    public function getNickname(): ?string
    {
        return $this->nickname;
    }

    public function setNickname(?string $nickname): static
    {
        $this->nickname = $nickname;

        return $this;
    }

    public function getBirthDate(): ?\DateTimeImmutable
    {
        return $this->birthDate;
    }

    public function setBirthDate(?\DateTimeImmutable $birthDate): static
    {
        $this->birthDate = $birthDate;

        return $this;
    }

    public function getSex(): Sex
    {
        return $this->sex;
    }

    public function setSex(Sex $sex): static
    {
        $this->sex = $sex;

        return $this;
    }

    public function getWeightKg(): ?float
    {
        return $this->weightKg;
    }

    public function setWeightKg(?float $weightKg): static
    {
        $this->weightKg = $weightKg;

        return $this;
    }

    public function getWeightClass(): ?string
    {
        return $this->weightClass;
    }

    public function setWeightClass(?string $weightClass): static
    {
        $this->weightClass = $weightClass;

        return $this;
    }

    public function getLevel(): BoxerLevel
    {
        return $this->level;
    }

    public function setLevel(BoxerLevel $level): static
    {
        $this->level = $level;

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

    public function getPhoto(): ?string
    {
        return $this->photo;
    }

    public function setPhoto(?string $photo): static
    {
        $this->photo = $photo;

        return $this;
    }

    public function getBio(): ?string
    {
        return $this->bio;
    }

    public function setBio(?string $bio): static
    {
        $this->bio = $bio;

        return $this;
    }

    public function getWins(): int
    {
        return $this->wins;
    }

    public function setWins(int $wins): static
    {
        $this->wins = $wins;

        return $this;
    }

    public function getLosses(): int
    {
        return $this->losses;
    }

    public function setLosses(int $losses): static
    {
        $this->losses = $losses;

        return $this;
    }

    public function getDraws(): int
    {
        return $this->draws;
    }

    public function setDraws(int $draws): static
    {
        $this->draws = $draws;

        return $this;
    }

    public function getKos(): int
    {
        return $this->kos;
    }

    public function setKos(int $kos): static
    {
        $this->kos = $kos;

        return $this;
    }

    public function isActive(): bool
    {
        return $this->active;
    }

    public function setActive(bool $active): static
    {
        $this->active = $active;

        return $this;
    }

    public function isFeatured(): bool
    {
        return $this->featured;
    }

    public function setFeatured(bool $featured): static
    {
        $this->featured = $featured;

        return $this;
    }

    public function getSlugSource(): string
    {
        return $this->firstName.' '.$this->lastName;
    }

    /**
     * Catégorie d'âge sportive (Poussin… Senior, Vétéran) calculée pour la saison en cours
     */
    #[Groups(['boxer:list', 'boxer:read'])]
    public function getAgeCategory(): ?string
    {
        return AgeCategory::of($this->birthDate);
    }

    /**
     * @return array{wins: int, losses: int, draws: int, kos: int}
     */
    #[Groups(['boxer:read'])]
    public function getRecord(): array
    {
        return ['wins' => $this->wins, 'losses' => $this->losses, 'draws' => $this->draws, 'kos' => $this->kos];
    }

    public function __toString(): string
    {
        return trim($this->firstName.' '.$this->lastName);
    }
}
