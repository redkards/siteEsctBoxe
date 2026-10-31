<?php

namespace App\Enum;

/**
 * Rubrique d'une actualité.
 */
enum ArticleCategory: string
{
    use EnumChoices;

    case Club = 'club';
    case Competition = 'competition';
    case Gala = 'gala';
    case Stage = 'stage';
    case VieDuClub = 'vie-du-club';

    public function label(): string
    {
        return match ($this) {
            self::Club => 'Club',
            self::Competition => 'Compétition',
            self::Gala => 'Gala',
            self::Stage => 'Stage',
            self::VieDuClub => 'Vie du club',
        };
    }
}
