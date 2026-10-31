<?php

namespace App\Enum;

/**
 * Mode de décision d'un combat.
 */
enum FightMethod: string
{
    use EnumChoices;

    case Points = 'points';
    case Ko = 'ko';
    case Tko = 'tko';
    case Abandon = 'abandon';
    case Disqualification = 'disqualification';

    public function label(): string
    {
        return match ($this) {
            self::Points => 'Aux points',
            self::Ko => 'KO',
            self::Tko => "Arrêt de l'arbitre (TKO)",
            self::Abandon => 'Abandon',
            self::Disqualification => 'Disqualification',
        };
    }
}
