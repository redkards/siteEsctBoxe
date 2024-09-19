<?php

namespace App\Entity;

use App\Repository\BoxeTypeRepository;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: BoxeTypeRepository::class)]
class BoxeType
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[groups(['getBoxeTypes'])]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 150)]
    #[groups(['getBoxeTypes'])]
    private ?string $typeBoxeNom = null;

    #[ORM\ManyToOne(inversedBy: 'boxeurTypeBoxe')]
    #[groups(['getBoxeurs'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?Boxeur $boxeur = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTypeBoxeNom(): ?string
    {
        return $this->typeBoxeNom;
    }

    public function setTypeBoxeNom(string $typeBoxeNom): static
    {
        $this->typeBoxeNom = $typeBoxeNom;

        return $this;
    }

    public function getBoxeur(): ?Boxeur
    {
        return $this->boxeur;
    }

    public function setBoxeur(?Boxeur $boxeur): static
    {
        $this->boxeur = $boxeur;

        return $this;
    }
}
