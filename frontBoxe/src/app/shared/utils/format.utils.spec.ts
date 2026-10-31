import { formatEuros, openingLines, osmEmbed } from './format.utils';
import { countdownParts } from '../components/countdown/countdown.component';
import { recordShares } from '../../features/boxers/boxer-detail.component';

describe('format.utils', () => {
  it('formate les montants en centimes', () => {
    expect(formatEuros(15000).replace(/\s/g, ' ')).toBe('150 €');
    expect(formatEuros(1250).replace(/\s/g, ' ')).toBe('12,50 €');
    expect(formatEuros(null)).toBe('');
  });

  it('normalise les horaires d’ouverture', () => {
    expect(openingLines('Lundi : 18h-20h\nSamedi : 10h-12h')).toEqual([
      { label: 'Lundi', hours: '18h-20h' },
      { label: 'Samedi', hours: '10h-12h' },
    ]);
    expect(openingLines([{ day: 'Mardi', hours: '17h-21h' }])).toEqual([{ label: 'Mardi', hours: '17h-21h' }]);
    expect(openingLines(null)).toEqual([]);
  });

  it('construit une URL de carte OpenStreetMap', () => {
    expect(osmEmbed(49.65, 3.3)).toContain('marker=49.65,3.3');
  });

  it('calcule un compte à rebours jamais négatif', () => {
    const now = new Date('2026-10-31T10:00:00Z');
    expect(countdownParts('2026-11-02T12:30:15Z', now)).toEqual({ days: 2, hours: 2, minutes: 30, seconds: 15, done: false });
    expect(countdownParts('2026-10-01T00:00:00Z', now).done).toBeTrue();
  });

  it('calcule les parts du palmarès', () => {
    expect(recordShares({ wins: 6, losses: 3, draws: 1 })).toEqual({ wins: 60, draws: 10, losses: 30, total: 10 });
    expect(recordShares({ wins: 0, losses: 0, draws: 0 }).total).toBe(0);
  });
});
