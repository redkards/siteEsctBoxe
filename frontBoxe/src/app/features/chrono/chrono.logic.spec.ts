import { CHRONO_PRESETS, ChronoSettings, ChronoState, clamp, formatClock, initialState, start, tick, totalDuration } from './chrono.logic';

function run(state: ChronoState, s: ChronoSettings, seconds: number): { state: ChronoState; cues: string[] } {
  const cues: string[] = [];
  for (let i = 0; i < seconds; i++) {
    const r = tick(state, s);
    state = r.state;
    if (r.cue) cues.push(r.cue);
  }
  return { state, cues };
}

describe('chrono.logic', () => {
  const s: ChronoSettings = { rounds: 2, roundSec: 30, restSec: 15, prepSec: 10 };

  it('propose les trois préréglages demandés', () => {
    expect(CHRONO_PRESETS.map((p) => [p.rounds, p.roundSec, p.restSec])).toEqual([
      [3, 60, 60],
      [4, 120, 60],
      [3, 180, 60],
    ]);
  });

  it('démarre par 10 s de préparation', () => {
    expect(start(s)).toEqual({ phase: 'prep', round: 1, remaining: 10 });
    expect(start({ ...s, prepSec: 0 })).toEqual({ phase: 'round', round: 1, remaining: 30 });
  });

  it('enchaîne préparation → round → repos → round → fin avec les bons signaux', () => {
    let st = start(s);
    let r = run(st, s, 10);
    expect(r.state).toEqual({ phase: 'round', round: 1, remaining: 30 });
    expect(r.cues).toEqual(['start']);

    r = run(r.state, s, 30);
    expect(r.state).toEqual({ phase: 'rest', round: 1, remaining: 15 });
    expect(r.cues).toEqual(['warn', 'rest']);

    r = run(r.state, s, 15);
    expect(r.state).toEqual({ phase: 'round', round: 2, remaining: 30 });

    r = run(r.state, s, 30);
    expect(r.state.phase).toBe('done');
    expect(r.cues[r.cues.length - 1]).toBe('end');

    st = r.state;
    expect(tick(st, s).state).toBe(st); // reste figé une fois terminé
  });

  it('saute le repos si sa durée est nulle', () => {
    const noRest = { ...s, restSec: 0 };
    const r = run({ phase: 'round', round: 1, remaining: 1 }, noRest, 1);
    expect(r.state).toEqual({ phase: 'round', round: 2, remaining: 30 });
  });

  it('ne bouge pas à l’arrêt', () => {
    const idle = initialState();
    expect(tick(idle, s)).toEqual({ state: idle, cue: null });
  });

  it('calcule la durée totale et formate l’horloge', () => {
    expect(totalDuration({ rounds: 3, roundSec: 180, restSec: 60, prepSec: 10 })).toBe(10 + 540 + 120);
    expect(formatClock(185)).toBe('3:05');
    expect(formatClock(-3)).toBe('0:00');
    expect(clamp(99, 1, 15)).toBe(15);
    expect(clamp(NaN, 1, 15)).toBe(1);
  });
});
