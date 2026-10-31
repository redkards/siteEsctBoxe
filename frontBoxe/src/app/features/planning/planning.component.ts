import { Component, OnInit, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClubService } from '../../core/api/club.service';
import { AUDIENCES, Audience, SlugRef, TrainingSlot } from '../../core/api/models';
import { EmptyStateComponent, LoadErrorComponent } from '../../shared/components/state/state.component';
import { HourPipe } from '../../shared/pipes/time.pipe';
import { fullName, labelOf } from '../../shared/utils/format.utils';
import { createLoader } from '../../shared/utils/loader';
import { buildWeek, isoDay } from '../../shared/utils/planning.utils';

/** Planning hebdomadaire : grille lundi → dimanche (liste par jour sur mobile), filtres discipline / public */
@Component({
  selector: 'app-planning',
  imports: [RouterLink, HourPipe, LoadErrorComponent, EmptyStateComponent],
  templateUrl: './planning.component.html',
  styleUrl: './planning.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class PlanningComponent implements OnInit {
  private readonly api = inject(ClubService);

  protected readonly slots = createLoader<TrainingSlot[]>();
  protected readonly discipline = signal<string | null>(null);
  protected readonly audience = signal<Audience | null>(null);
  protected readonly today = isoDay();
  protected readonly audiences = AUDIENCES;
  protected readonly fullName = fullName;

  /** Disciplines présentes dans le planning (ordre d'apparition) */
  protected readonly disciplines = computed<SlugRef[]>(() => {
    const seen = new Map<string, SlugRef>();
    for (const s of this.slots.data() ?? []) {
      if (s.discipline && !seen.has(s.discipline.slug)) seen.set(s.discipline.slug, s.discipline);
    }
    return [...seen.values()];
  });

  protected readonly week = computed(() =>
    buildWeek(this.slots.data() ?? [], { discipline: this.discipline(), audience: this.audience() }),
  );
  protected readonly total = computed(() => this.week().reduce((n, d) => n + d.slots.length, 0));
  /** Jours sans aucun créneau masqués de la grille (week-end souvent vide) */
  protected readonly visibleDays = computed(() => {
    const all = buildWeek(this.slots.data() ?? []);
    return this.week().filter((d, i) => all[i].slots.length > 0 || d.value <= 5);
  });

  protected audienceLabel(value: Audience): string {
    return labelOf(AUDIENCES, value);
  }

  protected setAudience(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as Audience | '';
    this.audience.set(value || null);
  }

  protected reset(): void {
    this.discipline.set(null);
    this.audience.set(null);
  }

  ngOnInit(): void {
    this.slots.run(() => this.api.getPlanning());
  }
}
