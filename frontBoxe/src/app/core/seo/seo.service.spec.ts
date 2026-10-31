import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, SeoService, summarize } from './seo.service';

describe('SeoService', () => {
  let service: SeoService;
  let meta: Meta;
  let title: Title;

  const content = (selector: string) => meta.getTag(selector)?.content;

  beforeEach(() => {
    service = TestBed.inject(SeoService);
    meta = TestBed.inject(Meta);
    title = TestBed.inject(Title);
  });

  it('pose le titre, la meta description et l’Open Graph', () => {
    service.update({ title: 'Boxeurs — ESC Boxe Tergnier', description: 'Nos boxeurs et leur palmarès.', type: 'article' });

    expect(title.getTitle()).toBe('Boxeurs — ESC Boxe Tergnier');
    expect(content('name="description"')).toBe('Nos boxeurs et leur palmarès.');
    expect(content('property="og:title"')).toBe('Boxeurs — ESC Boxe Tergnier');
    expect(content('property="og:description"')).toBe('Nos boxeurs et leur palmarès.');
    expect(content('property="og:type"')).toBe('article');
    expect(content('property="og:locale"')).toBe('fr_FR');
  });

  it('utilise les valeurs par défaut du site', () => {
    service.update({});

    expect(title.getTitle()).toBe(DEFAULT_TITLE);
    expect(content('name="description"')).toBe(DEFAULT_DESCRIPTION);
    expect(content('property="og:type"')).toBe('website');
  });

  it('résume un texte long en moins de 160 caractères', () => {
    const long = 'La boxe est un sport de décisions. '.repeat(10);
    const summary = summarize(long);

    expect(summary.length).toBeLessThanOrEqual(160);
    expect(summary.endsWith('…')).toBeTrue();
    expect(summarize('  court\n texte ')).toBe('court texte');
  });
});
