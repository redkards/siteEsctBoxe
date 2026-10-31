<?php

namespace App\Enum;

/**
 * Statut de modération d'un commentaire.
 */
enum CommentStatus: string
{
    use EnumChoices;

    case EnAttente = 'en_attente';
    case Publie = 'publie';
    case Rejete = 'rejete';

    public function label(): string
    {
        return match ($this) {
            self::EnAttente => 'En attente',
            self::Publie => 'Publié',
            self::Rejete => 'Rejeté',
        };
    }
}
