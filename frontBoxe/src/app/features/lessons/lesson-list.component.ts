import { Component, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LESSON_MODULES, LessonLevel, ModuleId } from './lessons.model';
import { LESSONS } from './lessons.data';
import { LessonProgressService } from './lesson-progress.service';
import { LESSON_AUDIENCES, LESSON_LEVELS, LessonAudience, filterLessons } from './lessons.utils';

/** /lecons — Bibliothèque des 50 leçons : filtres, recherche, progression locale */
@Component({
  selector: 'app-lesson-list',
  imports: [RouterLink],
  templateUrl: './lesson-list.component.html',
  styleUrl: './lessons.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class LessonListComponent {
  protected readonly progress = inject(LessonProgressService);

  protected readonly modules = LESSON_MODULES;
  protected readonly levels = LESSON_LEVELS;
  protected readonly audiences = LESSON_AUDIENCES;
  protected readonly total = 50;

  protected readonly module = signal<ModuleId | null>(null);
  protected readonly level = signal<LessonLevel | null>(null);
  protected readonly audience = signal<LessonAudience>('enfants');
  protected readonly audienceLabel = computed(() => LESSON_AUDIENCES.find((a) => a.value === this.audience())?.label ?? '');
  protected readonly query = signal('');
  protected readonly onlyFavorites = signal(false);

  protected readonly lessons = computed(() =>
    filterLessons(LESSONS, {
      module: this.module(),
      level: this.level(),
      query: this.query(),
      onlyFavorites: this.onlyFavorites(),
      favorites: this.progress.favorites(),
    }),
  );

  protected readonly moduleStats = computed(() => {
    this.progress.done();
    return LESSON_MODULES.map((m) => {
      const ids = LESSONS.filter((l) => l.module === m.id).map((l) => l.id);
      const done = this.progress.countDone(ids);
      return { ...m, done, pct: Math.round((done / 10) * 100) };
    });
  });
  protected readonly globalDone = computed(() => this.progress.countDone(LESSONS.map((l) => l.id)));

  protected moduleTitle(id: ModuleId): string {
    return LESSON_MODULES.find((m) => m.id === id)?.title ?? '';
  }

  protected setQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected setLevel(event: Event): void {
    this.level.set(((event.target as HTMLSelectElement).value || null) as LessonLevel | null);
  }

  protected reset(): void {
    this.module.set(null);
    this.level.set(null);
    this.query.set('');
    this.onlyFavorites.set(false);
  }
}
