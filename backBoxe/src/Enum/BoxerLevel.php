<?php

namespace App\Enum;

/**
 * Niveau de pratique d'un boxeur.
 */
enum BoxerLevel: string
{
    use EnumChoices;

    case Educatif = 'educatif';
    case Amateur = 'amateur';
    case Elite = 'elite';
    case Pro = 'pro';

    public function label(): string
    {
        return match ($this) {
            self::Educatif => 'Éducatif',
            self::Amateur => 'Amateur',
            self::Elite => 'Élite',
            self::Pro => 'Professionnel',
        };
    }
}
