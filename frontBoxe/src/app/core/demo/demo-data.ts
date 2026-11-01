/**
 * Données FICTIVES de la bêta de démonstration (build `demo`, sans API).
 * Noms, palmarès, tarifs et dates sont inventés : à remplacer par les vraies données du club.
 */
import {
  Article, ArticleComment, Boxer, ClubInfo, Coach, DisciplineDetail, Fight, GalaDetail,
  Partner, Pricing, TrainingSlot, Venue,
} from '../api/models';

const day = (offset: number, hour = 19) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

export const DEMO_CLUB: ClubInfo = {
  name: 'ESC Boxe Tergnier',
  tagline: 'Boxe anglaise, éducative, loisir et féminine à Tergnier, dans l’Aisne.',
  foundedYear: 2008,
  stats: { members: 142, boxers: 8, coaches: 3, titles: 25 },
  address: 'Complexe sportif Léo Lagrange, rue Albert Camus, 02700 Tergnier',
  phone: '06 23 24 69 18',
  email: 'esctergnier.boxe@sfr.fr',
  socials: { facebook: null, instagram: null, youtube: null },
  openingHours: 'Du lundi au vendredi de 17 h 30 à 21 h, le samedi de 10 h à 12 h (hors vacances scolaires).',
};

export const DEMO_VENUES: Venue[] = [
  { id: 1, name: 'Complexe sportif Léo Lagrange', address: 'Rue Albert Camus', postalCode: '02700', city: 'Tergnier',
    latitude: 49.6553, longitude: 3.3010, description: 'Complexe sportif de Tergnier où le club organise ses galas. Salle d’entraînement à confirmer avec le club.', photo: 'img/training1.jpg' },
];

const coachRefs = [
  { id: 1, firstName: 'Camille', lastName: 'Démo', slug: 'camille-demo' },
  { id: 2, firstName: 'Karim', lastName: 'Démo', slug: 'karim-demo' },
  { id: 3, firstName: 'Julie', lastName: 'Démo', slug: 'julie-demo' },
];

const disc = [
  { id: 1, name: 'Boxe anglaise', slug: 'boxe-anglaise' },
  { id: 2, name: 'Boxe éducative', slug: 'boxe-educative' },
  { id: 3, name: 'Boxe loisir', slug: 'boxe-loisir' },
  { id: 4, name: 'Boxe féminine', slug: 'boxe-feminine' },
];

export const DEMO_COACHES: Coach[] = [
  { ...coachRefs[0], role: 'Entraîneur principal', bio: 'Profil fictif : 20 ans de ring, diplômé d’État.', photo: 'img/champreg1.jpg',
    diplomas: 'DEJEPS boxe (fictif)', disciplines: [disc[0], disc[1]], position: 0 },
  { ...coachRefs[1], role: 'Entraîneur compétition', bio: 'Profil fictif : prépare les amateurs aux championnats.', photo: 'img/champreg2.jpg',
    diplomas: 'BPJEPS (fictif)', disciplines: [disc[0]], position: 1 },
  { ...coachRefs[2], role: 'Coach loisir et féminine', bio: 'Profil fictif : cours loisir, cardio-boxe et féminine.', photo: 'img/champdep1.jpg',
    diplomas: 'Moniteur fédéral (fictif)', disciplines: [disc[2], disc[3]], position: 2 },
];

const venueRef = { id: 1, name: 'Salle de boxe — démonstration', city: 'Tergnier' };
const slot = (id: number, dayOfWeek: number, startTime: string, endTime: string, d: number, audience: TrainingSlot['audience'], c: number): TrainingSlot =>
  ({ id, dayOfWeek, startTime, endTime, discipline: disc[d], audience, coach: coachRefs[c], venue: venueRef });

