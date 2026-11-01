import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ChronoComponent } from './chrono.component';
import { PREP_SEC } from './chrono.logic';

interface ChronoInternals {
  toggle(): void;
  state(): { phase: string; round: number; remaining: number };
}

describe('ChronoComponent', () => {
  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(2026, 10, 1, 10, 0, 0));
    TestBed.configureTestingModule({ imports: [ChronoComponent], providers: [provideRouter([])] });
  });

  afterEach(() => jasmine.clock().uninstall());

  it('rattrape les secondes réellement écoulées quand le minuteur est ralenti (onglet en arrière-plan)', () => {
    const fixture = TestBed.createComponent(ChronoComponent);
    const c = fixture.componentInstance as unknown as ChronoInternals;
    c.toggle();
    expect(c.state().phase).toBe('prep');

    // Un seul passage du minuteur après 25 s réelles (throttling navigateur)
    jasmine.clock().mockDate(new Date(2026, 10, 1, 10, 0, 25));
    jasmine.clock().tick(250);

    // 10 s de préparation puis 15 s de round : il reste 45 s sur le round 1 de 60 s
    expect(PREP_SEC).toBe(10);
    expect(c.state().phase).toBe('round');
    expect(c.state().round).toBe(1);
    expect(c.state().remaining).toBe(45);
    fixture.destroy();
  });
});
