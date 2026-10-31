import { Component, computed, effect, inject, input, linkedSignal, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo/seo.service';
import { LESSON_MODULES } from './lessons.model';
import { LESSONS } from './lessons.data';
import { LessonProgressService } from './lesson-progress.service';
import { LessonSchemaComponent } from './lesson-schema.component';
import { LESSON_AUDIENCES, LessonAudience, findLessonRef, neighbours } from './lessons.utils';

/** /lecons/:slug — Fiche complète d'une leçon (schéma, déroulé, adaptations, impression) */
@Component({
  selector: 'app-lesson-detail',
  imports: [RouterLink, LessonSchemaComponent],
  templateUrl: './lesson-detail.component.html',
  styleUrl: './lessons.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class LessonDetailComponent {
  private readonly seo = inject(SeoService);
  protected readonly progress = inject(LessonProgressService);

  readonly slug = input.required<string>();

  protected readonly audiences = LESSON_AUDIENCES;
  protected readonly lesson = computed(() => LESSONS.find((l) => l.slug === this.slug()) ?? null);
  protected readonly module = computed(() => LESSON_MODULES.find((m) => m.id === this.lesson()?.module) ?? null);
  protected readonly nav = computed(() => {
    const l = this.lesson();
    return l ? neighbours(LESSONS, l.id) : {};
  });
  protected readonly prerequisites = computed(() =>
    (this.lesson()?.prerequisites ?? []).map((text) => ({ text, ref: findLessonRef(LESSONS, text) })),
  );
  protected readonly tab = signal<LessonAudience>('enfants');
  /** Critères cochés (locaux à l'affichage, remis à zéro au changement de leçon) */
  protected readonly checked = linkedSignal<number, boolean[]>({
    source: () => this.lesson()?.id ?? 0,
    computation: () => [],
  });

  constructor() {
    effect(() => {
      const l = this.lesson();
      if (l) {
        this.seo.update({
          title: `${l.title} — Leçons — ESC Boxe Tergnier`,
          description: `Leçon n°${l.id} (${l.level}, ${l.durationMin} min) : ${l.objective}`,
          type: 'article',
        });
      }
    });
  }

  protected toggleCriterion(i: number): void {
    this.checked.update((c) => {
      const next = [...c];
      next[i] = !next[i];
      return next;
    });
  }

  protected onTabKey(event: KeyboardEvent): void {
    const order = LESSON_AUDIENCES.map((a) => a.value);
    const i = order.indexOf(this.tab());
    const next = event.key === 'ArrowRight' ? (i + 1) % 3 : event.key === 'ArrowLeft' ? (i + 2) % 3 : -1;
    if (next >= 0) {
      event.preventDefault();
      this.tab.set(order[next]);
      (document.getElementById('lx-tab-' + order[next]) as HTMLElement | null)?.focus();
    }
  }

  protected print(): void {
    window.print();
  }
}