export const DEMO_PLANNING: TrainingSlot[] = [
  slot(1, 1, '17:30', '18:30', 1, 'enfants', 0),
  slot(2, 1, '18:30', '20:00', 0, 'adultes', 0),
  slot(3, 2, '18:00', '19:30', 3, 'feminin', 2),
  slot(4, 3, '14:00', '15:30', 1, 'enfants', 2),
  slot(5, 3, '18:30', '20:30', 0, 'competiteurs', 1),
  slot(6, 4, '18:00', '19:30', 2, 'adultes', 2),
  slot(7, 5, '17:30', '18:30', 1, 'ados', 0),
  slot(8, 5, '18:30', '20:30', 0, 'competiteurs', 1),
  slot(9, 6, '10:00', '12:00', 2, 'tous', 2),
];

const discInfo: [string, string, number, string][] = [
  ['Technique, déplacements, précision : la boxe anglaise loisir et compétition.', 'Boxe anglaise', 14, 'img/training1.jpg'],
  ['Apprendre à boxer sans recherche de puissance, dans le respect de l’autre.', 'Boxe éducative', 6, 'img/eduTergnier1.jpg'],
  ['Cardio, coordination et technique sans combat, à son rythme.', 'Boxe loisir', 16, 'img/training3.jpg'],
  ['Un créneau dédié aux femmes, tous niveaux.', 'Boxe féminine', 14, 'img/training2.jpg'],
];

export const DEMO_DISCIPLINES: DisciplineDetail[] = disc.map((d, i) => ({
  ...d,
  shortDescription: discInfo[i][0],
  description: `<p>${discInfo[i][0]}</p><p><em>Bêta : contenu de démonstration, modalités à confirmer avec le club.</em></p>`,
  icon: null,
  image: discInfo[i][3],
  minAge: discInfo[i][2],
  position: i,
  slots: DEMO_PLANNING.filter((s) => s.discipline.slug === d.slug),
  coaches: DEMO_COACHES.filter((c) => c.disciplines.some((x) => x.slug === d.slug)),
}));

export const DEMO_PRICING: Pricing[] = [
  { id: 1, label: 'Boxe éducative (6-13 ans)', audience: 'Enfants', priceCents: 9000, period: 'saison', description: 'Licence comprise (tarif fictif).', highlighted: false, position: 0 },
  { id: 2, label: 'Ados (14-17 ans)', audience: 'Ados', priceCents: 12000, period: 'saison', description: 'Licence comprise (tarif fictif).', highlighted: false, position: 1 },
  { id: 3, label: 'Adultes', audience: 'Adultes', priceCents: 15000, period: 'saison', description: 'Accès à tous les créneaux adultes (tarif fictif).', highlighted: true, position: 2 },
  { id: 4, label: 'Séance d’essai', audience: 'Tous', priceCents: 0, period: 'seance', description: 'Gratuite, gants prêtés.', highlighted: false, position: 3 },
];

export const DEMO_PARTNERS: Partner[] = [
  { id: 1, name: 'Partenaire de démonstration', logo: null, url: null, position: 0 },
  { id: 2, name: 'Ville de Tergnier (exemple)', logo: null, url: null, position: 1 },
];

// Galas et combats ----------------------------------------------------------------
type GalaSeed = Omit<GalaDetail, 'fights'>;
const galaSeeds: GalaSeed[] = [
  { id: 1, title: 'Gala de Noël — démonstration', slug: 'gala-noel-demo', type: 'gala', startsAt: day(41), endsAt: null,
    venue: 'Complexe sportif Léo Lagrange', address: 'Complexe sportif', city: 'Tergnier',
    description: '<p>Gala fictif : 8 combats amateurs et éducatifs. Aucune billetterie réelle.</p>', poster: 'img/galaFight.jpg', ticketUrl: null, price: 1000 },
  { id: 2, title: 'Stage vacances — démonstration', slug: 'stage-vacances-demo', type: 'stage', startsAt: day(52, 10), endsAt: day(54, 16),
    venue: 'Complexe sportif Léo Lagrange', address: null, city: 'Tergnier',
    description: '<p>Stage fictif de 3 jours, ouvert aux 8-16 ans.</p>', poster: 'img/eduTergnier2.jpg', ticketUrl: null, price: 0 },
  { id: 3, title: 'Championnat régional — démonstration', slug: 'championnat-regional-demo', type: 'competition', startsAt: day(75, 9), endsAt: null,
    venue: null, address: null, city: 'Saint-Quentin',
    description: '<p>Compétition fictive : trois boxeurs du club engagés.</p>', poster: 'img/champreg3.jpg', ticketUrl: null, price: null },
  { id: 4, title: 'Gala amateurs & pros — démonstration', slug: 'gala-amapro-demo', type: 'gala', startsAt: day(-21), endsAt: null,
    venue: 'Complexe sportif Léo Lagrange', address: null, city: 'Tergnier',
    description: '<p>Gala fictif passé : résultats de démonstration.</p>', poster: 'img/galaAmaPro1.jpg', ticketUrl: null, price: 1200 },
  { id: 5, title: 'Championnat départemental — démonstration', slug: 'championnat-dep-demo', type: 'competition', startsAt: day(-60, 9), endsAt: null,
    venue: null, address: null, city: 'Laon',
    description: '<p>Compétition fictive passée.</p>', poster: 'img/champdep2.jpg', ticketUrl: null, price: null },
];
const evt = (g: GalaSeed) => ({ id: g.id, title: g.title, slug: g.slug });

