<?php

namespace App\Controller\Api;

use App\Repository\CoachRepository;
use App\Repository\DisciplineRepository;
use App\Repository\TrainingSlotRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

#[Route('/api/disciplines')]
class DisciplineController extends AbstractController
{
    use PublicCache;

    public function __construct(private readonly DisciplineRepository $disciplines)
    {
    }

    #[Route('', name: 'api_disciplines', methods: ['GET'])]
    public function list(): Response
    {
        return $this->publicCache($this->json($this->disciplines->findAllOrdered(), context: ['groups' => ['discipline:list']]));
    }

    /**
     * Détail d'une discipline, avec ses créneaux du planning et ses coachs
     */
    #[Route('/{slug}', name: 'api_discipline_show', requirements: ['slug' => '[a-z0-9-]+'], methods: ['GET'])]
    public function show(string $slug, TrainingSlotRepository $slots, CoachRepository $coaches, NormalizerInterface $normalizer): Response
    {
        $discipline = $this->disciplines->findOneBy(['slug' => $slug]);
        if (!$discipline) {
            return $this->json(['message' => 'Discipline introuvable.'], Response::HTTP_NOT_FOUND);
        }

        $data = $normalizer->normalize($discipline, 'json', ['groups' => ['discipline:read']]);
        $data['slots'] = $normalizer->normalize($slots->findPlanning($discipline), 'json', ['groups' => PlanningController::GROUPS]);
        $data['coaches'] = $normalizer->normalize($coaches->findAllOrdered($discipline), 'json', ['groups' => CoachController::GROUPS]);

        return $this->publicCache($this->json($data));
    }
}
