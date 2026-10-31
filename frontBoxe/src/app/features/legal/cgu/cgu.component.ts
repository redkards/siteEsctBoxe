import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LEGAL, LegalSection, isPending, scrollToSection } from '../legal.config';

/**
 * Conditions générales d'utilisation du site et de l'espace membre : /cgu
 */
@Component({
  selector: 'app-cgu',
  imports: [RouterLink],
  templateUrl: './cgu.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: '../legal-layout.scss',
})
export class CguComponent {
  protected readonly legal = LEGAL;
  protected readonly pending = isPending;
  protected readonly scrollTo = scrollToSection;

  protected readonly sections: LegalSection[] = [
    { id: 'objet', label: 'Objet et acceptation' },
    { id: 'acces', label: 'Accès au site' },
    { id: 'compte', label: 'Compte membre' },
    { id: 'adhesion', label: 'Inscription en ligne au club' },
    { id: 'messagerie', label: 'Messagerie avec le club' },
    { id: 'commentaires', label: 'Commentaires et contenus' },
    { id: 'comportement', label: 'Règles de conduite' },
    { id: 'propriete', label: 'Propriété intellectuelle' },
    { id: 'responsabilite', label: 'Responsabilité' },
    { id: 'suspension', label: 'Suspension et suppression' },
    { id: 'donnees', label: 'Données personnelles' },
    { id: 'evolution', label: 'Modification des CGU' },
    { id: 'droit', label: 'Droit applicable et litiges' },
  ];
}
