<?php

namespace App\Entity;

use App\Repository\NewBoxeursRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: NewBoxeursRepository::class)]
class NewBoxeurs
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 120)]
    private ?string $boxeurNom = null;

    /**
     * @var Collection<int, categorie>
     */
    #[ORM\OneToMany(targetEntity: categorie::class, mappedBy: 'newBoxeurs')]
    private Collection $categorie;

    public function __construct()
    {
        $this->categorie = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getBoxeurNom(): ?string
    {
        return $this->boxeurNom;
    }

    public function setBoxeurNom(string $boxeurNom): static
    {
        $this->boxeurNom = $boxeurNom;

        return $this;
    }

    /**
     * @return Collection<int, categorie>
     */
    public function getCategorie(): Collection
    {
        return $this->categorie;
    }

    public function addCategorie(categorie $categorie): static
    {
        if (!$this->categorie->contains($categorie)) {
            $this->categorie->add($categorie);
            $categorie->setNewBoxeurs($this);
        }

        return $this;
    }

    public function removeCategorie(categorie $categorie): static
    {
        if ($this->categorie->removeElement($categorie)) {
            // set the owning side to null (unless already changed)
            if ($categorie->getNewBoxeurs() === $this) {
                $categorie->setNewBoxeurs(null);
            }
        }

        return $this;
    }
}
