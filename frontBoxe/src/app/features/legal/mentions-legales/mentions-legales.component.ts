import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LEGAL, LegalSection, isPending, scrollToSection } from '../legal.config';

/**
 * Mentions légales (LCEN, art. 6-III) : /mentions-legales
 */
@Component({
  selector: 'app-mentions-legales',
  imports: [RouterLink],
  templateUrl: './mentions-legales.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: '../legal-layout.scss',
})
export class MentionsLegalesComponent {
  protected readonly legal = LEGAL;
  protected readonly pending = isPending;
  protected readonly scrollTo = scrollToSection;

  protected readonly sections: LegalSection[] = [
    { id: 'editeur', label: 'Éditeur du site' },
    { id: 'directeur', label: 'Directeur de la publication' },
    { id: 'hebergeur', label: 'Hébergeur' },
    { id: 'propriete', label: 'Propriété intellectuelle et photos' },
    { id: 'responsabilite', label: 'Responsabilité et liens' },
    { id: 'signalement', label: 'Signaler un contenu' },
    { id: 'autres', label: 'Données personnelles et CGU' },
  ];
}
