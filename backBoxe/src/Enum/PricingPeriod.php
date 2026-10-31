<?php

namespace App\Enum;

/**
 * Périodicité d'un tarif.
 */
enum PricingPeriod: string
{
    use EnumChoices;

    case Saison = 'saison';
    case Mois = 'mois';
    case Seance = 'seance';

    public function label(): string
    {
        return match ($this) {
            self::Saison => 'Saison',
            self::Mois => 'Mois',
            self::Seance => 'Séance',
        };
    }
}
