import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClubService } from '../../core/api/club.service';
import { PERIOD_LABELS, Pricing } from '../../core/api/models';
import { EmptyStateComponent, LoadErrorComponent, SkeletonGridComponent } from '../../shared/components/state/state.component';
import { EurosPipe } from '../../shared/pipes/euros.pipe';
import { createLoader } from '../../shared/utils/loader';

export interface ClubDocument {
  title: string;
  text: string;
  image: string;
  file: string;
  who: string;
}

/** Documents officiels à fournir (PDF repris de l'ancien site, dans public/docs) */
export const CLUB_DOCUMENTS: ClubDocument[] = [
  {
    title: 'Demande de licence',
    text: 'Formulaire FFB : informations administratives du licencié, à remplir et signer.',
    image: 'img/imgLicence.jpg',
    file: 'docs/demande-de-licence.pdf',
    who: 'Tous',
  },
  {
    title: 'Certificat médical — boxe amateur',
    text: 'Certificat de non contre-indication à la pratique de la boxe amateur en compétition.',
    image: 'img/imgCertifMedical.png',
    file: 'docs/certificat-medical-boxe-amateur.pdf',
    who: 'Compétiteurs',
  },
  {
    title: 'Certificat médical — loisir / éducative',
    text: 'Pour la boxe loisir, éducative, aéroboxe, handiboxe et vétérans.',
    image: 'img/imgCertifMedical.png',
    file: 'docs/certificat-medical-loisir.pdf',
    who: 'Loisir',
  },
  {
    title: 'Certificat ophtalmologique',
    text: "Examen ophtalmologique exigé pour la boxe amateur en compétition.",
    image: 'img/imgCertifOphtalmo.jpg',
    file: 'docs/certificat-ophtalmo-boxe-amateur.pdf',
    who: 'Compétiteurs',
  },
  {
    title: 'Autorisation parentale et droit à l’image',
    text: 'Obligatoire pour les mineurs, signée par le responsable légal.',
    image: 'img/imgAutorisationParentale.jpg',
    file: 'docs/autorisation-parentale-droit-image.pdf',
    who: 'Mineurs',
  },
  {
    title: 'Catégories d’âge',
    text: 'Tableau des catégories d’âge de la fédération.',
    image: 'img/imgCategorieAge.jpg',
    file: 'docs/categories-age.pdf',
    who: 'Information',
  },
  {
    title: 'Tarifs des licences',
    text: 'Grille fédérale du coût des licences selon la catégorie.',
    image: 'img/imgTarifLicence.jpg',
    file: 'docs/tarifs-licences.pdf',
    who: 'Information',
  },
];

@Component({
  selector: 'app-pricing',
  imports: [RouterLink, EurosPipe, SkeletonGridComponent, LoadErrorComponent, EmptyStateComponent],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class PricingComponent implements OnInit {
  private readonly api = inject(ClubService);
  protected readonly pricing = createLoader<Pricing[]>();
  protected readonly periods = PERIOD_LABELS;
  protected readonly documents = CLUB_DOCUMENTS;

  protected sorted(list: Pricing[]): Pricing[] {
    return [...list].sort((a, b) => a.position - b.position);
  }

  ngOnInit(): void {
    this.pricing.run(() => this.api.getPricing());
  }
}
