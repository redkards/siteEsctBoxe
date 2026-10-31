<?php

namespace App\Entity;

use App\Repository\EmailTableRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: EmailTableRepository::class)]
class EmailTable
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 150)]
    private ?string $emailAdresse = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $emailMsg = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable(); // Initialiser la date de création
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmailAdresse(): ?string
    {
        return $this->emailAdresse;
    }

    public function setEmailAdresse(string $emailAdresse): static
    {
        $this->emailAdresse = $emailAdresse;

        return $this;
    }

    public function getEmailMsg(): ?string
    {
        return $this->emailMsg;
    }

    public function setEmailMsg(string $emailMsg): static
    {
        $this->emailMsg = $emailMsg;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }
}
