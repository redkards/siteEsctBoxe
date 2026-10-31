import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ClubService } from '../../core/api/club.service';
import { ClubInfo, Coach, Partner, Venue } from '../../core/api/models';
import { LoadErrorComponent, SkeletonGridComponent } from '../../shared/components/state/state.component';
import { MediaPipe } from '../../shared/pipes/media.pipe';
import { osmEmbed, osmLink } from '../../shared/utils/format.utils';
import { createLoader } from '../../shared/utils/loader';

/** Le club : histoire, valeurs, coachs, salles (carte OpenStreetMap), partenaires */
@Component({
  selector: 'app-club',
  imports: [RouterLink, MediaPipe, SkeletonGridComponent, LoadErrorComponent],
  templateUrl: './club.component.html',
  styleUrl: './club.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ClubComponent implements OnInit {
  private readonly api = inject(ClubService);
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly club = createLoader<ClubInfo>();
  protected readonly coaches = createLoader<Coach[]>();
  protected readonly venues = createLoader<Venue[]>();
  protected readonly partners = createLoader<Partner[]>();

  protected readonly values = [
    { title: 'Respect', text: "De l'adversaire, des coachs, des partenaires d'entraînement et des règles. Sur le ring comme en dehors." },
    { title: 'Discipline', text: 'La régularité paie : chaque séance compte, chaque effort fait progresser.' },
    { title: 'Courage', text: 'Oser monter sur le ring, oser se dépasser, quel que soit son niveau de départ.' },
    { title: 'Esprit club', text: 'Une famille où débutants, compétiteurs et bénévoles avancent ensemble.' },
  ];

  protected readonly osmLink = osmLink;
  private readonly embeds = new Map<number, SafeResourceUrl>();

  /** URL d'iframe OpenStreetMap (domaine fixe, coordonnées numériques) */
  protected mapUrl(venue: Venue): SafeResourceUrl | null {
    if (venue.latitude === null || venue.longitude === null) return null;
    let url = this.embeds.get(venue.id);
    if (!url) {
      url = this.sanitizer.bypassSecurityTrustResourceUrl(osmEmbed(Number(venue.latitude), Number(venue.longitude)));
      this.embeds.set(venue.id, url);
    }
    return url;
  }

  ngOnInit(): void {
    this.club.run(() => this.api.getClub());
    this.coaches.run(() => this.api.getCoaches());
    this.venues.run(() => this.api.getVenues());
    this.partners.run(() => this.api.getPartners());
  }
}
