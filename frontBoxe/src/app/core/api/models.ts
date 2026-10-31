/**
 * Modèles de l'API ESCT Boxe v2 — miroir de docs/API.md (source de vérité).
 * Dates : chaînes ISO 8601. Montants : centimes (int). Images : URL absolue ou `/uploads/...`, nullable.
 */

export interface Paginated<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  pages: number;
}

/** Référence courte vers une entité liée (discipline, gala…) */
export interface SlugRef {
  id?: number;
  name: string;
  slug: string;
}

export interface PersonRef {
  id?: number;
  firstName: string;
  lastName: string;
  slug?: string;
}

// Club ------------------------------------------------------------------------
export interface ClubInfo {
  name: string;
  tagline: string;
  foundedYear: number;
  stats: { members: number; boxers: number; coaches: number; titles: number };
  address: string;
  phone: string;
  email: string;
  socials: { facebook: string | null; instagram: string | null; youtube: string | null };
}

// Actualités ------------------------------------------------------------------
export type ArticleCategory = 'club' | 'competition' | 'gala' | 'stage' | 'vie-du-club';

export const ARTICLE_CATEGORIES: { value: ArticleCategory; label: string }[] = [
  { value: 'club', label: 'Club' },
  { value: 'competition', label: 'Compétition' },
  { value: 'gala', label: 'Gala' },
  { value: 'stage', label: 'Stage' },
  { value: 'vie-du-club', label: 'Vie du club' },
];

export interface ArticleSummary {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  category: ArticleCategory;
  publishedAt: string;
}

export interface Article extends ArticleSummary {
  content: string;
  /** Nom affiché de l'auteur (chaîne) ou objet utilisateur selon la sérialisation */
  author: string | PersonRef | null;
}

// Disciplines, coachs, salles ------------------------------------------------
export interface Discipline {
  id: number;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  icon: string | null;
  image: string | null;
  minAge: number | null;
  position: number;
}

export interface DisciplineDetail extends Discipline {
  slots: TrainingSlot[];
  coaches: Coach[];
}

export interface Coach {
  id: number;
  firstName: string;
  lastName: string;
  slug: string;
  role: string | null;
  bio: string | null;
  photo: string | null;
  diplomas: string | null;
  disciplines: SlugRef[];
  position: number;
}

export interface Venue {
  id: number;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  photo: string | null;
}

// Planning --------------------------------------------------------------------
export type Audience = 'enfants' | 'ados' | 'adultes' | 'competiteurs' | 'feminin' | 'tous';

export const AUDIENCES: { value: Audience; label: string }[] = [
  { value: 'enfants', label: 'Enfants' },
  { value: 'ados', label: 'Ados' },
  { value: 'adultes', label: 'Adultes' },
  { value: 'competiteurs', label: 'Compétiteurs' },
  { value: 'feminin', label: 'Féminin' },
  { value: 'tous', label: 'Tous publics' },
];

export interface TrainingSlot {
  id: number;
  /** 1 = lundi … 7 = dimanche */
  dayOfWeek: number;
  /** "18:00" */
  startTime: string;
  endTime: string;
  discipline: SlugRef;
  audience: Audience;
  coach: PersonRef | null;
  venue: { id?: number; name: string; city: string };
}

// Boxeurs et palmarès ----------------------------------------------------------
export type Sex = 'M' | 'F';
export type BoxerLevel = 'educatif' | 'amateur' | 'elite' | 'pro';

export const BOXER_LEVELS: { value: BoxerLevel; label: string }[] = [
  { value: 'educatif', label: 'Éducatif' },
  { value: 'amateur', label: 'Amateur' },
  { value: 'elite', label: 'Élite' },
  { value: 'pro', label: 'Pro' },
];

export const SEXES: { value: Sex; label: string }[] = [
  { value: 'M', label: 'Hommes' },
  { value: 'F', label: 'Femmes' },
];

export interface BoxerRecord {
  wins: number;
  losses: number;
  draws: number;
  kos: number;
}

