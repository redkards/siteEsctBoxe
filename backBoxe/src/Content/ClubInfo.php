<?php

namespace App\Content;

/**
 * Informations fixes du club, servies par GET /api/club (avec des compteurs calculés).
 * Les valeurs marquées TODO sont à confirmer par le bureau du club avant la mise en ligne.
 */
final class ClubInfo
{
    public const NAME = 'ESC Boxe Tergnier';
    public const SHORT_NAME = 'ESCT Boxe';
    public const TAGLINE = 'Boxe anglaise, éducative, loisir et féminine à Tergnier, dans l’Aisne.';

    // TODO à confirmer : année de fondation de la section boxe de l'ESC Tergnier
    public const FOUNDED_YEAR = 1982;

    // TODO à confirmer : adresse postale du club (siège / salle principale)
    public const ADDRESS = 'Complexe sportif, 02700 Tergnier';
    public const POSTAL_CODE = '02700';
    public const CITY = 'Tergnier';
    public const DEPARTMENT = 'Aisne';

    // TODO à confirmer : téléphone et adresse email publics du club
    public const PHONE = null;
    public const EMAIL = 'contact@esctboxe.local';

    // TODO à confirmer : horaires d'ouverture de l'accueil / de la salle
    public const OPENING_HOURS = "Du lundi au vendredi de 17 h 30 à 21 h, le samedi de 10 h à 12 h (hors vacances scolaires : voir le planning).";

    /**
     * Réseaux sociaux : à renseigner quand les comptes officiels seront communiqués
     *
     * @var array{facebook: ?string, instagram: ?string, youtube: ?string}
     */
    public const SOCIALS = ['facebook' => null, 'instagram' => null, 'youtube' => null];

    /**
     * TODO à confirmer : nombre de titres (champion·ne·s départementaux, régionaux, nationaux) remportés par le club
     */
    public const TITLES = 25;

    /**
     * Une saison sportive commence en septembre : « 2026-2027 » du 1er septembre 2026 au 31 août 2027.
     */
    public static function currentSeason(?\DateTimeInterface $today = null): string
    {
        $start = self::seasonStartYear($today);

        return sprintf('%d-%d', $start, $start + 1);
    }

    public static function seasonStartYear(?\DateTimeInterface $today = null): int
    {
        $today ??= new \DateTimeImmutable();
        $year = (int) $today->format('Y');

        return (int) $today->format('n') >= 9 ? $year : $year - 1;
    }
}
