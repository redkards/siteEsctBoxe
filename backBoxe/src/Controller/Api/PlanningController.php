<?php

namespace App\Controller\Api;

use App\Repository\DisciplineRepository;
use App\Repository\TrainingSlotRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Planning hebdomadaire des entraînements
 */
class PlanningController extends AbstractController
{
    use PublicCache;

    /**
     * Créneau : discipline {name, slug}, coach {firstName, lastName}, venue {name, city}
     */
    public const GROUPS = ['slot:read', 'discipline:ref', 'coach:ref', 'venue:ref'];

    /**
     * Filtre facultatif : ?discipline=<slug>
     */
    #[Route('/api/planning', name: 'api_planning', methods: ['GET'])]
    public function list(TrainingSlotRepository $slots, DisciplineRepository $disciplines, #[MapQueryParameter] ?string $discipline = null): Response
    {
        $filter = null;
        if ($discipline) {
            $filter = $disciplines->findOneBy(['slug' => $discipline]);
            if (!$filter) {
                return $this->json(['message' => 'Discipline introuvable.'], Response::HTTP_NOT_FOUND);
            }
        }

        return $this->publicCache($this->json($slots->findPlanning($filter), context: ['groups' => self::GROUPS]));
    }
}
