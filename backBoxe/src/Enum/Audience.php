<?php

namespace App\Enum;

/**
 * Public visé (créneau d'entraînement, tarif).
 */
enum Audience: string
{
    use EnumChoices;

    case Enfants = 'enfants';
    case Ados = 'ados';
    case Adultes = 'adultes';
    case Competiteurs = 'competiteurs';
    case Feminin = 'feminin';
    case Tous = 'tous';

    public function label(): string
    {
        return match ($this) {
            self::Enfants => 'Enfants',
            self::Ados => 'Adolescents',
            self::Adultes => 'Adultes',
            self::Competiteurs => 'Compétiteurs',
            self::Feminin => 'Féminin',
            self::Tous => 'Tous publics',
        };
    }
}
