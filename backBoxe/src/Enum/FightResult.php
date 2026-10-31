<?php

namespace App\Enum;

/**
 * Issue d'un combat, du point de vue du boxeur du club.
 */
enum FightResult: string
{
    use EnumChoices;

    case Victoire = 'victoire';
    case Defaite = 'defaite';
    case Nul = 'nul';

    public function label(): string
    {
        return match ($this) {
            self::Victoire => 'Victoire',
            self::Defaite => 'Défaite',
            self::Nul => 'Match nul',
        };
    }
}
