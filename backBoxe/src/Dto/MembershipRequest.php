<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Context\ExecutionContextInterface;

/**
 * Corps de POST /api/memberships (demande d'inscription, visiteur ou membre connecté).
 * discipline et pricing sont des identifiants (voir GET /api/disciplines et GET /api/pricing).
 */
final class MembershipRequest
{
    public function __construct(
        #[Assert\NotBlank(message: 'Le prénom est obligatoire.')]
        #[Assert\Length(max: 80)]
        public readonly string $firstName = '',

        #[Assert\NotBlank(message: 'Le nom est obligatoire.')]
        #[Assert\Length(max: 80)]
        public readonly string $lastName = '',

        #[Assert\NotBlank(message: "L'email est obligatoire.")]
        #[Assert\Email(message: "L'adresse email n'est pas valide.")]
        #[Assert\Length(max: 180)]
        public readonly string $email = '',

        #[Assert\Length(max: 20)]
        #[Assert\Regex(pattern: '/^[0-9+ .()-]*$/', message: "Le numéro de téléphone n'est pas valide.")]
        public readonly ?string $phone = null,

        #[Assert\NotBlank(message: 'La date de naissance est obligatoire.')]
        #[Assert\Date(message: 'La date de naissance doit être au format AAAA-MM-JJ.')]
        #[Assert\LessThan('today', message: 'La date de naissance doit être dans le passé.')]
        #[Assert\GreaterThan('-100 years', message: "La date de naissance n'est pas valide.")]
        public readonly string $birthDate = '',

        #[Assert\NotBlank(message: 'Choisissez une discipline.')]
        #[Assert\Positive(message: 'Choisissez une discipline.')]
        public readonly ?int $discipline = null,

        #[Assert\Positive]
        public readonly ?int $pricing = null,

        /**
         * Par défaut : saison en cours (ClubInfo::currentSeason())
         */
        #[Assert\Regex(pattern: '/^\d{4}-\d{4}$/', message: 'Saison au format 2026-2027.')]
        public readonly ?string $season = null,

        #[Assert\Length(max: 160)]
        public readonly ?string $legalGuardian = null,

        public readonly bool $medicalCertificate = false,

        #[Assert\Length(max: 2000, maxMessage: 'Le message ne peut dépasser {{ limit }} caractères.')]
        public readonly ?string $message = null,

        #[Assert\IsTrue(message: 'Vous devez accepter le traitement de vos données pour l’inscription.')]
        public readonly bool $consent = false,
    ) {
    }

    public function birthDate(): ?\DateTimeImmutable
    {
        return \DateTimeImmutable::createFromFormat('!Y-m-d', $this->birthDate) ?: null;
    }

    #[Assert\Callback]
    public function validateGuardian(ExecutionContextInterface $context): void
    {
        $birthDate = $this->birthDate();
        if ($birthDate && $birthDate > new \DateTimeImmutable('-18 years') && '' === trim((string) $this->legalGuardian)) {
            $context->buildViolation('Pour un mineur, indiquez le nom du représentant légal.')
                ->atPath('legalGuardian')
                ->addViolation();
        }
    }
}
