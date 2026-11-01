import { Component, computed, input, ChangeDetectionStrategy } from '@angular/core';
import { SchemaKind } from './lessons.model';

const KIND_LABELS: Record<SchemaKind, string> = {
  appuis: 'empreintes de pieds et sens des déplacements d’appui',
  deplacement: 'trajectoire au sol',
  enchainement: 'séquence de cibles numérotées',
  defense: 'trajectoire annoncée et esquive',
  distance: 'deux partenaires et zones de distance',
  cooperation: 'deux partenaires et échanges',
};

/**
 * Schéma SVG en trois phases d'une leçon, selon `schema.kind`.
 * Chaque phase est un panneau 200×150 ; la variante dépend du type et de l'indice de phase.
 */
@Component({
  selector: 'app-lesson-schema',
  template: `
    <figure class="sc">
      <svg class="sc__svg" viewBox="0 0 660 190" role="img" [attr.aria-labelledby]="id + '-t ' + id + '-d'">
        <title [id]="id + '-t'">Schéma de l'atelier en trois phases</title>
        <desc [id]="id + '-d'">{{ desc() }}</desc>
        <defs>
          <marker [id]="id + '-a'" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" class="sc__head" />
          </marker>
        </defs>
        @for (p of [0, 1, 2]; track p) {
          <g [attr.transform]="'translate(' + (10 + p * 220) + ',10)'">
            <rect class="sc__panel" width="200" height="150" rx="10" />
            <text class="sc__num" x="12" y="24">{{ p + 1 }}</text>
            @switch (kind()) {
              @case ('appuis') {
                <g class="sc__foot"><ellipse [attr.cx]="80" [attr.cy]="90" rx="11" ry="20" /><ellipse [attr.cx]="120 + p * 8" [attr.cy]="70 - p * 6" rx="11" ry="20" /></g>
                <path class="sc__arrow" [attr.d]="p === 0 ? 'M60 125 L140 125' : p === 1 ? 'M80 60 L80 30' : 'M60 125 Q100 140 150 110'" [attr.marker-end]="url('a')" />
              }
              @case ('deplacement') {
                <path class="sc__arrow" [attr.d]="p === 0 ? 'M30 110 L170 110' : p === 1 ? 'M30 120 L100 50 L170 120' : 'M40 100 Q100 20 160 100 Q100 140 40 100'" [attr.marker-end]="url('a')" />
                <circle class="sc__dot" [attr.cx]="p === 2 ? 40 : 30" [attr.cy]="p === 0 ? 110 : p === 1 ? 120 : 100" r="7" />
              }
              @case ('enchainement') {
                @for (t of targets(p); track $index) {
                  <circle class="sc__target" [attr.cx]="t[0]" [attr.cy]="t[1]" r="15" />
                  <text class="sc__label" [attr.x]="t[0]" [attr.y]="t[1] + 5" text-anchor="middle">{{ $index + 1 }}</text>
                }
                <path class="sc__arrow sc__arrow--thin" [attr.d]="targetPath(p)" [attr.marker-end]="url('a')" />
              }
              @case ('defense') {
                <g class="sc__fig"><circle cx="140" cy="55" r="12" /><path d="M140 67 L140 115 M140 80 L125 95 M140 80 L155 95" /></g>
                <path class="sc__arrow sc__arrow--warn" d="M20 55 L110 55" stroke-dasharray="6 5" [attr.marker-end]="url('a')" />
                <path class="sc__arrow" [attr.d]="p === 0 ? 'M150 40 L175 30' : p === 1 ? 'M140 80 Q155 110 140 130' : 'M150 70 L180 100'" [attr.marker-end]="url('a')" />
              }
              @case ('distance') {
                <rect class="sc__zone sc__zone--far" x="25" y="40" width="150" height="80" rx="8" />
                <rect class="sc__zone" x="60" y="50" width="80" height="60" rx="8" />
                <g class="sc__fig"><circle [attr.cx]="45 + p * 15" cy="62" r="10" /><path [attr.d]="'M' + (45 + p * 15) + ' 72 L' + (45 + p * 15) + ' 112'" /></g>
                <g class="sc__fig sc__fig--alt"><circle cx="160" cy="62" r="10" /><path d="M160 72 L160 112" /></g>
                <path class="sc__arrow sc__arrow--thin" [attr.d]="'M' + (58 + p * 15) + ' 132 L148 132'" [attr.marker-end]="url('a')" [attr.marker-start]="url('a')" />
              }
              @case ('cooperation') {
                <g class="sc__fig"><circle cx="45" cy="60" r="10" /><path d="M45 70 L45 112" /></g>
                <g class="sc__fig sc__fig--alt"><circle cx="155" cy="60" r="10" /><path d="M155 70 L155 112" /></g>
                <path class="sc__arrow" d="M62 75 Q100 50 138 75" [attr.marker-end]="url('a')" />
                @if (p > 0) {
                  <path class="sc__arrow sc__arrow--alt" d="M138 100 Q100 125 62 100" [attr.marker-end]="url('a')" />
                }
                @if (p === 2) {
                  <text class="sc__label" x="100" y="140" text-anchor="middle">↻ rôles</text>
                }
              }
            }
            <text class="sc__caption" x="100" y="172" text-anchor="middle">{{ short(phases()[p]) }}</text>
          </g>
        }
      </svg>
      <figcaption>
        <ol class="sc__legend">
          @for (ph of phases(); track $index) {
            <li><strong>Phase {{ $index + 1 }}.</strong> {{ ph }}</li>
          }
        </ol>
      </figcaption>
    </figure>
  `,
  styles: `
    :host { display: block; }
    .sc { margin: 0; overflow-x: auto; -webkit-overflow-scrolling: touch; }
    .sc__svg { width: 100%; min-width: 560px; height: auto; display: block; }
    @media print { .sc { overflow: visible; } .sc__svg { min-width: 0; } }
    .sc__panel { fill: var(--bx-card); stroke: var(--bx-card-border); stroke-width: 1.5; }
    .sc__num { fill: var(--bx-primary); font: 700 18px var(--bx-font-display); }
    .sc__caption { fill: var(--bx-muted); font: 600 11px var(--bx-font-body); }
    .sc__label { fill: var(--bx-ink); font: 700 13px var(--bx-font-body); }
    .sc__head { fill: var(--bx-primary); }
    .sc__arrow { fill: none; stroke: var(--bx-primary); stroke-width: 3; stroke-linecap: round; }
    .sc__arrow--thin { stroke-width: 2; }
    .sc__arrow--warn { stroke: var(--bx-warning); }
    .sc__arrow--alt { stroke: var(--bx-info); }
    .sc__foot ellipse { fill: var(--bx-ink-soft); opacity: 0.85; }
    .sc__dot { fill: var(--bx-ink); }
    .sc__target { fill: var(--bx-primary-soft); stroke: var(--bx-primary); stroke-width: 2; }
    .sc__fig circle, .sc__fig path { fill: none; stroke: var(--bx-ink); stroke-width: 3; stroke-linecap: round; }
    .sc__fig--alt circle, .sc__fig--alt path { stroke: var(--bx-info); }
    .sc__zone { fill: var(--bx-primary-soft); stroke: var(--bx-primary); stroke-dasharray: 4 4; }
    .sc__zone--far { fill: var(--bx-surface); stroke: var(--bx-line); }
    .sc__legend { margin: 0.75rem 0 0; padding-left: 0; list-style: none; display: grid; gap: 0.3rem; color: var(--bx-ink-soft); font-size: 0.92rem; }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class LessonSchemaComponent {
  private static seq = 0;
  readonly kind = input.required<SchemaKind>();
  readonly phases = input.required<readonly [string, string, string] | string[]>();

  protected readonly id = `lx-sc-${++LessonSchemaComponent.seq}`;
  protected readonly desc = computed(() => `Schéma : ${KIND_LABELS[this.kind()] ?? ''}. ` + this.phases().map((p, i) => `Phase ${i + 1} : ${p}`).join('. '));

  protected url(name: string): string {
    return `url(#${this.id}-${name})`;
  }

  protected short(text: string | undefined): string {
    const t = text ?? '';
    return t.length > 30 ? t.slice(0, 29).trimEnd() + '…' : t;
  }

  /** Cibles : 2, 3 puis 4 coups selon la phase */
  protected targets(phase: number): [number, number][] {
    const all: [number, number][] = [[50, 60], [110, 50], [150, 95], [80, 115]];
    return all.slice(0, phase + 2);
  }

  protected targetPath(phase: number): string {
    const pts = this.targets(phase);
    return pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ');
  }
}
