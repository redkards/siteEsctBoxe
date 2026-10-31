<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

/**
 * Corps de POST /api/articles/{slug}/comments
 */
final class CommentRequest
{
    public function __construct(
        #[Assert\NotBlank(message: 'Le commentaire est vide.')]
        #[Assert\Length(min: 2, max: 2000, minMessage: 'Le commentaire doit contenir au moins {{ limit }} caractères.', maxMessage: 'Le commentaire ne peut dépasser {{ limit }} caractères.')]
        public readonly string $body = '',
    ) {
    }
}
