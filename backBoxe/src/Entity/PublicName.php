<?php

namespace App\Entity;

/**
 * Identité publique d'un compte ({firstName, lastName}), jamais son email.
 * Un compte anonymisé (RGPD) n'est plus présenté.
 */
final class PublicName
{
    /**
     * @return array{firstName: ?string, lastName: ?string}|null
     */
    public static function of(?User $user): ?array
    {
        if (!$user || $user->isAnonymized()) {
            return null;
        }

        return ['firstName' => $user->getFirstName(), 'lastName' => $user->getLastName()];
    }
}
