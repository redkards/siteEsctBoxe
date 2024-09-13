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

export const routes: Routes = [
  // chemins navBar
  { path: '', redirectTo: 'Accueil', pathMatch: 'full' },

  { path: 'accueil', component: AccueilComponent },

  { path: 'actualites', component: ActualitesComponent },

  { path: 'inscription', component: InscriptionComponent },

  { path: 'contact', component: ContactComponent },

  { path: 'connexion', component: ConnexionComponent },

  { path: 'register', component: RegisterComponent },

  // Chemin page Informations
  { path: 'rgpd', component: ProtectionDesDonneesComponent },

  { path: 'cgu', component: ConditionsGeneralesDutilisationComponent },

  { path: 'supportassistance', component: SupportEtAssistanceComponent },

  { path: '**', component: NotFoundComponent },
];