export interface BoxerSummary extends BoxerRecord {
  id: number;
  firstName: string;
  lastName: string;
  slug: string;
  nickname: string | null;
  birthDate: string | null;
  sex: Sex;
  weightKg: number | null;
  weightClass: string | null;
  level: BoxerLevel;
  discipline: SlugRef | null;
  photo: string | null;
  featured: boolean;
}

export interface Boxer extends BoxerSummary {
  bio: string | null;
  active: boolean;
  fights: Fight[];
  record: BoxerRecord;
}

export type FightResult = 'victoire' | 'defaite' | 'nul';
export type FightMethod = 'points' | 'ko' | 'tko' | 'abandon' | 'disqualification';

export const FIGHT_METHODS: Record<FightMethod, string> = {
  points: 'Points',
  ko: 'KO',
  tko: 'KO technique',
  abandon: 'Abandon',
  disqualification: 'Disqualification',
};

export interface Fight {
  id: number;
  date: string;
  opponent: string;
  opponentClub: string | null;
  location: string | null;
  event: { id?: number; title: string; slug: string } | null;
  result: FightResult;
  method: FightMethod;
  rounds: number | null;
  /** Présent sur les combats d'un gala */
  boxer?: PersonRef | null;
}

// Événements (galas) -----------------------------------------------------------
export type GalaType = 'gala' | 'competition' | 'stage' | 'portes-ouvertes';

export const GALA_TYPES: { value: GalaType; label: string }[] = [
  { value: 'gala', label: 'Gala' },
  { value: 'competition', label: 'Compétition' },
  { value: 'stage', label: 'Stage' },
  { value: 'portes-ouvertes', label: 'Portes ouvertes' },
];

export interface Gala {
  id: number;
  title: string;
  slug: string;
  type: GalaType;
  startsAt: string;
  endsAt: string | null;
  venue: string | null;
  address: string | null;
  city: string | null;
  description: string | null;
  poster: string | null;
  ticketUrl: string | null;
  price: number | null;
}

export interface GalaDetail extends Gala {
  fights: Fight[];
}

// Tarifs ------------------------------------------------------------------------
export type PricingPeriod = 'saison' | 'mois' | 'seance';

export const PERIOD_LABELS: Record<PricingPeriod, string> = {
  saison: 'la saison',
  mois: 'par mois',
  seance: 'la séance',
};

export interface Pricing {
  id: number;
  label: string;
  audience: string | null;
  priceCents: number;
  period: PricingPeriod;
  description: string | null;
  highlighted: boolean;
  position: number;
}

export interface Partner {
  id: number;
  name: string;
  logo: string | null;
  url: string | null;
  position: number;
}

// Inscriptions (adhésions) -------------------------------------------------------
export type MembershipStatus = 'en_attente' | 'validee' | 'refusee';

export const MEMBERSHIP_STATUS: Record<MembershipStatus, { label: string; tone: 'warning' | 'success' | 'danger' }> = {
  en_attente: { label: 'En attente', tone: 'warning' },
  validee: { label: 'Validée', tone: 'success' },
  refusee: { label: 'Refusée', tone: 'danger' },
};

export interface MembershipPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  /** AAAA-MM-JJ */
  birthDate: string;
  /** Identifiant de la discipline */
  discipline: number;
  /** Identifiant du tarif choisi (facultatif) */
  pricing: number | null;
  season: string;
  /** Obligatoire si le futur adhérent est mineur */
  legalGuardian: string | null;
  medicalCertificate: boolean;
  message: string | null;
  /** Consentement RGPD (horodaté côté serveur : consentAt) */
  consent: boolean;
}

export interface MembershipCreated {
  id: number;
  status: MembershipStatus;
}

export interface Membership {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  birthDate?: string;
  discipline: SlugRef | null;
  pricing: { id?: number; label: string; priceCents?: number; period?: PricingPeriod } | null;
  season: string;
  legalGuardian?: string | null;
  medicalCertificate?: boolean;
  status: MembershipStatus;
  createdAt: string;
}

// Contact et messagerie ------------------------------------------------------------
export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface MemberMessage {
  id: number;
  subject: string;
  body: string;
  createdAt: string;
  readAt: string | null;
  /** Expéditeur (null = le club) */
  sender: PersonRef | null;
  /** Destinataire (null = le club) */
  recipient: PersonRef | null;
}
