import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Lesson } from './lessons.model';
import { LESSONS } from './lessons.data';
import { LessonProgressService } from './lesson-progress.service';
import { SESSION_COOLDOWN_MIN, SESSION_WARMUP_MIN, formatMinutes, sessionDuration } from './lessons.utils';

/** /lecons/seance — « Ma séance » : leçons choisies, ordre modifiable, durée totale, impression */
@Component({
  selector: 'app-lesson-session',
  imports: [RouterLink],
  template: `
    <section class="bx-page-head">
      <div class="bx-container">
        <nav class="bx-breadcrumb lx-noprint" aria-label="Fil d'Ariane">
          <a routerLink="/">Accueil</a><span aria-hidden="true">/</span><a routerLink="/lecons">Leçons</a><span aria-hidden="true">/</span><span>Ma séance</span>
        </nav>
        <h1>Ma séance</h1>
        <p>Durée totale estimée : <strong>{{ total() }}</strong> (échauffement et retour au calme compris).</p>
      </div>
    </section>

    <section class="bx-section bx-section--tight">
      <div class="bx-container lx-session">
        <div class="lx-notice" role="note">Ateliers sans contact ni impact, à valider par un entraîneur du club ; contenu non validé par la FFBoxe.</div>

        <ol class="lx-session__list">
          <li class="lx-session__item lx-session__item--fixed bx-card">
            <span class="lx-session__time">{{ warmup }} min</span>
            <div><strong>Échauffement</strong><p>Mobilisation articulaire, corde ou montées de genoux, shadow léger en garde.</p></div>
          </li>
          @for (l of lessons(); track l.id; let first = $first; let last = $last) {
            <li class="lx-session__item bx-card">
              <span class="lx-session__time">{{ l.durationMin }} min</span>
              <div>
                <a [routerLink]="['/lecons', l.slug]"><strong>{{ l.id }}. {{ l.title }}</strong></a>
                <p>{{ l.objective }}</p>
              </div>
              <div class="lx-session__actions lx-noprint">
                <button type="button" class="lx-iconbtn" [disabled]="first" (click)="progress.moveInSession(l.id, -1)" [attr.aria-label]="'Monter ' + l.title">↑</button>
                <button type="button" class="lx-iconbtn" [disabled]="last" (click)="progress.moveInSession(l.id, 1)" [attr.aria-label]="'Descendre ' + l.title">↓</button>
                <button type="button" class="lx-iconbtn" (click)="progress.removeFromSession(l.id)" [attr.aria-label]="'Retirer ' + l.title">✕</button>
              </div>
            </li>
          } @empty {
            <li class="bx-empty lx-noprint">
              <strong>Aucune leçon dans votre séance</strong>
              <p>Ajoutez des leçons depuis leur fiche (« Ajouter à ma séance »).</p>
              <a routerLink="/lecons" class="bx-btn bx-btn--primary bx-btn--sm">Parcourir les leçons</a>
            </li>
          }
          <li class="lx-session__item lx-session__item--fixed bx-card">
            <span class="lx-session__time">{{ cooldown }} min</span>
            <div><strong>Retour au calme</strong><p>Marche, respiration lente, étirements doux et bilan de la séance.</p></div>
          </li>
        </ol>

        <div class="lx-session__footer lx-noprint">
          <button type="button" class="bx-btn bx-btn--primary" (click)="print()">Imprimer la séance</button>
          @if (lessons().length) {
            <button type="button" class="bx-btn bx-btn--outline" (click)="progress.clearSession()">Vider la séance</button>
          }
          <a routerLink="/chrono" class="bx-link">Ouvrir le chrono</a>
        </div>
      </div>
    </section>
  `,
  styleUrl: './lessons.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class LessonSessionComponent {
  protected readonly progress = inject(LessonProgressService);
  protected readonly warmup = SESSION_WARMUP_MIN;
  protected readonly cooldown = SESSION_COOLDOWN_MIN;

  protected readonly lessons = computed(() =>
    this.progress
      .session()
      .map((id) => LESSONS.find((l) => l.id === id))
      .filter((l): l is Lesson => !!l),
  );
  protected readonly total = computed(() => formatMinutes(sessionDuration(this.lessons())));

  protected print(): void {
    window.print();
  }
}
