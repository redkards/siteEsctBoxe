import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MembershipService } from '../../../core/api/membership.service';
import { MEMBERSHIP_STATUS, Membership, MembershipStatus } from '../../../core/api/models';
import { EmptyStateComponent, LoadErrorComponent } from '../../../shared/components/state/state.component';
import { createLoader } from '../../../shared/utils/loader';
import { formatEuros } from '../../../shared/utils/format.utils';

const STATUS_HELP: Record<MembershipStatus, string> = {
  en_attente: 'Le club étudie votre demande. Pensez à apporter le certificat médical et le règlement à la salle.',
  validee: 'Bienvenue au club ! Votre adhésion est validée pour la saison.',
  refusee: 'Votre demande n’a pas pu être acceptée. Écrivez au club depuis la messagerie pour en savoir plus.',
};

/**
 * Onglet « Mes inscriptions » : demandes d'adhésion rattachées au compte (GET /api/me/memberships).
 */
@Component({
  selector: 'app-memberships-tab',
  imports: [DatePipe, RouterLink, EmptyStateComponent, LoadErrorComponent],
  template: `
    <div class="tab-head">
      <div>
        <h2 class="tab-title" id="memberships-title">Mes inscriptions</h2>
        <p class="bx-hint">Vos demandes d'adhésion au club, saison par saison.</p>
      </div>
      <a routerLink="/inscription" class="bx-btn bx-btn--primary bx-btn--sm">
        Nouvelle inscription <span class="bx-arrow" aria-hidden="true">→</span>
      </a>
    </div>

    @if (memberships.loading() && !memberships.data()) {
      <div class="list" role="status" aria-live="polite">
        <span class="bx-sr-only">Chargement de vos inscriptions…</span>
        @for (i of [1, 2]; track i) {
          <span class="bx-skeleton sk" aria-hidden="true"></span>
        }
      </div>
    } @else if (memberships.error()) {
      <app-load-error [message]="memberships.error()!" (retry)="memberships.retry()" />
    } @else if (memberships.data()?.length) {
      <ul class="list" aria-labelledby="memberships-title">
        @for (m of memberships.data(); track m.id) {
          <li class="bx-card item">
            <div class="item__main">
              <div class="item__top">
                <h3>{{ m.discipline?.name ?? 'Discipline à préciser' }}</h3>
                <span [class]="'bx-badge bx-badge--' + status(m).tone">
                  <span class="bx-sr-only">Statut : </span>{{ status(m).label }}
                </span>
              </div>
              <dl class="facts">
                <div><dt>Saison</dt><dd>{{ m.season }}</dd></div>
                <div><dt>Boxeur</dt><dd>{{ m.firstName }} {{ m.lastName }}</dd></div>
                @if (m.pricing) {
                  <div>
                    <dt>Formule</dt>
                    <dd>{{ m.pricing.label }}@if (m.pricing.priceCents) { · {{ euros(m.pricing.priceCents) }} }</dd>
                  </div>
                }
                @if (m.legalGuardian) {
                  <div><dt>Responsable légal</dt><dd>{{ m.legalGuardian }}</dd></div>
                }
                @if (m.medicalCertificate !== undefined) {
                  <div><dt>Certificat médical</dt><dd>{{ m.medicalCertificate ? 'Déclaré' : 'À fournir' }}</dd></div>
                }
                <div><dt>Demande du</dt><dd>{{ m.createdAt | date: 'd MMMM y' }}</dd></div>
              </dl>
              <p class="bx-hint">{{ help(m) }}</p>
            </div>
          </li>
        }
      </ul>
    } @else {
      <app-empty title="Aucune inscription pour le moment" text="Choisissez votre discipline et votre formule : la première séance d'essai est offerte.">
        <a routerLink="/inscription" class="bx-btn bx-btn--primary">S'inscrire au club</a>
      </app-empty>
    }
  `,
  styleUrl: '../account-tab.scss',
  styles: `
    .list {
      display: grid;
      gap: 1rem;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .sk {
      height: 150px;
    }
    .item {
      padding: 1.25rem 1.4rem;
    }
    .item__top {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 0.6rem;
      margin-bottom: 0.9rem;
    }
    .item__top h3 {
      font-size: 1.3rem;
    }
    .facts {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(100%, 170px), 1fr));
      gap: 0.6rem 1.2rem;
      margin: 0 0 0.9rem;
    }
    .facts dt {
      color: var(--bx-muted);
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .facts dd {
      margin: 0;
      font-weight: 600;
    }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class MembershipsTabComponent implements OnInit {
  private readonly service = inject(MembershipService);
  protected readonly memberships = createLoader<Membership[]>();
  protected readonly euros = formatEuros;

  ngOnInit(): void {
    this.memberships.run(() => this.service.mine());
  }

  protected status(m: Membership) {
    return MEMBERSHIP_STATUS[m.status] ?? { label: m.status, tone: 'warning' as const };
  }

  protected help(m: Membership): string {
    return STATUS_HELP[m.status] ?? '';
  }
}
