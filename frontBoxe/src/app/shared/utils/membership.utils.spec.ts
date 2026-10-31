import { ageOn, currentSeason, isMinor, isPlausibleBirthDate, parseDay } from './membership.utils';
import { membershipSteps } from '../../features/membership/membership.component';

describe('membership.utils — calcul du mineur', () => {
  const ref = new Date(2026, 9, 31); // 31 octobre 2026

  it('calcule l’âge révolu, anniversaire compris', () => {
    expect(ageOn('2008-10-31', ref)).toBe(18);
    expect(ageOn('2008-11-01', ref)).toBe(17);
    expect(ageOn('2015-03-10', ref)).toBe(11);
  });

  it('est mineur la veille de ses 18 ans, majeur le jour J', () => {
    expect(isMinor('2008-11-01', ref)).toBeTrue();
    expect(isMinor('2008-10-31', ref)).toBeFalse();
    expect(isMinor('1990-01-01', ref)).toBeFalse();
  });

  it('gère le 29 février et les dates ISO avec heure', () => {
    expect(ageOn('2012-02-29', new Date(2030, 1, 28))).toBe(17);
    expect(ageOn('2012-02-29', new Date(2030, 2, 1))).toBe(18);
    expect(ageOn('2000-05-12T00:00:00+02:00', ref)).toBe(26);
  });

  it('ne considère pas une date vide ou invalide comme mineure', () => {
    expect(isMinor('', ref)).toBeFalse();
    expect(isMinor(null, ref)).toBeFalse();
    expect(parseDay('2026-02-30')).toBeNull();
    expect(ageOn('n/a', ref)).toBeNull();
  });

  it('rejette les dates de naissance invraisemblables', () => {
    expect(isPlausibleBirthDate('2030-01-01', ref)).toBeFalse();
    expect(isPlausibleBirthDate('1900-01-01', ref)).toBeFalse();
    expect(isPlausibleBirthDate('2016-06-01', ref)).toBeTrue();
  });

  it('donne la saison sportive (bascule en août)', () => {
    expect(currentSeason(new Date(2026, 9, 31))).toBe('2026-2027');
    expect(currentSeason(new Date(2027, 2, 1))).toBe('2026-2027');
    expect(currentSeason(new Date(2027, 7, 1))).toBe('2027-2028');
  });

  it('ajoute l’étape « Responsable légal » seulement pour un mineur', () => {
    expect(membershipSteps(true)).toEqual(['identite', 'pratique', 'responsable', 'validation']);
    expect(membershipSteps(false)).toEqual(['identite', 'pratique', 'validation']);
  });
});
