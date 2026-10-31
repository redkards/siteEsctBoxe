<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

/**
 * Corps de POST /api/contact
 */
final class ContactRequest
{
    public function __construct(
        #[Assert\NotBlank(message: 'Le nom est obligatoire.')]
        #[Assert\Length(max: 120)]
        public readonly string $name = '',

        #[Assert\NotBlank(message: "L'email est obligatoire.")]
        #[Assert\Email(message: "L'adresse email n'est pas valide.")]
        #[Assert\Length(max: 180)]
        public readonly string $email = '',

        #[Assert\NotBlank(message: 'Le sujet est obligatoire.')]
        #[Assert\Length(max: 180, maxMessage: 'Le sujet ne peut dépasser {{ limit }} caractères.')]
        public readonly string $subject = '',

        #[Assert\NotBlank(message: 'Le message est obligatoire.')]
        #[Assert\Length(min: 10, max: 5000, minMessage: 'Le message doit contenir au moins {{ limit }} caractères.', maxMessage: 'Le message ne peut dépasser {{ limit }} caractères.')]
        public readonly string $message = '',
    ) {
    }
}
