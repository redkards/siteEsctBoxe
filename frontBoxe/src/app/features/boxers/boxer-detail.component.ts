import { Component, computed, effect, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BoxerService } from '../../core/api/boxer.service';
import { BOXER_LEVELS, Boxer, FIGHT_METHODS, FightResult } from '../../core/api/models';
import { SeoService } from '../../core/seo/seo.service';
import { LoadErrorComponent } from '../../shared/components/state/state.component';
import { MediaPipe } from '../../shared/pipes/media.pipe';
import { labelOf } from '../../shared/utils/format.utils';
import { createLoader } from '../../shared/utils/loader';

const RESULT_LABELS: Record<FightResult, string> = { victoire: 'Victoire', defaite: 'Défaite', nul: 'Nul' };

/** Pourcentages de la barre de palmarès (victoires / nuls / défaites) */
export function recordShares(r: { wins: number; losses: number; draws: number }): { wins: number; draws: number; losses: number; total: number } {
  const total = r.wins + r.losses + r.draws;
  if (!total) return { wins: 0, draws: 0, losses: 0, total: 0 };
  const pct = (n: number) => Math.round((n / total) * 1000) / 10;
  return { wins: pct(r.wins), draws: pct(r.draws), losses: pct(r.losses), total };
}

/** Fiche boxeur : photo, palmarès visuel V-D-N-KO, infos et combats */
@Component({
  selector: 'app-boxer-detail',
  imports: [RouterLink, DatePipe, MediaPipe, LoadErrorComponent],
  templateUrl: './boxer-detail.component.html',
  styleUrl: './boxer-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class BoxerDetailComponent {
  private readonly api = inject(BoxerService);
  private readonly seo = inject(SeoService);

  readonly slug = input.required<string>();
  protected readonly boxer = createLoader<Boxer>();
  protected readonly methods = FIGHT_METHODS;
  protected readonly results = RESULT_LABELS;

  protected readonly record = computed(() => {
    const b = this.boxer.data();
    return b ? (b.record ?? { wins: b.wins, losses: b.losses, draws: b.draws, kos: b.kos }) : null;
  });
  protected readonly shares = computed(() => {
    const r = this.record();
    return r ? recordShares(r) : null;
  });
  protected readonly level = computed(() => labelOf(BOXER_LEVELS, this.boxer.data()?.level));
  protected readonly koRate = computed(() => {
    const r = this.record();
    return r && r.wins ? Math.round((r.kos / r.wins) * 100) : 0;
  });

  constructor() {
    effect(() => {
      const slug = this.slug();
      this.boxer.run(() => this.api.get(slug));
    });
    effect(() => {
      const b = this.boxer.data();
      if (b) {
        this.seo.update({
          title: `${b.firstName} ${b.lastName} — Boxeurs — ESC Boxe Tergnier`,
          description: `${b.firstName} ${b.lastName}${b.weightClass ? ', ' + b.weightClass : ''} : palmarès ${b.wins} victoires, ${b.losses} défaites, ${b.draws} nuls dont ${b.kos} KO.`,
          type: 'profile',
          image: b.photo,
        });
      }
    });
  }
}
