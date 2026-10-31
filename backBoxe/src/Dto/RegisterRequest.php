<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

/**
 * Corps de POST /api/register.
 * Minimisation RGPD : téléphone et date de naissance sont facultatifs.
 */
final class RegisterRequest
{
    public function __construct(
        #[Assert\NotBlank(message: 'Le prénom est obligatoire.')]
        #[Assert\Length(max: 80, maxMessage: 'Le prénom ne peut dépasser {{ limit }} caractères.')]
        public readonly string $firstName = '',

        #[Assert\NotBlank(message: 'Le nom est obligatoire.')]
        #[Assert\Length(max: 80, maxMessage: 'Le nom ne peut dépasser {{ limit }} caractères.')]
        public readonly string $lastName = '',

        #[Assert\NotBlank(message: "L'email est obligatoire.")]
        #[Assert\Email(message: "L'adresse email n'est pas valide.")]
        #[Assert\Length(max: 180)]
        public readonly string $email = '',

        #[Assert\NotBlank(message: 'Le mot de passe est obligatoire.')]
        #[Assert\Length(min: 8, max: 4096, minMessage: 'Le mot de passe doit contenir au moins {{ limit }} caractères.')]
        #[Assert\PasswordStrength(minScore: Assert\PasswordStrength::STRENGTH_MEDIUM, message: 'Le mot de passe est trop faible : mélangez majuscules, minuscules, chiffres et symboles.')]
        public readonly string $password = '',

        #[Assert\Length(max: 20, maxMessage: 'Le téléphone ne peut dépasser {{ limit }} caractères.')]
        #[Assert\Regex(pattern: '/^[0-9+ .()-]*$/', message: "Le numéro de téléphone n'est pas valide.")]
        public readonly ?string $phone = null,

        #[Assert\Date(message: 'La date de naissance doit être au format AAAA-MM-JJ.')]
        #[Assert\LessThan('today', message: 'La date de naissance doit être dans le passé.')]
        public readonly ?string $birthDate = null,

        /**
         * Case non pré-cochée côté front : doit être explicitement true
         */
        #[Assert\IsTrue(message: 'Vous devez accepter les CGU et la Politique de Confidentialité.')]
        public readonly bool $acceptCgu = false,
    ) {
    }
}
