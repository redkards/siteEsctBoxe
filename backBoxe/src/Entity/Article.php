<?php

namespace App\Entity;

use App\Entity\Behavior\SluggableInterface;
use App\Enum\ArticleCategory;
use App\Repository\ArticleRepository;
use App\Validator\ImagePath;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Serializer\Attribute\SerializedName;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Actualité du club. Non publiée tant que publishedAt est vide ou dans le futur.
 */
#[ORM\Entity(repositoryClass: ArticleRepository::class)]
#[ORM\Index(name: 'IDX_ARTICLE_PUBLISHED_AT', columns: ['published_at'])]
#[UniqueEntity(fields: ['slug'], message: 'Ce slug est déjà utilisé.')]
class Article implements SluggableInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['article:list', 'article:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    #[Assert\NotBlank]
    #[Assert\Length(max: 180)]
    #[Groups(['article:list', 'article:read'])]
    private ?string $title = null;

    /**
     * Généré depuis le titre s'il est laissé vide (voir SlugListener)
     */
    #[ORM\Column(length: 200, unique: true)]
    #[Assert\Length(max: 200)]
    #[Assert\Regex(pattern: '/^[a-z0-9]+(?:-[a-z0-9]+)*$/', message: 'Minuscules, chiffres et tirets uniquement.')]
    #[Groups(['article:list', 'article:read'])]
    private ?string $slug = null;

    #[ORM\Column(length: 20, enumType: ArticleCategory::class)]
    #[Assert\NotNull]
    #[Groups(['article:list', 'article:read'])]
    private ArticleCategory $category = ArticleCategory::Club;

    #[ORM\Column(length: 400)]
    #[Assert\NotBlank]
    #[Assert\Length(max: 400)]
    #[Groups(['article:list', 'article:read'])]
    private ?string $excerpt = null;

    /**
     * HTML simple saisi dans le back-office (rédacteurs de confiance)
     */
    #[ORM\Column(type: Types::TEXT)]
    #[Assert\NotBlank]
    #[Groups(['article:read'])]
    private ?string $content = null;

    #[ORM\Column(length: 500, nullable: true)]
    #[ImagePath]
    #[Groups(['article:list', 'article:read'])]
    private ?string $coverImage = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['article:list', 'article:read'])]
    private ?\DateTimeImmutable $publishedAt = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
    private ?User $author = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
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

    public function getSlugSource(): string
    {
        return (string) $this->title;
    }

    public function getCategory(): ArticleCategory
    {
        return $this->category;
    }

    public function setCategory(ArticleCategory $category): static
    {
        $this->category = $category;

        return $this;
    }

    public function getExcerpt(): ?string
    {
        return $this->excerpt;
    }

    public function setExcerpt(string $excerpt): static
    {
        $this->excerpt = $excerpt;

        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): static
    {
        $this->content = $content;

        return $this;
    }

    public function getCoverImage(): ?string
    {
        return $this->coverImage;
    }

    public function setCoverImage(?string $coverImage): static
    {
        $this->coverImage = $coverImage;

        return $this;
    }

    public function getPublishedAt(): ?\DateTimeImmutable
    {
        return $this->publishedAt;
    }

    public function setPublishedAt(?\DateTimeImmutable $publishedAt): static
    {
        $this->publishedAt = $publishedAt;

        return $this;
    }

    public function isPublished(): bool
    {
        return null !== $this->publishedAt && $this->publishedAt <= new \DateTimeImmutable();
    }

    public function getAuthor(): ?User
    {
        return $this->author;
    }

    public function setAuthor(?User $author): static
    {
        $this->author = $author;

        return $this;
    }

    /**
     * Nom public de l'auteur, jamais son email : {firstName, lastName} ou null
     *
     * @return array{firstName: ?string, lastName: ?string}|null
     */
    #[Groups(['article:read'])]
    #[SerializedName('author')]
    public function getAuthorName(): ?array
    {
        return PublicName::of($this->author);
    }

    public function __toString(): string
    {
        return (string) $this->title;
    }
}
