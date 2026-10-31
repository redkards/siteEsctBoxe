<?php

namespace App\Content;

/**
 * Catégorie d'âge sportive, calculée sur l'année de début de la saison en cours
 * (barème indicatif inspiré de la boxe amateur FFBoxe, à ajuster si le règlement évolue).
 */
final class AgeCategory
{
    /**
     * Âge maximal atteint dans l'année => catégorie
     */
    private const CATEGORIES = [
        10 => 'Poussin',
        12 => 'Benjamin',
        14 => 'Minime',
        16 => 'Cadet',
        18 => 'Junior',
        40 => 'Senior',
    ];

    public static function of(?\DateTimeInterface $birthDate, ?\DateTimeInterface $today = null): ?string
    {
        if (null === $birthDate) {
            return null;
        }

        $age = ClubInfo::seasonStartYear($today) - (int) $birthDate->format('Y');
        foreach (self::CATEGORIES as $max => $label) {
            if ($age <= $max) {
                return $label;
            }
        }

        return 'Vétéran';
    }
}
