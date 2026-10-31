<?php

namespace App\Controller\Admin;

use App\Repository\ArticleRepository;
use App\Repository\BoxerRepository;
use App\Repository\CommentRepository;
use App\Repository\ContactMessageRepository;
use App\Repository\GalaRepository;
use App\Repository\MembershipRepository;
use App\Repository\MessageRepository;
use EasyCorp\Bundle\EasyAdminBundle\Attribute\AdminDashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\Dashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\MenuItem;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractDashboardController;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\Response;

#[AdminDashboard(routePath: '/admin', routeName: 'admin')]
class DashboardController extends AbstractDashboardController
{
    public const TITLE = 'ESCT Boxe — Administration';

    public function __construct(
        private readonly MembershipRepository $memberships,
        private readonly MessageRepository $messages,
        private readonly ContactMessageRepository $contacts,
        private readonly CommentRepository $comments,
        private readonly BoxerRepository $boxers,
        private readonly GalaRepository $galas,
        private readonly ArticleRepository $articles,
        #[Autowire(env: 'FRONTEND_URL')]
        private readonly string $frontendUrl,
    ) {
    }

    public function index(): Response
    {
        return $this->render('admin/dashboard.html.twig', [
            // À traiter (mis en avant)
            'todo' => [
                ['label' => 'Inscriptions en attente', 'value' => $this->memberships->countPending(), 'controller' => MembershipCrudController::class, 'icon' => 'fa fa-id-card'],
                ['label' => 'Messages non lus', 'value' => $this->messages->countUnreadToClub(), 'controller' => MessageCrudController::class, 'icon' => 'fa fa-envelope'],
                ['label' => 'Contacts non traités', 'value' => $this->contacts->countUnhandled(), 'controller' => ContactMessageCrudController::class, 'icon' => 'fa fa-inbox'],
                ['label' => 'Commentaires à modérer', 'value' => $this->comments->countPending(), 'controller' => CommentCrudController::class, 'icon' => 'fa fa-comments'],
            ],
            'stats' => [
                'Boxeurs actifs' => $this->boxers->countActive(),
                'Événements à venir' => $this->galas->countUpcoming(),
                'Actualités publiées' => $this->articles->countPublished(),
            ],
        ]);
    }

    public function configureDashboard(): Dashboard
    {
        return Dashboard::new()
            ->setTitle(self::TITLE)
            ->setLocales(['fr'])
            ->setFaviconPath('favicon.ico');
    }

    public function configureMenuItems(): iterable
    {
        yield MenuItem::linkToDashboard('Tableau de bord', 'fa fa-gauge');

        yield MenuItem::section('Adhérents');
        yield MenuItem::linkTo(MembershipCrudController::class, 'Inscriptions', 'fa fa-id-card')
            ->setBadge($this->memberships->countPending() ?: false, 'warning');
        yield MenuItem::linkTo(MessageCrudController::class, 'Messagerie', 'fa fa-envelope')
            ->setBadge($this->messages->countUnreadToClub() ?: false, 'danger');
        yield MenuItem::linkTo(ContactMessageCrudController::class, 'Contacts', 'fa fa-inbox')
            ->setBadge($this->contacts->countUnhandled() ?: false, 'info');

        yield MenuItem::section('Sportif');
        yield MenuItem::linkTo(BoxerCrudController::class, 'Boxeurs', 'fa fa-user-ninja');
        yield MenuItem::linkTo(FightCrudController::class, 'Palmarès', 'fa fa-trophy');
        yield MenuItem::linkTo(GalaCrudController::class, 'Galas & événements', 'fa fa-calendar-days');

        yield MenuItem::section('Club');
        yield MenuItem::linkTo(DisciplineCrudController::class, 'Disciplines', 'fa fa-hand-fist');
        yield MenuItem::linkTo(CoachCrudController::class, 'Coachs', 'fa fa-whistle');
        yield MenuItem::linkTo(TrainingSlotCrudController::class, 'Planning', 'fa fa-clock');
        yield MenuItem::linkTo(VenueCrudController::class, 'Salles', 'fa fa-location-dot');
        yield MenuItem::linkTo(PricingCrudController::class, 'Tarifs', 'fa fa-euro-sign')->setPermission('ROLE_ADMIN');
        yield MenuItem::linkTo(PartnerCrudController::class, 'Partenaires', 'fa fa-handshake')->setPermission('ROLE_ADMIN');

        yield MenuItem::section('Contenu');
        yield MenuItem::linkTo(ArticleCrudController::class, 'Actualités', 'fa fa-newspaper');
        yield MenuItem::linkTo(CommentCrudController::class, 'Commentaires', 'fa fa-comments')
            ->setBadge($this->comments->countPending() ?: false, 'warning');

        yield MenuItem::section('Administration')->setPermission('ROLE_ADMIN');
        yield MenuItem::linkTo(UserCrudController::class, 'Utilisateurs', 'fa fa-users')->setPermission('ROLE_ADMIN');

        yield MenuItem::section();
        yield MenuItem::linkToUrl('Voir le site', 'fa fa-arrow-up-right-from-square', $this->frontendUrl);
        yield MenuItem::linkToLogout('Déconnexion', 'fa fa-right-from-bracket');
    }
}
