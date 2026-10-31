<?php

namespace App\Enum;

/**
 * Type d'événement.
 */
enum GalaType: string
{
    use EnumChoices;

    case Gala = 'gala';
    case Competition = 'competition';
    case Stage = 'stage';
    case PortesOuvertes = 'portes-ouvertes';

    public function label(): string
    {
        return match ($this) {
            self::Gala => 'Gala',
            self::Competition => 'Compétition',
            self::Stage => 'Stage',
            self::PortesOuvertes => 'Portes ouvertes',
        };
    }
}
