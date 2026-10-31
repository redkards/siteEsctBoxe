import { Component, OnInit, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ArticleService } from '../../core/api/article.service';
import { BoxerService } from '../../core/api/boxer.service';
import { ClubService } from '../../core/api/club.service';
import { GalaService } from '../../core/api/gala.service';
import {
  AUDIENCES,
  ArticleSummary,
  BoxerSummary,
  ClubInfo,
  Discipline,
  GALA_TYPES,
  Gala,
  Paginated,
  Partner,
  TrainingSlot,
} from '../../core/api/models';
import { ArticleCardComponent } from '../../shared/components/article-card/article-card.component';
import { BoxerCardComponent } from '../../shared/components/boxer-card/boxer-card.component';
import { CountdownComponent } from '../../shared/components/countdown/countdown.component';
import { LoadErrorComponent, SkeletonGridComponent } from '../../shared/components/state/state.component';
import { HourPipe } from '../../shared/pipes/time.pipe';
import { MediaPipe } from '../../shared/pipes/media.pipe';
import { labelOf } from '../../shared/utils/format.utils';
import { createLoader } from '../../shared/utils/loader';
import { DAYS, isoDay, slotsOfDay } from '../../shared/utils/planning.utils';

/** Accueil : hero, chiffres clés, prochain gala, disciplines, boxeurs, planning du jour, actus, partenaires */
@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    DatePipe,
    HourPipe,
    MediaPipe,
    CountdownComponent,
    BoxerCardComponent,
    ArticleCardComponent,
    SkeletonGridComponent,
    LoadErrorComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class HomeComponent implements OnInit {
  private readonly clubApi = inject(ClubService);
  private readonly boxersApi = inject(BoxerService);
  private readonly galasApi = inject(GalaService);
  private readonly articlesApi = inject(ArticleService);

  protected readonly club = createLoader<ClubInfo>();
  protected readonly galas = createLoader<Paginated<Gala>>();
  protected readonly disciplines = createLoader<Discipline[]>();
  protected readonly boxers = createLoader<BoxerSummary[]>();
  protected readonly planning = createLoader<TrainingSlot[]>();
  protected readonly articles = createLoader<Paginated<ArticleSummary>>();
  protected readonly partners = createLoader<Partner[]>();

  protected readonly nextGala = computed(() => this.galas.data()?.items[0] ?? null);
  protected readonly nextGalaType = computed(() => labelOf(GALA_TYPES, this.nextGala()?.type));
  protected readonly today = DAYS[isoDay() - 1];
  /** Photos du club utilisées si une discipline n'a pas d'image */
  protected readonly fallbackPhotos = ['img/eduTergnier2.jpg', 'img/training1.jpg', 'img/champtergnier2.jpg', 'img/galaAmaPro3.jpg', 'img/festi2.jpeg'];
  protected readonly todaySlots = computed(() => slotsOfDay(this.planning.data() ?? []));
  /** S'il n'y a pas cours aujourd'hui : prochain jour avec des créneaux */
  protected readonly nextDay = computed(() => {
    const slots = this.planning.data() ?? [];
    for (let i = 1; i <= 7; i++) {
      const day = ((isoDay() - 1 + i) % 7) + 1;
      const list = slotsOfDay(slots, day);
      if (list.length) return { day: DAYS[day - 1], slots: list };
    }
    return null;
  });

  protected readonly stats = computed(() => {
    const c = this.club.data();
    if (!c) return [];
    return [
      { value: c.stats.members, label: 'licenciés' },
      { value: c.stats.boxers, label: 'boxeurs en compétition' },
      { value: c.stats.coaches, label: 'coachs diplômés' },
      { value: c.stats.titles, label: 'titres remportés' },
    ];
  });
  protected readonly years = computed(() => {
    const founded = this.club.data()?.foundedYear;
    return founded ? new Date().getFullYear() - founded : null;
  });

  protected audience(value: string): string {
    return labelOf(AUDIENCES, value as never);
  }

  ngOnInit(): void {
    this.club.run(() => this.clubApi.getClub());
    this.galas.run(() => this.galasApi.list({ when: 'upcoming', limit: 1 }));
    this.disciplines.run(() => this.clubApi.getDisciplines());
    this.boxers.run(() => this.boxersApi.featured());
    this.planning.run(() => this.clubApi.getPlanning());
    this.articles.run(() => this.articlesApi.list({ limit: 3 }));
    this.partners.run(() => this.clubApi.getPartners());
  }
}
