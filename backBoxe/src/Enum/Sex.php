<?php

namespace App\Enum;

/**
 * Sexe sportif (catégories de compétition).
 */
enum Sex: string
{
    use EnumChoices;

    case M = 'M';
    case F = 'F';

    public function label(): string
    {
        return match ($this) {
            self::M => 'Masculin',
            self::F => 'Féminin',
        };
    }
}