// Boxeurs ------------------------------------------------------------------------
type BoxerSeed = Omit<Boxer, 'fights' | 'record' | 'wins' | 'losses' | 'draws' | 'kos'>;
const boxerSeeds: BoxerSeed[] = [
  { id: 1, firstName: 'Alex', lastName: 'Démo', slug: 'alex-demo', nickname: 'La Fusée', sex: 'M', weightKg: 63.5, weightClass: '-63,5 kg', level: 'elite', discipline: disc[0], photo: 'img/champreg4.jpg', featured: true, bio: 'Boxeur fictif, champion régional (démonstration).', active: true },
  { id: 2, firstName: 'Sam', lastName: 'Démo', slug: 'sam-demo', nickname: null, sex: 'F', weightKg: 57, weightClass: '-57 kg', level: 'amateur', discipline: disc[0], photo: 'img/champtergnier1.jpg', featured: true, bio: 'Boxeuse fictive, vice-championne départementale (démonstration).', active: true },
  { id: 3, firstName: 'Yanis', lastName: 'Démo', slug: 'yanis-demo', nickname: 'Le Mur', sex: 'M', weightKg: 80, weightClass: '-80 kg', level: 'pro', discipline: disc[0], photo: 'img/galaAmaPro2.jpg', featured: true, bio: 'Boxeur pro fictif (démonstration).', active: true },
  { id: 4, firstName: 'Inès', lastName: 'Démo', slug: 'ines-demo', nickname: null, sex: 'F', weightKg: 51, weightClass: '-51 kg', level: 'amateur', discipline: disc[0], photo: 'img/champdep3.jpg', featured: false, bio: 'Boxeuse fictive (démonstration).', active: true },
  { id: 5, firstName: 'Noah', lastName: 'Démo', slug: 'noah-demo', nickname: null, sex: 'M', weightKg: 42, weightClass: '-42 kg', level: 'educatif', discipline: disc[1], photo: 'img/eduTergnier1.jpg', featured: false, bio: 'Jeune boxeur éducatif fictif (démonstration).', active: true },
  { id: 6, firstName: 'Lina', lastName: 'Démo', slug: 'lina-demo', nickname: null, sex: 'F', weightKg: 38, weightClass: '-38 kg', level: 'educatif', discipline: disc[1], photo: 'img/eduTergnier2.jpg', featured: false, bio: 'Jeune boxeuse éducative fictive (démonstration).', active: true },
  { id: 7, firstName: 'Mehdi', lastName: 'Démo', slug: 'mehdi-demo', nickname: 'Uppercut', sex: 'M', weightKg: 71, weightClass: '-71 kg', level: 'elite', discipline: disc[0], photo: 'img/galaAmaPro3.jpg', featured: true, bio: 'Boxeur élite fictif (démonstration).', active: true },
  { id: 8, firstName: 'Tom', lastName: 'Démo', slug: 'tom-demo', nickname: null, sex: 'M', weightKg: 92, weightClass: '+92 kg', level: 'amateur', discipline: disc[0], photo: 'img/glaAmaPro4.jpg', featured: false, bio: 'Boxeur fictif (démonstration).', active: true },
];

