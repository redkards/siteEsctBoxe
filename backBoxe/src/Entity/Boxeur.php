<?php

namespace App\Entity;

use App\Repository\BoxeurRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: BoxeurRepository::class)]
class Boxeur
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[groups(['getBoxeurs'])]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    #[groups(['getBoxeurs'])]
    private ?float $poids = null;

    #[ORM\Column(length: 100)]
    #[groups(['getBoxeurs'])]
    private ?string $boxeurNom = null;

    #[ORM\Column(length: 100)]
    #[groups(['getBoxeurs'])]
    private ?string $boxeurPrenom = null;

    /**
     * @var Collection<int, categorie>
     */
    #[ORM\OneToMany(targetEntity: categorie::class, mappedBy: 'boxeur', orphanRemoval: true)]
    private Collection $boxeurCategorie;

    /**
     * @var Collection<int, boxeType>
     */
    #[ORM\OneToMany(targetEntity: boxeType::class, mappedBy: 'boxeur', orphanRemoval: true)]
    private Collection $boxeurTypeBoxe;

    /**
     * @var Collection<int, Entraineur>
     */
    #[ORM\ManyToMany(targetEntity: Entraineur::class, mappedBy: 'entraineurBoxeur')]
    private Collection $entraineurs;

    #[ORM\Column]
    private ?\DateTimeImmutable $boxeurDateNaissance = null;

    public function __construct()
    {
        $this->boxeurCategorie = new ArrayCollection();
        $this->boxeurTypeBoxe = new ArrayCollection();
        $this->entraineurs = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPoids(): ?float
    {
        return $this->poids;
    }

    public function setPoids(float $poids): static
    {
        $this->poids = $poids;

        return $this;
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

    public function getBoxeurPrenom(): ?string
    {
        return $this->boxeurPrenom;
    }

    public function setBoxeurPrenom(string $boxeurPrenom): static
    {
        $this->boxeurPrenom = $boxeurPrenom;

        return $this;
    }

    /**
     * @return Collection<int, categorie>
     */
    public function getBoxeurCategorie(): Collection
    {
        return $this->boxeurCategorie;
    }

    public function addBoxeurCategorie(categorie $boxeurCategorie): static
    {
        if (!$this->boxeurCategorie->contains($boxeurCategorie)) {
            $this->boxeurCategorie->add($boxeurCategorie);
            $boxeurCategorie->setBoxeur($this);
        }

        return $this;
    }

    public function removeBoxeurCategorie(categorie $boxeurCategorie): static
    {
        if ($this->boxeurCategorie->removeElement($boxeurCategorie)) {
            // set the owning side to null (unless already changed)
            if ($boxeurCategorie->getBoxeur() === $this) {
                $boxeurCategorie->setBoxeur(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, boxeType>
     */
    public function getBoxeurTypeBoxe(): Collection
    {
        return $this->boxeurTypeBoxe;
    }

    public function addBoxeurTypeBoxe(boxeType $boxeurTypeBoxe): static
    {
        if (!$this->boxeurTypeBoxe->contains($boxeurTypeBoxe)) {
            $this->boxeurTypeBoxe->add($boxeurTypeBoxe);
            $boxeurTypeBoxe->setBoxeur($this);
        }

        return $this;
    }

    public function removeBoxeurTypeBoxe(boxeType $boxeurTypeBoxe): static
    {
        if ($this->boxeurTypeBoxe->removeElement($boxeurTypeBoxe)) {
            // set the owning side to null (unless already changed)
            if ($boxeurTypeBoxe->getBoxeur() === $this) {
                $boxeurTypeBoxe->setBoxeur(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Entraineur>
     */
    public function getEntraineurs(): Collection
    {
        return $this->entraineurs;
    }

    public function addEntraineur(Entraineur $entraineur): static
    {
        if (!$this->entraineurs->contains($entraineur)) {
            $this->entraineurs->add($entraineur);
            $entraineur->addEntraineurBoxeur($this);
        }

        return $this;
    }

    public function removeEntraineur(Entraineur $entraineur): static
    {
        if ($this->entraineurs->removeElement($entraineur)) {
            $entraineur->removeEntraineurBoxeur($this);
        }

        return $this;
    }

    public function getBoxeurDateNaissance(): ?\DateTimeImmutable
    {
        return $this->boxeurDateNaissance;
    }

    public function setBoxeurDateNaissance(\DateTimeImmutable $boxeurDateNaissance): static
    {
        $this->boxeurDateNaissance = $boxeurDateNaissance;

        return $this;
    }
}
