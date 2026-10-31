<?php

namespace App\Entity;

use App\Repository\MessageRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Serializer\Attribute\SerializedName;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Messagerie interne membre ↔ club. recipient = null : message adressé « au club »
 * (lu par les coachs dans le back-office).
 */
#[ORM\Entity(repositoryClass: MessageRepository::class)]
#[ORM\Index(name: 'IDX_MESSAGE_CREATED_AT', columns: ['created_at'])]
class Message
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['message:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    #[Assert\NotNull]
    private ?User $sender = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: true, onDelete: 'CASCADE')]
    private ?User $recipient = null;

    #[ORM\Column(length: 180)]
    #[Assert\NotBlank]
    #[Assert\Length(max: 180)]
    #[Groups(['message:read'])]
    private ?string $subject = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Assert\NotBlank]
    #[Groups(['message:read'])]
    private ?string $body = null;

    #[ORM\Column]
    #[Groups(['message:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['message:read'])]
    private ?\DateTimeImmutable $readAt = null;

    /**
     * Message auquel celui-ci répond
     */
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
    private ?Message $replyTo = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSender(): ?User
    {
        return $this->sender;
    }

    public function setSender(?User $sender): static
    {
        $this->sender = $sender;

        return $this;
    }

    public function getRecipient(): ?User
    {
        return $this->recipient;
    }

    public function setRecipient(?User $recipient): static
    {
        $this->recipient = $recipient;

        return $this;
    }

    public function getSubject(): ?string
    {
        return $this->subject;
    }

    public function setSubject(?string $subject): static
    {
        $this->subject = $subject;

        return $this;
    }

    public function getBody(): ?string
    {
        return $this->body;
    }

    public function setBody(?string $body): static
    {
        $this->body = $body;

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

    public function getReadAt(): ?\DateTimeImmutable
    {
        return $this->readAt;
    }

    public function setReadAt(?\DateTimeImmutable $readAt): static
    {
        $this->readAt = $readAt;

        return $this;
    }

    public function getReplyTo(): ?Message
    {
        return $this->replyTo;
    }

    public function setReplyTo(?Message $replyTo): static
    {
        $this->replyTo = $replyTo;

        return $this;
    }

    /**
     * @return array{firstName: ?string, lastName: ?string}|null
     */
    #[Groups(['message:read'])]
    #[SerializedName('sender')]
    public function getSenderName(): ?array
    {
        return PublicName::of($this->sender);
    }

    /**
     * null : message adressé au club
     *
     * @return array{firstName: ?string, lastName: ?string}|null
     */
    #[Groups(['message:read'])]
    #[SerializedName('recipient')]
    public function getRecipientName(): ?array
    {
        return PublicName::of($this->recipient);
    }

    public function isToClub(): bool
    {
        return null === $this->recipient;
    }

    public function __toString(): string
    {
        return (string) $this->subject;
    }
}
