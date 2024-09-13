<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[group(['getUser'])]
    #[ORM\Column]
    private ?int $id = null;

    #[group(['getUser'])]
    #[ORM\Column(length: 180)]
    private ?string $email = null;

    /**
     * @var list<string> The user roles
     */
    #[group(['getUser'])]
    #[ORM\Column]
    private array $roles = [];

    private ?string $plainPassword = null;

    /**
     * @var string The hashed password
     */
    #[group(['getUser'])]
    #[ORM\Column]
    private ?string $password = null;

    #[group(['getUser'])]
    #[ORM\Column(length: 120)]
    private ?string $nom = null;

    #[group(['getUser'])]
    #[ORM\Column(length: 120)]
    private ?string $prenom = null;

    #[group(['getUser'])]
    #[ORM\Column(length: 50)]
    private ?string $tel = null;

    #[group(['getUser'])]
    #[ORM\Column]
    private ?\DateTimeImmutable $dateNaissance = null;

    /**
     * @var Collection<int, adresse>
     */
    #[ORM\OneToMany(targetEntity: adresse::class, mappedBy: 'user', orphanRemoval: true)]
    #[group(['getUser'])]
    private Collection $userAdresse;

    #[ORM\ManyToOne(inversedBy: 'messagerieUser')]
    #[group(['getUser'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?Messagerie $messagerie = null;

    public function __construct()
    {
        $this->userAdresse = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     *
     * @return list<string>
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;

        return $this;
    }

    public function getPrenom(): ?string
    {
        return $this->prenom;
    }

    public function setPrenom(string $prenom): static
    {
        $this->prenom = $prenom;

        return $this;
    }

    public function getTel(): ?string
    {
        return $this->tel;
    }

    public function setTel(string $tel): static
    {
        $this->tel = $tel;

        return $this;
    }

    public function getDateNaissance(): ?\DateTimeImmutable
    {
        return $this->dateNaissance;
    }

    public function setDateNaissance(\DateTimeImmutable $dateNaissance): static
    {
        $this->dateNaissance = $dateNaissance;

        return $this;
    }

    /**
     * @return Collection<int, adresse>
     */
    public function getUserAdresse(): Collection
    {
        return $this->userAdresse;
    }

    public function addUserAdresse(adresse $userAdresse): static
    {
        if (!$this->userAdresse->contains($userAdresse)) {
            $this->userAdresse->add($userAdresse);
            $userAdresse->setUser($this);
        }

        return $this;
    }

    public function removeUserAdresse(adresse $userAdresse): static
    {
        if ($this->userAdresse->removeElement($userAdresse)) {
            // set the owning side to null (unless already changed)
            if ($userAdresse->getUser() === $this) {
                $userAdresse->setUser(null);
            }
        }

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

    /**
     * Get the value of plainPassword
     */
    public function getPlainPassword()
    {
        return $this->plainPassword;
    }

    /**
     * Set the value of plainPassword
     *
     * @return self
     */

    public function setPlainPassword($plainPassword)
    {
        $this->plainPassword = $plainPassword;

        return $this;
    }

}
