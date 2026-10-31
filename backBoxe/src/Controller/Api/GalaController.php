<?php

namespace App\Controller\Api;

use App\Enum\GalaType;
use App\Repository\FightRepository;
use App\Repository\GalaRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

/**
 * Événements du club (galas, compétitions, stages, portes ouvertes) publiés
 */
#[Route('/api/galas')]
class GalaController extends AbstractController
{
    use PublicCache;

    public function __construct(private readonly GalaRepository $galas)
    {
    }

    /**
     * Filtres : ?when=upcoming|past&type=gala|competition|stage|portes-ouvertes
     */
    #[Route('', name: 'api_galas', methods: ['GET'])]
    public function list(
        #[MapQueryParameter] int $page = 1,
        #[MapQueryParameter] int $limit = 10,
        #[MapQueryParameter] ?string $when = null,
        #[MapQueryParameter] ?string $type = null,
    ): Response {
        $page = Paginated::clampPage($page);
        $limit = Paginated::clampLimit($limit);

        if ($when && !\in_array($when, [GalaRepository::UPCOMING, GalaRepository::PAST], true)) {
            return $this->json(['message' => 'Période inconnue (upcoming ou past).'], Response::HTTP_BAD_REQUEST);
        }
        $typeEnum = $type ? GalaType::tryFrom($type) : null;
        if ($type && !$typeEnum) {
            return $this->json(['message' => "Type d'événement inconnu (".implode(', ', GalaType::values()).').'], Response::HTTP_BAD_REQUEST);
        }

        $result = $this->galas->findPublishedPage($page, $limit, $when, $typeEnum);

        return $this->publicCache($this->json(Paginated::from($result, $page, $limit), context: ['groups' => ['gala:list']]));
    }

    /**
     * Détail, avec les combats des boxeurs du club lors de cet événement
     */
    #[Route('/{slug}', name: 'api_gala_show', requirements: ['slug' => '[a-z0-9-]+'], methods: ['GET'])]
    public function show(string $slug, FightRepository $fights, NormalizerInterface $normalizer): Response
    {
        $gala = $this->galas->findOnePublishedBySlug($slug);
        if (!$gala) {
            return $this->json(['message' => 'Événement introuvable.'], Response::HTTP_NOT_FOUND);
        }

        $data = $normalizer->normalize($gala, 'json', ['groups' => ['gala:read']]);
        $data['fights'] = $normalizer->normalize($fights->findForEvent($gala), 'json', ['groups' => ['fight:read', 'fight:boxer', 'boxer:ref']]);

        return $this->publicCache($this->json($data));
    }
}
