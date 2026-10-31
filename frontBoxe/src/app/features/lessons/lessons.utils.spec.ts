import { Lesson } from './lessons.model';
import { filterLessons, findLessonRef, formatMinutes, neighbours, normalize, sessionDuration } from './lessons.utils';

function lesson(id: number, over: Partial<Lesson> = {}): Lesson {
  return {
    id,
    slug: `lecon-${id}`,
    module: 1,
    title: `Leçon ${id}`,
    level: 'découverte',
    durationMin: 15,
    objective: 'Objectif',
    prerequisites: [],
    organisation: { space: 'Salle', material: [], groups: 'Binômes' },
    schema: { kind: 'appuis', phases: ['a', 'b', 'c'] },
    steps: ['1', '2', '3', '4', '5'],
    decision: 'Choisir',
    corrections: [],
    criteria: ['x', 'y', 'z'],
    adaptations: { enfants: 'jeu', ados: 'défi', jeunesAdultes: 'tempo' },
    safety: 'Sans contact',
    ...over,
  };
}

const DATA: Lesson[] = [
  lesson(1, { title: 'Garde et appuis' }),
  lesson(2, { title: 'Pas chassés', level: 'intermédiaire' }),
  lesson(11, { module: 2, title: 'Direct – crochet', objective: 'Enchaîner deux coups dans le vide' }),
  lesson(21, { module: 3, title: 'Esquive rotative', level: 'avancé', adaptations: { enfants: 'sous la corde', ados: '', jeunesAdultes: '' } }),
];

describe('lessons.utils', () => {
  it('normalise accents et casse', () => {
    expect(normalize('  Échauffement ÉLÈVE ')).toBe('echauffement eleve');
  });

  it('filtre par module et niveau', () => {
    expect(filterLessons(DATA, { module: 1 }).map((l) => l.id)).toEqual([1, 2]);
    expect(filterLessons(DATA, { level: 'avancé' }).map((l) => l.id)).toEqual([21]);
    expect(filterLessons(DATA, { module: 1, level: 'intermédiaire' }).map((l) => l.id)).toEqual([2]);
  });

  it('recherche sans accents dans titre, objectif et adaptations (tous les mots)', () => {
    expect(filterLessons(DATA, { query: 'enchainer vide' }).map((l) => l.id)).toEqual([11]);
    expect(filterLessons(DATA, { query: 'CORDE' }).map((l) => l.id)).toEqual([21]);
    expect(filterLessons(DATA, { query: 'garde inexistant' })).toEqual([]);
  });

  it('filtre les favoris', () => {
    expect(filterLessons(DATA, { onlyFavorites: true, favorites: new Set([2, 21]) }).map((l) => l.id)).toEqual([2, 21]);
  });

  it('retrouve un prérequis par slug ou par titre', () => {
    expect(findLessonRef(DATA, 'lecon-2')?.id).toBe(2);
    expect(findLessonRef(DATA, 'garde et appuis')?.id).toBe(1);
    expect(findLessonRef(DATA, 'Savoir sauter')).toBeUndefined();
  });

  it('donne les leçons voisines', () => {
    expect(neighbours(DATA, 2).prev?.id).toBe(1);
    expect(neighbours(DATA, 2).next?.id).toBe(11);
    expect(neighbours(DATA, 1).prev).toBeUndefined();
  });

  it('calcule la durée de séance (échauffement + retour au calme inclus)', () => {
    expect(sessionDuration([])).toBe(15);
    expect(sessionDuration([{ durationMin: 20 }, { durationMin: 30 }])).toBe(65);
    expect(formatMinutes(65)).toBe('1 h 05');
    expect(formatMinutes(45)).toBe('45 min');
  });
});
