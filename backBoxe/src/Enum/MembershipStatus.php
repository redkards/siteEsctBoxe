<?php

namespace App\Enum;

/**
 * Statut d'une demande d'inscription.
 */
enum MembershipStatus: string
{
    use EnumChoices;

    case EnAttente = 'en_attente';
    case Validee = 'validee';
    case Refusee = 'refusee';

    public function label(): string
    {
        return match ($this) {
            self::EnAttente => 'En attente',
            self::Validee => 'Validée',
            self::Refusee => 'Refusée',
        };
    }
}
