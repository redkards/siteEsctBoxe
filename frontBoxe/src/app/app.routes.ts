import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth/auth.guard';

const SITE = 'ESC Boxe Tergnier';

/**
 * `title` + `data.description` (+ `data.ogType`) alimentent la meta description et l'Open Graph
 * via SeoTitleStrategy. Les pages dynamiques complètent une fois leur contenu chargé (SeoService).
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
    title: `${SITE} — Club de boxe anglaise à Tergnier (Aisne)`,
    data: {
      description:
        'ESC Boxe Tergnier, club de boxe anglaise à Tergnier (02700) : boxe éducative, loisir, amateur et pro, planning des cours, galas et inscriptions en ligne.',
    },
  },
  {
    path: 'club',
    loadComponent: () => import('./features/club/club.component').then((m) => m.ClubComponent),
    title: `Le club — ${SITE}`,
    data: { description: "Histoire, valeurs, coachs diplômés et salles d'entraînement de l'ESC Boxe Tergnier, club de boxe anglaise de l'Aisne." },
  },
  {
    path: 'disciplines',
    loadComponent: () => import('./features/disciplines/discipline-list.component').then((m) => m.DisciplineListComponent),
    title: `Disciplines — ${SITE}`,
    data: { description: 'Boxe éducative, boxe loisir, boxe amateur et professionnelle : toutes les disciplines enseignées à l’ESC Boxe Tergnier.' },
  },
  {
    path: 'disciplines/:slug',
    loadComponent: () => import('./features/disciplines/discipline-detail.component').then((m) => m.DisciplineDetailComponent),
    title: `Discipline — ${SITE}`,
    data: { description: 'Présentation de la discipline, âge minimum, créneaux d’entraînement et coachs à l’ESC Boxe Tergnier.' },
  },
  {
    path: 'planning',
    loadComponent: () => import('./features/planning/planning.component').then((m) => m.PlanningComponent),
    title: `Planning des entraînements — ${SITE}`,
    data: { description: 'Planning hebdomadaire des cours de boxe à Tergnier : horaires par discipline et par public (enfants, ados, adultes, compétiteurs).' },
  },
  {
    path: 'tarifs',
    loadComponent: () => import('./features/pricing/pricing.component').then((m) => m.PricingComponent),
    title: `Tarifs et documents — ${SITE}`,
    data: { description: 'Tarifs des licences et cotisations de l’ESC Boxe Tergnier, et documents à fournir : certificat médical, autorisation parentale, demande de licence.' },
  },
  {
    path: 'inscription',
    loadComponent: () => import('./features/membership/membership.component').then((m) => m.MembershipComponent),
    title: `S'inscrire au club — ${SITE}`,
    data: { description: 'Inscription en ligne à l’ESC Boxe Tergnier : choisissez votre discipline et votre formule, séance d’essai gratuite.' },
  },
  {
    path: 'boxeurs',
    loadComponent: () => import('./features/boxers/boxer-list.component').then((m) => m.BoxerListComponent),
    title: `Nos boxeurs — ${SITE}`,
    data: { description: 'Les boxeurs de l’ESC Boxe Tergnier : éducatifs, amateurs, élite et pros, avec leur catégorie de poids et leur palmarès.' },
  },
  {
    path: 'boxeurs/:slug',
    loadComponent: () => import('./features/boxers/boxer-detail.component').then((m) => m.BoxerDetailComponent),
    title: `Boxeur — ${SITE}`,
    data: { description: 'Fiche d’un boxeur de l’ESC Boxe Tergnier : palmarès, catégorie et combats.', ogType: 'profile' },
  },
  {
    path: 'evenements',
    loadComponent: () => import('./features/events/event-list.component').then((m) => m.EventListComponent),
    title: `Événements — ${SITE}`,
    data: { description: 'Galas, compétitions, stages et portes ouvertes de l’ESC Boxe Tergnier : dates, lieux et billetterie.' },
  },
  {
    path: 'evenements/:slug',
    loadComponent: () => import('./features/events/event-detail.component').then((m) => m.EventDetailComponent),
    title: `Événement — ${SITE}`,
    data: { description: 'Détail d’un événement de l’ESC Boxe Tergnier : date, lieu, programme et combats.', ogType: 'article' },
  },
  {
    path: 'actualites',
    loadComponent: () => import('./features/articles/article-list.component').then((m) => m.ArticleListComponent),
    title: `Actualités — ${SITE}`,
    data: { description: 'Actualités de l’ESC Boxe Tergnier : résultats des compétitions, galas, stages et vie du club.' },
  },
  {
    path: 'actualites/:slug',
    loadComponent: () => import('./features/articles/article-detail.component').then((m) => m.ArticleDetailComponent),
    title: `Actualité — ${SITE}`,
    data: { description: 'Actualité de l’ESC Boxe Tergnier.', ogType: 'article' },
  },
  {
    path: 'lecons',
    loadComponent: () => import('./features/lessons/lesson-list.component').then((m) => m.LessonListComponent),
    title: `Les 50 leçons de boxe — ${SITE}`,
    data: { description: 'Bibliothèque de 50 leçons de boxe éducative sans contact : appuis, enchaînements, défense, distance et transmission, adaptées aux enfants, ados et jeunes adultes.' },
  },
  {
    path: 'lecons/seance',
    loadComponent: () => import('./features/lessons/lesson-session.component').then((m) => m.LessonSessionComponent),
    title: `Ma séance — ${SITE}`,
    data: { description: 'Composez votre séance de boxe à partir des leçons du club : ordre, durée totale, échauffement et retour au calme, version imprimable.' },
  },
  {
    path: 'lecons/:slug',
    loadComponent: () => import('./features/lessons/lesson-detail.component').then((m) => m.LessonDetailComponent),
    title: `Leçon — ${SITE}`,
    data: { description: 'Fiche d’une leçon de boxe éducative : objectif, organisation, schéma, déroulé, corrections et adaptations par âge.', ogType: 'article' },
  },
  {
    path: 'chrono',
    loadComponent: () => import('./features/chrono/chrono.component').then((m) => m.ChronoComponent),
    title: `Chrono de rounds — ${SITE}`,
    data: { description: 'Chronomètre de rounds de boxe : préréglages éducative, loisir et amateur, temps de repos, décompte et bip sonore.' },
  },
  {
    path: 'agenda',
    loadComponent: () => import('./features/agenda/agenda.component').then((m) => m.AgendaComponent),
    title: `Agenda des galas de boxe — ${SITE}`,
    data: { description: 'Agenda des prochains galas de boxe en France (Hauts-de-France, Grand Est, Île-de-France…) avec export vers votre calendrier.' },
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact/contact.component').then((m) => m.ContactComponent),
    title: `Contact — ${SITE}`,
    data: { description: 'Contactez l’ESC Boxe Tergnier : formulaire, téléphone, email et plan d’accès à la salle.' },
  },

  // Compte membre (repris de Poker Winners)
  {
    path: 'connexion',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent),
    title: `Connexion — ${SITE}`,
    data: { description: 'Connectez-vous à votre espace membre de l’ESC Boxe Tergnier.' },
  },
  {
    path: 'inscription-compte',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
    title: `Créer un compte — ${SITE}`,
    data: { description: 'Créez votre compte membre ESC Boxe Tergnier pour suivre vos inscriptions et échanger avec le club.' },
  },
  {
    path: 'verifier-email',
    loadComponent: () => import('./features/auth/verify-email/verify-email.component').then((m) => m.VerifyEmailComponent),
    title: `Vérification de votre email — ${SITE}`,
    data: { description: 'Confirmez votre adresse email pour activer votre compte ESC Boxe Tergnier.' },
  },
  // Ancien lien (emails du back repris de Poker Winners)
  { path: 'verify-email', redirectTo: 'verifier-email' },
  {
    path: 'mon-espace',
    canActivate: [authGuard],
    loadComponent: () => import('./features/account/account.component').then((m) => m.AccountComponent),
    title: `Mon espace — ${SITE}`,
    data: { description: 'Votre espace membre : profil, inscriptions au club, messagerie et données personnelles.' },
  },
  {
    // Lien reçu par email pour confirmer la suppression du compte (RGPD)
    path: 'suppression-compte',
    loadComponent: () => import('./features/account/account-deletion/account-deletion.component').then((m) => m.AccountDeletionComponent),
    title: `Suppression du compte — ${SITE}`,
    data: { description: 'Confirmez la suppression de votre compte ESC Boxe Tergnier et l’effacement de vos données.' },
  },

  // Pages légales
  {
    path: 'mentions-legales',
    loadComponent: () => import('./features/legal/mentions-legales/mentions-legales.component').then((m) => m.MentionsLegalesComponent),
    title: `Mentions légales — ${SITE}`,
    data: { description: 'Mentions légales du site de l’ESC Boxe Tergnier : éditeur, hébergeur et contact.' },
  },
  {
    path: 'confidentialite',
    loadComponent: () => import('./features/legal/confidentialite/confidentialite.component').then((m) => m.ConfidentialiteComponent),
    title: `Politique de confidentialité — ${SITE}`,
    data: { description: 'Données personnelles traitées par l’ESC Boxe Tergnier, durées de conservation et droits RGPD.' },
  },
  {
    path: 'cgu',
    loadComponent: () => import('./features/legal/cgu/cgu.component').then((m) => m.CguComponent),
    title: `Conditions générales d'utilisation — ${SITE}`,
    data: { description: "Conditions générales d'utilisation du site et de l'espace membre de l’ESC Boxe Tergnier." },
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
    title: `Page introuvable — ${SITE}`,
    data: { description: 'Cette page n’existe pas ou a été déplacée.' },
  },
];
