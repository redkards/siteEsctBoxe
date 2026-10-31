<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

/**
 * Corps de PATCH /api/me : remplace les informations de profil (prénom, nom, téléphone, date de naissance).
 * Un champ facultatif absent ou null est effacé.
 */
final class ProfileUpdateRequest
{
    public function __construct(
        #[Assert\NotBlank(message: 'Le prénom est obligatoire.')]
        #[Assert\Length(max: 80, maxMessage: 'Le prénom ne peut dépasser {{ limit }} caractères.')]
        public readonly string $firstName = '',

        #[Assert\NotBlank(message: 'Le nom est obligatoire.')]
        #[Assert\Length(max: 80, maxMessage: 'Le nom ne peut dépasser {{ limit }} caractères.')]
        public readonly string $lastName = '',

        #[Assert\Length(max: 20, maxMessage: 'Le téléphone ne peut dépasser {{ limit }} caractères.')]
        #[Assert\Regex(pattern: '/^[0-9+ .()-]*$/', message: "Le numéro de téléphone n'est pas valide.")]
        public readonly ?string $phone = null,

        #[Assert\Date(message: 'La date de naissance doit être au format AAAA-MM-JJ.')]
        #[Assert\LessThan('today', message: 'La date de naissance doit être dans le passé.')]
        public readonly ?string $birthDate = null,
    ) {
    }
}
