<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

/**
 * Corps de POST /api/me/messages (message d'un membre au club)
 */
final class MessageRequest
{
    public function __construct(
        #[Assert\NotBlank(message: 'Le sujet est obligatoire.')]
        #[Assert\Length(max: 180, maxMessage: 'Le sujet ne peut dépasser {{ limit }} caractères.')]
        public readonly string $subject = '',

        #[Assert\NotBlank(message: 'Le message est obligatoire.')]
        #[Assert\Length(max: 5000, maxMessage: 'Le message ne peut dépasser {{ limit }} caractères.')]
        public readonly string $body = '',
    ) {
    }
}
