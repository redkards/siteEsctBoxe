import { TestBed } from '@angular/core/testing';
import { LESSONS_STORAGE_KEY, LessonProgressService } from './lesson-progress.service';

describe('LessonProgressService', () => {
  beforeEach(() => {
    localStorage.removeItem(LESSONS_STORAGE_KEY);
    TestBed.resetTestingModule();
  });
  afterEach(() => localStorage.removeItem(LESSONS_STORAGE_KEY));

  const create = () => TestBed.inject(LessonProgressService);

  it('bascule « faite » et « favori » et persiste dans esct_lessons', () => {
    const s = create();
    s.toggleDone(3);
    s.toggleFavorite(7);
    expect(s.isDone(3)).toBeTrue();
    expect(s.isFavorite(7)).toBeTrue();
    expect(s.doneCount()).toBe(1);
    const stored = JSON.parse(localStorage.getItem(LESSONS_STORAGE_KEY)!);
    expect(stored.done).toEqual([3]);
    expect(stored.favorites).toEqual([7]);
    s.toggleDone(3);
    expect(s.isDone(3)).toBeFalse();
  });

  it('recharge la progression enregistrée et ignore les valeurs invalides', () => {
    localStorage.setItem(LESSONS_STORAGE_KEY, JSON.stringify({ done: [1, 2, 2, 'x'], favorites: null, session: [4] }));
    const s = create();
    expect([...s.done()]).toEqual([1, 2]);
    expect(s.favorites().size).toBe(0);
    expect(s.session()).toEqual([4]);
  });

  it('résiste à un JSON corrompu', () => {
    localStorage.setItem(LESSONS_STORAGE_KEY, '{oops');
    expect(create().doneCount()).toBe(0);
  });

  it('gère la séance : ajout sans doublon, ordre, retrait', () => {
    const s = create();
    s.addToSession(1);
    s.addToSession(2);
    s.addToSession(1);
    s.addToSession(3);
    expect(s.session()).toEqual([1, 2, 3]);
    s.moveInSession(3, -1);
    expect(s.session()).toEqual([1, 3, 2]);
    s.moveInSession(1, -1); // déjà en tête : aucun effet
    expect(s.session()).toEqual([1, 3, 2]);
    s.removeFromSession(3);
    expect(s.session()).toEqual([1, 2]);
    s.clearSession();
    expect(s.session()).toEqual([]);
  });

  it('compte les leçons faites dans une liste', () => {
    const s = create();
    s.toggleDone(1);
    s.toggleDone(12);
    expect(s.countDone([1, 2, 3])).toBe(1);
    expect(s.countDone([1, 12])).toBe(2);
  });
});
