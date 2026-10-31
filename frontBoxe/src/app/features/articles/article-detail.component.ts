import { Component, computed, effect, inject, input, signal, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { apiErrorMessage, apiViolations } from '../../core/api/api.service';
import { ArticleService } from '../../core/api/article.service';
import { ARTICLE_CATEGORIES, Article, ArticleComment } from '../../core/api/models';
import { AuthService } from '../../core/auth/auth.service';
import { SeoService } from '../../core/seo/seo.service';
import { LoadErrorComponent } from '../../shared/components/state/state.component';
import { MediaPipe } from '../../shared/pipes/media.pipe';
import { labelOf } from '../../shared/utils/format.utils';
import { createLoader } from '../../shared/utils/loader';

@Component({
  selector: 'app-article-detail',
  imports: [RouterLink, DatePipe, MediaPipe, ReactiveFormsModule, LoadErrorComponent],
  templateUrl: './article-detail.component.html',
  styleUrl: './article-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ArticleDetailComponent {
  private readonly api = inject(ArticleService);
  private readonly seo = inject(SeoService);
  protected readonly auth = inject(AuthService);
  protected readonly router = inject(Router);

  readonly slug = input.required<string>();
  protected readonly article = createLoader<Article>();
  protected readonly comments = createLoader<ArticleComment[]>();
  protected readonly category = computed(() => labelOf(ARTICLE_CATEGORIES, this.article.data()?.category));
  protected readonly author = computed(() => {
    const a = this.article.data()?.author;
    if (!a) return null;
    return typeof a === 'string' ? a : `${a.firstName} ${a.lastName}`.trim();
  });

  protected readonly form = inject(NonNullableFormBuilder).group({
    body: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(2000)]],
  });
  protected readonly sending = signal(false);
  protected readonly commentError = signal<string | null>(null);
  protected readonly pending = signal(false);

  constructor() {
    effect(() => {
      const slug = this.slug();
      this.pending.set(false);
      this.article.run(() => this.api.get(slug));
      this.comments.run(() => this.api.comments(slug).pipe(map((res) => (Array.isArray(res) ? res : res.items))));
    });
    effect(() => {
      const a = this.article.data();
      if (a) {
        this.seo.update({ title: `${a.title} — ESC Boxe Tergnier`, description: a.excerpt, type: 'article', image: a.coverImage });
      }
    });
  }

  protected authorName(c: ArticleComment): string {
    return c.author ? `${c.author.firstName} ${c.author.lastName}`.trim() : 'Membre';
  }

  protected submitComment(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.sending.set(true);
    this.commentError.set(null);
    this.api.addComment(this.slug(), this.form.getRawValue().body.trim()).subscribe({
      next: (comment) => {
        this.sending.set(false);
        this.form.reset();
        if (comment?.status && comment.status !== 'en_attente') {
          this.comments.data.update((list) => [...(list ?? []), comment]);
        } else {
          this.pending.set(true);
        }
      },
      error: (err: unknown) => {
        this.sending.set(false);
        this.commentError.set(apiViolations(err)['body'] ?? apiErrorMessage(err, "Le commentaire n'a pas pu être envoyé."));
      },
    });
  }
}
