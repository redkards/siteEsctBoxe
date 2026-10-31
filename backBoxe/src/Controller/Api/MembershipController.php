<?php

namespace App\Controller\Api;

use App\Content\ClubInfo;
use App\Dto\MembershipRequest;
use App\Entity\Membership;
use App\Entity\User;
use App\Repository\DisciplineRepository;
use App\Repository\MembershipRepository;
use App\Repository\PricingRepository;
use App\Service\MailService;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\RateLimiter\RateLimiterFactoryInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Security\Http\Attribute\IsGranted;

/**
 * Inscriptions en ligne : dépôt public (ou connecté), suivi depuis l'espace membre.
 */
#[Route('/api')]
class MembershipController extends AbstractController
{
    use PublicCache;

    public const ME_GROUPS = ['membership:me', 'discipline:ref', 'pricing:ref'];

    #[Route('/memberships', name: 'api_membership_create', methods: ['POST'])]
    public function create(
        #[MapRequestPayload] MembershipRequest $payload,
        Request $request,
        DisciplineRepository $disciplines,
        PricingRepository $pricings,
        EntityManagerInterface $em,
        MailService $mail,
        LoggerInterface $logger,
        RateLimiterFactoryInterface $membershipLimiter,
    ): Response {
        if (!$membershipLimiter->create($request->getClientIp())->consume()->isAccepted()) {
            return $this->json(['message' => 'Trop de demandes, réessayez dans quelques minutes.'], Response::HTTP_TOO_MANY_REQUESTS);
        }

        $discipline = $disciplines->find((int) $payload->discipline);
        if (!$discipline) {
            return $this->violation('discipline', 'Cette discipline n’existe pas.');
        }
        $pricing = null;
        if (null !== $payload->pricing && !$pricing = $pricings->find($payload->pricing)) {
            return $this->violation('pricing', 'Ce tarif n’existe pas.');
        }

        $user = $this->getUser();
        $membership = (new Membership())
            ->setUser($user instanceof User ? $user : null)
            ->setFirstName(trim($payload->firstName))
            ->setLastName(trim($payload->lastName))
            ->setEmail(mb_strtolower(trim($payload->email)))
            ->setPhone($payload->phone ? trim($payload->phone) : null)
            ->setBirthDate($payload->birthDate())
            ->setDiscipline($discipline)
            ->setPricing($pricing)
            ->setSeason($payload->season ?? ClubInfo::currentSeason())
            ->setLegalGuardian($payload->legalGuardian ? trim($payload->legalGuardian) : null)
            ->setMedicalCertificate($payload->medicalCertificate)
            ->setMessage($payload->message ? trim($payload->message) : null)
            ->setConsentAt(new \DateTimeImmutable());

        $em->persist($membership);
        $em->flush();

        try {
            $mail->sendMembershipAcknowledgement($membership);
            $mail->sendMembershipNotification($membership, $this->generateUrl('admin', [], UrlGeneratorInterface::ABSOLUTE_URL));
        } catch (TransportExceptionInterface $e) {
            // La demande est enregistrée et visible dans le back-office : l'échec d'envoi ne la bloque pas
            $logger->error('Echec email d\'inscription', ['membershipId' => $membership->getId(), 'error' => $e->getMessage()]);
        }

        return $this->json(['id' => $membership->getId(), 'status' => $membership->getStatus()->value], Response::HTTP_CREATED);
    }

    #[Route('/me/memberships', name: 'api_me_memberships', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function mine(#[CurrentUser] User $user, MembershipRepository $memberships): Response
    {
        return $this->noStore($this->json($memberships->findForUser($user), context: ['groups' => self::ME_GROUPS]));
    }

    /**
     * Même format que les erreurs de validation de MapRequestPayload
     */
    private function violation(string $path, string $title): Response
    {
        return $this->json([
            'title' => 'Validation Failed',
            'detail' => $path.': '.$title,
            'violations' => [['propertyPath' => $path, 'title' => $title]],
        ], Response::HTTP_UNPROCESSABLE_ENTITY);
    }
}
