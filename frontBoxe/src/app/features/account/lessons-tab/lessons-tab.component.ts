import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LESSON_MODULES, Lesson } from '../../lessons/lessons.model';
import { LESSONS } from '../../lessons/lessons.data';
import { LessonProgressService } from '../../lessons/lesson-progress.service';

/** Onglet « Mes leçons » : progression locale sur les 50 leçons (enregistrée sur cet appareil) */
@Component({
  selector: 'app-lessons-tab',
  imports: [RouterLink],
  template: `
    <div class="tab-head">
      <div>
        <h2 class="tab-title">Mes leçons</h2>
        <p class="bx-hint">Progression enregistrée sur cet appareil.</p>
      </div>
      <a routerLink="/lecons" class="bx-btn bx-btn--primary bx-btn--sm">Bibliothèque des leçons <span class="bx-arrow" aria-hidden="true">→</span></a>
    </div>

    <p class="lt-global"><strong>{{ globalDone() }}/50</strong> leçons faites</p>
    <progress class="lt-bar" [value]="globalDone()" max="50" aria-label="Leçons faites sur 50"></progress>

    <ul class="lt-modules">
      @for (m of stats(); track m.id) {
        <li>
          <span>M{{ m.id }} · {{ m.title }}</span>
          <progress class="lt-bar" [value]="m.done" max="10" [attr.aria-label]="'Module ' + m.id + ' : ' + m.done + ' sur 10'"></progress>
          <strong>{{ m.done }}/10</strong>
        </li>
      }
    </ul>

    @if (favorites().length) {
      <h3 class="lt-sub">Mes favoris</h3>
      <ul class="lt-favs">
        @for (l of favorites(); track l.id) {
          <li><a [routerLink]="['/lecons', l.slug]">{{ l.id }}. {{ l.title }}</a></li>
        }
      </ul>
    }
    <p><a routerLink="/lecons/seance" class="bx-link">Ma séance ({{ progress.session().length }} leçon{{ progress.session().length > 1 ? 's' : '' }})</a></p>
  `,
  styleUrl: '../account-tab.scss',
  styles: `
    .lt-global { margin: 0 0 0.4rem; }
    .lt-bar { width: 100%; height: 10px; accent-color: var(--bx-primary); }
    .lt-modules { display: grid; gap: 0.6rem; margin: 1.25rem 0; padding: 0; list-style: none; }
    .lt-modules li { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr) 3rem; gap: 0.75rem; align-items: center; font-size: 0.92rem; }
    @media (max-width: 600px) { .lt-modules li { grid-template-columns: 1fr 3rem; } .lt-modules li span { grid-column: 1 / -1; } }
    .lt-sub { margin: 1rem 0 0.5rem; font-size: 1.1rem; }
    .lt-favs { margin: 0 0 1rem; padding-left: 1.2rem; }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class LessonsTabComponent {
  protected readonly progress = inject(LessonProgressService);

  protected readonly globalDone = computed(() => this.progress.countDone(LESSONS.map((l) => l.id)));
  protected readonly stats = computed(() => {
    this.progress.done();
    return LESSON_MODULES.map((m) => ({
      ...m,
      done: this.progress.countDone(LESSONS.filter((l) => l.module === m.id).map((l) => l.id)),
    }));
  });
  protected readonly favorites = computed<Lesson[]>(() => {
    const fav = this.progress.favorites();
    return LESSONS.filter((l) => fav.has(l.id));
  });
}
