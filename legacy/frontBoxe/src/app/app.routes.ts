import { Routes } from '@angular/router';
import { adminGuard, authGuard } from './core/auth.guard';

// Chaque page est chargée à la demande (lazy loading)
export const routes: Routes = [
  // chemins navBar
  { path: '', redirectTo: 'accueil', pathMatch: 'full' },

  {
    path: 'accueil',
    title: 'Accueil | ESCT Boxe',
    loadComponent: () =>
      import('./pages/accueil/accueil.component').then((m) => m.AccueilComponent),
  },
  {
    path: 'actualites',
    title: 'Actualités | ESCT Boxe',
    loadComponent: () =>
      import('./pages/actualites/actualites.component').then((m) => m.ActualitesComponent),
  },
  {
    path: 'inscription2024',
    title: 'Inscriptions | ESCT Boxe',
    loadComponent: () =>
      import('./pages/inscription2024-2025/inscription2024-2025.component').then(
        (m) => m.Inscription20242025Component
      ),
  },
  {
    path: 'contact',
    title: 'Contact | ESCT Boxe',
    loadComponent: () =>
      import('./pages/contact/contact.component').then((m) => m.ContactComponent),
  },
  {
    path: 'connexion',
    title: 'Connexion | ESCT Boxe',
    loadComponent: () =>
      import('./pages/connexion/connexion.component').then((m) => m.ConnexionComponent),
  },
  {
    path: 'inscription',
    title: 'Créer un compte | ESCT Boxe',
    loadComponent: () =>
      import('./pages/inscription/inscription.component').then((m) => m.InscriptionComponent),
  },
  {
    path: 'register',
    title: 'Connexion | ESCT Boxe',
    loadComponent: () =>
      import('./pages/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'login',
    title: 'Connexion | ESCT Boxe',
    loadComponent: () =>
      import('./pages/profil/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'profil',
    title: 'Mon profil | ESCT Boxe',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/profil/profil.component').then((m) => m.ProfilComponent),
  },

  //chemins messagerie (membres connectés)
  {
    path: 'messagerie',
    title: 'Messagerie | ESCT Boxe',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/profil/messagerie/messagerie.component').then(
        (m) => m.MessagerieComponent
      ),
  },
  {
    path: 'messageDetail/:id',
    title: 'Message | ESCT Boxe',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/profil/messagerie/msg-detail/msg-detail.component').then(
        (m) => m.MsgDetailComponent
      ),
  },
  {
    path: 'addMessage',
    title: 'Nouveau message | ESCT Boxe',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/profil/messagerie/create-msg/create-msg.component').then(
        (m) => m.CreateMsgComponent
      ),
  },

  // Chemin footer
  {
    path: 'rgpd',
    title: 'Protection des données | ESCT Boxe',
    loadComponent: () =>
      import('./commons/footer/protection-des-donnees/protection-des-donnees.component').then(
        (m) => m.ProtectionDesDonneesComponent
      ),
  },
  {
    path: 'cgu',
    title: "Conditions générales d'utilisation | ESCT Boxe",
    loadComponent: () =>
      import(
        './commons/footer/conditions-generales-dutilisation/conditions-generales-dutilisation.component'
      ).then((m) => m.ConditionsGeneralesDutilisationComponent),
  },
  {
    path: 'supportassistance',
    title: 'Support | ESCT Boxe',
    loadComponent: () =>
      import('./commons/footer/support-et-assistance/support-et-assistance.component').then(
        (m) => m.SupportEtAssistanceComponent
      ),
  },
  {
    path: 'partenaires',
    title: 'Partenaires | ESCT Boxe',
    loadComponent: () =>
      import('./commons/partenaires/partenaires.component').then((m) => m.PartenairesComponent),
  },

  // chemins news
  {
    path: 'news',
    title: 'News | ESCT Boxe',
    loadComponent: () =>
      import('./commons/FloatingNews/floating-news/floating-news.component').then(
        (m) => m.FloatingNewsComponent
      ),
  },

  // gestion du club (administrateurs)
  {
    path: 'boxeurs',
    title: 'Boxeurs | ESCT Boxe',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./gestion/boxeurs/boxeurs.component').then((m) => m.BoxeurComponent),
  },
  {
    path: 'palmares',
    title: 'Palmarès | ESCT Boxe',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./gestion/boxeurs/palmares/palmares.component').then((m) => m.PalmaresComponent),
  },
  {
    path: 'palmares/new',
    title: 'Nouveau palmarès | ESCT Boxe',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./gestion/boxeurs/palmares-form/palmares-form.component').then(
        (m) => m.PalmaresFormComponent
      ),
  },
  {
    path: 'palmares/:id/edit',
    title: 'Modifier un palmarès | ESCT Boxe',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./gestion/boxeurs/palmares-form/palmares-form.component').then(
        (m) => m.PalmaresFormComponent
      ),
  },
  {
    path: 'newsMenu',
    title: 'Gestion des news | ESCT Boxe',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./commons/FloatingNews/news-menu/news-menu.component').then(
        (m) => m.NewsMenuComponent
      ),
  },
  {
    path: 'addNews',
    title: 'Ajouter une news | ESCT Boxe',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./commons/FloatingNews/add-news/add-news.component').then((m) => m.AddNewsComponent),
  },
  {
    path: 'editNews',
    title: 'Modifier une news | ESCT Boxe',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./commons/FloatingNews/edit-news/edit-news.component').then(
        (m) => m.EditNewsComponent
      ),
  },

  {
    path: '**',
    title: 'Page introuvable | ESCT Boxe',
    loadComponent: () =>
      import('./commons/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
