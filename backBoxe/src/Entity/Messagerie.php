<?php

namespace App\Entity;

use App\Repository\MessagerieRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: MessagerieRepository::class)]
class Messagerie
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[groups(['getMessageries'])]
    #[ORM\Column]
    private ?int $id = null;

    /**
     * @var Collection<int, message>
     */
    #[groups(['getMessageries'])]
    #[ORM\OneToMany(targetEntity: Message::class, mappedBy: 'messagerie')]
    private Collection $messagerieMsg;

    /**
     * @var Collection<int, user>
     */
    #[groups(['getMessageries'])]
    #[ORM\OneToMany(targetEntity: User::class, mappedBy: 'messagerie', orphanRemoval: true)]
    private Collection $messagerieUser;

    public function __construct()
    {
        $this->messagerieMsg = new ArrayCollection();
        $this->messagerieUser = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return Collection<int, message>
     */
    public function getMessagerieMsg(): Collection
    {
        return $this->messagerieMsg;
    }

    public function addMessagerieMsg(Message $messagerieMsg): static
    {
        if (!$this->messagerieMsg->contains($messagerieMsg)) {
            $this->messagerieMsg->add($messagerieMsg);
            $messagerieMsg->setMessagerie($this);
        }

        return $this;
    }

    public function removeMessagerieMsg(Message $messagerieMsg): static
    {
        if ($this->messagerieMsg->removeElement($messagerieMsg)) {
            // set the owning side to null (unless already changed)
            if ($messagerieMsg->getMessagerie() === $this) {
                $messagerieMsg->setMessagerie(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, user>
     */
    public function getMessagerieUser(): Collection
    {
        return $this->messagerieUser;
    }

    public function addMessagerieUser(User $messagerieUser): static
    {
        if (!$this->messagerieUser->contains($messagerieUser)) {
            $this->messagerieUser->add($messagerieUser);
            $messagerieUser->setMessagerie($this);
        }

        return $this;
    }

    public function removeMessagerieUser(User $messagerieUser): static
    {
        if ($this->messagerieUser->removeElement($messagerieUser)) {
            // set the owning side to null (unless already changed)
            if ($messagerieUser->getMessagerie() === $this) {
                $messagerieUser->setMessagerie(null);
            }
        }

        return $this;
    }
}
