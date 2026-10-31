import { RegionalGala } from './agenda.data';

/** Galas à venir (date du jour incluse), triés chronologiquement */
export function upcomingGalas(list: readonly RegionalGala[], now: Date = new Date()): RegionalGala[] {
  const today = localIsoDate(now);
  return list.filter((g) => g.date >= today).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
}

export function filterGalas(list: readonly RegionalGala[], region: string | null, month: string | null): RegionalGala[] {
  return list.filter((g) => (!region || g.region === region) && (!month || g.date.slice(0, 7) === month));
}

export function localIsoDate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

/** Échappement des valeurs texte iCalendar (RFC 5545 §3.3.11) */
export function icsEscape(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
}

/** Repli des lignes à 75 octets (approximation en caractères) */
function fold(line: string): string {
  const out: string[] = [];
  let rest = line;
  while (rest.length > 74) {
    out.push(rest.slice(0, 74));
    rest = ' ' + rest.slice(74);
  }
  out.push(rest);
  return out.join('\r\n');
}

/** Fichier .ics d'un gala (heure locale Europe/Paris, durée 3 h par défaut) */
export function buildIcs(g: RegionalGala, stamp: Date = new Date(), durationH = 3): string {
  const [y, m, d] = g.date.split('-').map(Number);
  const [hh, mm] = g.time.split(':').map(Number);
  const startDt = `${g.date.replace(/-/g, '')}T${pad(hh)}${pad(mm)}00`;
  const end = new Date(Date.UTC(y, m - 1, d, hh + durationH, mm));
  const endDt = `${end.getUTCFullYear()}${pad(end.getUTCMonth() + 1)}${pad(end.getUTCDate())}T${pad(end.getUTCHours())}${pad(end.getUTCMinutes())}00`;
  const dtstamp = stamp.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const description = [g.note, `Source : ${g.source}`, 'Liste non exhaustive, à vérifier avant déplacement.'].filter(Boolean).join('\n');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ESC Boxe Tergnier//Agenda des galas//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${g.id}@esctboxe`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART;TZID=Europe/Paris:${startDt}`,
    `DTEND;TZID=Europe/Paris:${endDt}`,
    `SUMMARY:${icsEscape(`${g.title} — ${g.city}`)}`,
    `LOCATION:${icsEscape(`${g.city}, ${g.region}`)}`,
    `DESCRIPTION:${icsEscape(description)}`,
    `URL:${g.source}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
}

export function icsFileName(g: RegionalGala): string {
  return `gala-${g.id}.ics`;
}
