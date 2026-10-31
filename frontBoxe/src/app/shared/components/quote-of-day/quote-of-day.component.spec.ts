import { DAILY_QUOTES, quoteOfDay } from './quote-of-day.component';

describe('quoteOfDay', () => {
  it('compte 15 citations', () => {
    expect(DAILY_QUOTES.length).toBe(15);
  });

  it('reste stable dans la journée et change le lendemain', () => {
    const morning = quoteOfDay(new Date(2026, 10, 1, 8));
    expect(quoteOfDay(new Date(2026, 10, 1, 23, 59))).toBe(morning);
    expect(quoteOfDay(new Date(2026, 10, 2, 8))).not.toBe(morning);
  });

  it('fait le tour des 15 citations en 15 jours', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 15; i++) seen.add(quoteOfDay(new Date(2026, 10, 1 + i, 12)));
    expect(seen.size).toBe(15);
  });
});