const opponents = ['Boxing Club Laon (fictif)', 'Ring Saint-Quentin (fictif)', 'BC Soissons (fictif)', 'Chauny Boxe (fictif)'];
let fightId = 1;
const fightsFor = (b: BoxerSeed, i: number): Fight[] => {
  if (b.level === 'educatif') return [];
  const results: Fight['result'][] = ['victoire', 'victoire', i % 3 === 0 ? 'defaite' : 'victoire', i % 4 === 1 ? 'nul' : 'victoire'];
  const methods: Fight['method'][] = ['points', 'ko', 'points', 'tko'];
  const past = [galaSeeds[3], galaSeeds[4]];
  return results.slice(0, 2 + (i % 3)).map((result, k) => {
    const g = past[k % 2];
    return { id: fightId++, date: day(-21 - k * 39), opponent: `Adversaire ${k + 1}`, opponentClub: opponents[(i + k) % 4],
      location: g.city, event: evt(g), result, method: result === 'nul' ? 'points' : methods[k], rounds: 3,
      boxer: { id: b.id, firstName: b.firstName, lastName: b.lastName, slug: b.slug } };
  });
};

export const DEMO_BOXERS: Boxer[] = boxerSeeds.map((b, i) => {
  const fights = fightsFor(b, i);
  const record = {
    wins: fights.filter((f) => f.result === 'victoire').length,
    losses: fights.filter((f) => f.result === 'defaite').length,
    draws: fights.filter((f) => f.result === 'nul').length,
    kos: fights.filter((f) => f.result === 'victoire' && (f.method === 'ko' || f.method === 'tko')).length,
  };
  return { ...b, ...record, record, fights };
});

export const DEMO_GALAS: GalaDetail[] = galaSeeds.map((g) => ({
  ...g,
  fights: DEMO_BOXERS.flatMap((b) => b.fights).filter((f) => f.event?.slug === g.slug),
}));

// Actualités ----------------------------------------------------------------------
const art = (id: number, title: string, category: Article['category'], cover: string, ago: number, excerpt: string): Article => ({
  id, title, slug: `actu-demo-${id}`, excerpt, coverImage: cover, category, publishedAt: day(-ago, 10),
  content: `<p>${excerpt}</p><p>Cette actualité est <strong>fictive</strong> : elle sert à montrer la mise en page de la bêta.</p>`,
  author: 'Bureau du club',
});

export const DEMO_ARTICLES: Article[] = [
  art(1, 'Reprise de la saison : les inscriptions sont ouvertes', 'club', 'img/training1.jpg', 2, 'La nouvelle saison démarre, séance d’essai gratuite pour tous.'),
  art(2, 'Trois médailles au championnat départemental', 'competition', 'img/champdep1.jpg', 9, 'Belle moisson pour nos amateurs ce week-end (démonstration).'),
  art(3, 'Retour en images sur le gala amateurs & pros', 'gala', 'img/galaAmaPro1.jpg', 20, 'Une salle comble et des combats de haut niveau (démonstration).'),
  art(4, 'Stage de boxe éducative pendant les vacances', 'stage', 'img/eduTergnier2.jpg', 31, 'Trois jours pour découvrir la boxe en s’amusant (démonstration).'),
  art(5, 'Le créneau féminin affiche complet', 'vie-du-club', 'img/training2.jpg', 45, 'Le mardi soir, la boxe se conjugue au féminin (démonstration).'),
  art(6, 'Nos jeunes en stage à Deauville', 'stage', 'img/deauville1.jpg', 70, 'Un séjour sportif au bord de la mer (démonstration).'),
];

export const DEMO_COMMENTS: Record<string, ArticleComment[]> = {
  'actu-demo-1': [
    { id: 1, body: 'Super nouvelle, mon fils a hâte de reprendre !', createdAt: day(-1, 20), author: { firstName: 'Nadia', lastName: 'D.' }, status: 'publie' },
  ],
};
