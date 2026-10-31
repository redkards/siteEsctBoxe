<?php

namespace App\Controller\Api;

use App\Content\ClubInfo;
use App\Repository\BoxerRepository;
use App\Repository\CoachRepository;
use App\Repository\MembershipRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Présentation du club : constantes de ClubInfo et compteurs calculés.
 */
class ClubController extends AbstractController
{
    use PublicCache;

    #[Route('/api/club', name: 'api_club', methods: ['GET'])]
    public function show(MembershipRepository $memberships, BoxerRepository $boxers, CoachRepository $coaches): Response
    {
        return $this->publicCache($this->json([
            'name' => ClubInfo::NAME,
            'tagline' => ClubInfo::TAGLINE,
            'foundedYear' => ClubInfo::FOUNDED_YEAR,
            'stats' => [
                // Adhésions validées pour la saison en cours
                'members' => $memberships->countValidated(ClubInfo::currentSeason()),
                'boxers' => $boxers->countActive(),
                'coaches' => $coaches->count([]),
                'titles' => ClubInfo::TITLES,
            ],
            'address' => ClubInfo::ADDRESS,
            'phone' => ClubInfo::PHONE,
            'email' => ClubInfo::EMAIL,
            'openingHours' => ClubInfo::OPENING_HOURS,
            'socials' => ClubInfo::SOCIALS,
        ]));
    }
}
