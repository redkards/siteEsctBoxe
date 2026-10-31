<?php

namespace App\Controller\Api;

use App\Enum\BoxerLevel;
use App\Enum\Sex;
use App\Repository\BoxerRepository;
use App\Repository\FightRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

/**
 * Boxeurs actifs et palmarès. RGPD : la date de naissance n'est jamais exposée (catégorie d'âge seulement).
 */
#[Route('/api/boxers')]
class BoxerController extends AbstractController
{
    use PublicCache;

    public const LIST_GROUPS = ['boxer:list', 'discipline:ref'];

    public function __construct(private readonly BoxerRepository $boxers)
    {
    }

    /**
     * Filtres : ?discipline=<slug>&level=educatif|amateur|elite|pro&sex=M|F&q=<texte>
     */
    #[Route('', name: 'api_boxers', methods: ['GET'])]
    public function list(
        #[MapQueryParameter] int $page = 1,
        #[MapQueryParameter] int $limit = 12,
        #[MapQueryParameter] ?string $discipline = null,
        #[MapQueryParameter] ?string $level = null,
        #[MapQueryParameter] ?string $sex = null,
        #[MapQueryParameter] ?string $q = null,
    ): Response {
        $page = Paginated::clampPage($page);
        $limit = Paginated::clampLimit($limit);

        $levelEnum = $level ? BoxerLevel::tryFrom($level) : null;
        if ($level && !$levelEnum) {
            return $this->json(['message' => 'Niveau inconnu ('.implode(', ', BoxerLevel::values()).').'], Response::HTTP_BAD_REQUEST);
        }
        $sexEnum = $sex ? Sex::tryFrom(strtoupper($sex)) : null;
        if ($sex && !$sexEnum) {
            return $this->json(['message' => 'Sexe inconnu (M ou F).'], Response::HTTP_BAD_REQUEST);
        }
        if (null !== $q && mb_strlen($q) > 100) {
            return $this->json(['message' => 'Recherche trop longue (100 caractères maximum).'], Response::HTTP_BAD_REQUEST);
        }

        $result = $this->boxers->findActivePage($page, $limit, $discipline, $levelEnum, $sexEnum, $q);

        return $this->publicCache($this->json(Paginated::from($result, $page, $limit), context: ['groups' => self::LIST_GROUPS]));
    }

    #[Route('/featured', name: 'api_boxers_featured', methods: ['GET'], priority: 1)]
    public function featured(): Response
    {
        return $this->publicCache($this->json($this->boxers->findFeatured(), context: ['groups' => self::LIST_GROUPS]));
    }

    /**
     * Fiche : bio, bilan {wins, losses, draws, kos} et combats du plus récent au plus ancien
     */
    #[Route('/{slug}', name: 'api_boxer_show', requirements: ['slug' => '[a-z0-9-]+'], methods: ['GET'])]
    public function show(string $slug, FightRepository $fights, NormalizerInterface $normalizer): Response
    {
        $boxer = $this->boxers->findOneActiveBySlug($slug);
        if (!$boxer) {
            return $this->json(['message' => 'Boxeur introuvable.'], Response::HTTP_NOT_FOUND);
        }

        $data = $normalizer->normalize($boxer, 'json', ['groups' => ['boxer:read', 'discipline:ref']]);
        $data['fights'] = $normalizer->normalize($fights->findForBoxer($boxer), 'json', ['groups' => ['fight:read', 'fight:event', 'gala:ref']]);

        return $this->publicCache($this->json($data));
    }
}
