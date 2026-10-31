<?php

namespace App\Entity;

use App\Enum\MembershipStatus;
use App\Repository\MembershipRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Context;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Serializer\Normalizer\DateTimeNormalizer;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Demande d'inscription / adhésion pour une saison, déposée depuis le site
 * (visiteur ou membre connecté), traitée par les coachs dans le back-office.
 */
#[ORM\Entity(repositoryClass: MembershipRepository::class)]
#[ORM\Index(name: 'IDX_MEMBERSHIP_STATUS', columns: ['status'])]
class Membership
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['membership:me'])]
    private ?int $id = null;

    /**
     * Compte du demandeur (null : demande déposée sans être connecté)
     */
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
    private ?User $user = null;

    #[ORM\Column(length: 80)]
    #[Assert\NotBlank]
    #[Assert\Length(max: 80)]
    #[Groups(['membership:me'])]
    private ?string $firstName = null;

    #[ORM\Column(length: 80)]
    #[Assert\NotBlank]
    #[Assert\Length(max: 80)]
    #[Groups(['membership:me'])]
    private ?string $lastName = null;

    #[ORM\Column(length: 180)]
    #[Assert\NotBlank]
    #[Assert\Email]
    #[Groups(['membership:me'])]
    private ?string $email = null;

    #[ORM\Column(length: 20, nullable: true)]
    #[Assert\Length(max: 20)]
    #[Groups(['membership:me'])]
    private ?string $phone = null;

    #[ORM\Column(type: Types::DATE_IMMUTABLE)]
    #[Assert\NotNull]
    #[Context([DateTimeNormalizer::FORMAT_KEY => 'Y-m-d'])]
    #[Groups(['membership:me'])]
    private ?\DateTimeImmutable $birthDate = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotNull]
    #[Groups(['membership:me'])]
    private ?Discipline $discipline = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
    #[Groups(['membership:me'])]
    private ?Pricing $pricing = null;

    /**
     * Saison, « 2026-2027 »
     */
    #[ORM\Column(length: 9)]
    #[Assert\NotBlank]
    #[Assert\Regex(pattern: '/^\d{4}-\d{4}$/', message: 'Saison au format 2026-2027.')]
    #[Groups(['membership:me'])]
    private ?string $season = null;

    /**
     * Représentant légal (obligatoire si mineur)
     */
    #[ORM\Column(length: 160, nullable: true)]
    #[Assert\Length(max: 160)]
    #[Groups(['membership:me'])]
    private ?string $legalGuardian = null;

    /**
     * Certificat médical déclaré (à remettre au club)
     */
    #[ORM\Column(options: ['default' => false])]
    #[Groups(['membership:me'])]
    private bool $medicalCertificate = false;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['membership:me'])]
    private ?string $message = null;

    #[ORM\Column(length: 20, enumType: MembershipStatus::class)]
    #[Assert\NotNull]
    #[Groups(['membership:me'])]
    private MembershipStatus $status = MembershipStatus::EnAttente;

    /**
     * Acceptation du traitement des données (RGPD)
     */
    #[ORM\Column]
    private ?\DateTimeImmutable $consentAt = null;

    #[ORM\Column]
    #[Groups(['membership:me'])]
    private ?\DateTimeImmutable $createdAt = null;

    /**
     * Date de validation ou de refus
     */
    #[ORM\Column(nullable: true)]
    #[Groups(['membership:me'])]
    private ?\DateTimeImmutable $processedAt = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
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

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(?string $phone): static
    {
        $this->phone = $phone;

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

    public function getDiscipline(): ?Discipline
    {
        return $this->discipline;
    }

    public function setDiscipline(?Discipline $discipline): static
    {
        $this->discipline = $discipline;

        return $this;
    }

    public function getPricing(): ?Pricing
    {
        return $this->pricing;
    }

    public function setPricing(?Pricing $pricing): static
    {
        $this->pricing = $pricing;

        return $this;
    }

    public function getSeason(): ?string
    {
        return $this->season;
    }

    public function setSeason(?string $season): static
    {
        $this->season = $season;

        return $this;
    }

    public function getLegalGuardian(): ?string
    {
        return $this->legalGuardian;
    }

    public function setLegalGuardian(?string $legalGuardian): static
    {
        $this->legalGuardian = $legalGuardian;

        return $this;
    }

    public function isMedicalCertificate(): bool
    {
        return $this->medicalCertificate;
    }

    public function setMedicalCertificate(bool $medicalCertificate): static
    {
        $this->medicalCertificate = $medicalCertificate;

        return $this;
    }

    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function setMessage(?string $message): static
    {
        $this->message = $message;

        return $this;
    }

    public function getStatus(): MembershipStatus
    {
        return $this->status;
    }

    public function setStatus(MembershipStatus $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getConsentAt(): ?\DateTimeImmutable
    {
        return $this->consentAt;
    }

    public function setConsentAt(?\DateTimeImmutable $consentAt): static
    {
        $this->consentAt = $consentAt;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(?\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getProcessedAt(): ?\DateTimeImmutable
    {
        return $this->processedAt;
    }

    public function setProcessedAt(?\DateTimeImmutable $processedAt): static
    {
        $this->processedAt = $processedAt;

        return $this;
    }

    public function isMinor(): bool
    {
        return null !== $this->birthDate && $this->birthDate > new \DateTimeImmutable('-18 years');
    }

    public function validate(): static
    {
        $this->status = MembershipStatus::Validee;
        $this->processedAt = new \DateTimeImmutable();

        return $this;
    }

    public function refuse(): static
    {
        $this->status = MembershipStatus::Refusee;
        $this->processedAt = new \DateTimeImmutable();

        return $this;
    }

    public function __toString(): string
    {
        return sprintf('%s %s — %s', $this->firstName, $this->lastName, $this->season);
    }
}
