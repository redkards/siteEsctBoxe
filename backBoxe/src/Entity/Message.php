<?php

namespace App\Entity;

use App\Repository\MessageRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: MessageRepository::class)]
class Message
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[group(['getMessages'])]
    #[ORM\Column]
    private ?int $id = null;

    #[group(['getMessages'])]
    #[ORM\Column(length: 150)]
    private ?string $expediteur = null;

    #[group(['getMessages'])]
    #[ORM\Column(length: 150)]
    private ?string $destinataire = null;

    #[Groups(['getMessages'])]
    #[ORM\Column(length: 500)]
    private ?string $contenu = null;

    #[group(['getMessages'])]
    #[ORM\Column]
    private ?\DateTimeImmutable $msgDate = null;

    #[group(['getMessages'])]
    #[ORM\ManyToOne(inversedBy: 'messagerieMsg')]
    private ?Messagerie $messagerie = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getExpediteur(): ?string
    {
        return $this->expediteur;
    }

    public function setExpediteur(string $expediteur): static
    {
        $this->expediteur = $expediteur;

        return $this;
    }

    public function getDestinataire(): ?string
    {
        return $this->destinataire;
    }

    public function setDestinataire(string $destinataire): static
    {
        $this->destinataire = $destinataire;

        return $this;
    }

    public function getContenu(): ?string
    {
        return $this->contenu;
    }

    public function setContenu(string $contenu): static
    {
        $this->contenu = $contenu;

        return $this;
    }

    public function getMsgDate(): ?\DateTimeImmutable
    {
        return $this->msgDate;
    }

    public function setMsgDate(\DateTimeImmutable $msgDate): static
    {
        $this->msgDate = $msgDate;

        return $this;
    }

    public function getMessagerie(): ?Messagerie
    {
        return $this->messagerie;
    }

    public function setMessagerie(?Messagerie $messagerie): static
    {
        $this->messagerie = $messagerie;

        return $this;
    }
}
