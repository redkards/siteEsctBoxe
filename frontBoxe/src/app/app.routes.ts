import { Routes } from '@angular/router';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { InscriptionComponent } from './pages/inscription/inscription.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ConditionsGeneralesDutilisationComponent } from './commons/footer/conditions-generales-dutilisation/conditions-generales-dutilisation.component';
import { SupportEtAssistanceComponent } from './commons/footer/support-et-assistance/support-et-assistance.component';
import { ProtectionDesDonneesComponent } from './commons/footer/protection-des-donnees/protection-des-donnees.component';
import { ActualitesComponent } from './pages/actualites/actualites.component';
import { NotFoundComponent } from './commons/not-found/not-found.component';
import { ConnexionComponent } from './pages/connexion/connexion.component';
import { RegisterComponent } from './pages/register/register.component';
import { Inscription20242025Component } from './pages/inscription2024-2025/inscription2024-2025.component';
import { PartenairesComponent } from './commons/partenaires/partenaires.component';

export const routes: Routes = [
  // chemins navBar
  { path: '', redirectTo: 'accueil', pathMatch: 'full' },

  { path: 'accueil', component: AccueilComponent },

  { path: 'actualites', component: ActualitesComponent },

  { path: 'inscription2024', component: Inscription20242025Component },

  { path: 'contact', component: ContactComponent },

  { path: 'connexion', component: ConnexionComponent },

  { path: 'inscription', component: InscriptionComponent },

  { path: 'register', component: RegisterComponent },

  // Chemin footer

  { path: 'rgpd', component: ProtectionDesDonneesComponent },

  { path: 'cgu', component: ConditionsGeneralesDutilisationComponent },

  { path: 'supportassistance', component: SupportEtAssistanceComponent },

  { path: 'partenaires', component: PartenairesComponent },

  { path: '**', component: NotFoundComponent },
];
