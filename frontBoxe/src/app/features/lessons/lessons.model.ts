/** Leçons pédagogiques ESCT : sans contact ni impact, à valider par un entraîneur du club. */
export type LessonLevel = 'découverte' | 'intermédiaire' | 'avancé';
export type SchemaKind = 'appuis' | 'deplacement' | 'enchainement' | 'defense' | 'distance' | 'cooperation';
export type ModuleId = 1 | 2 | 3 | 4 | 5;

export interface Lesson {
  id: number; // 1 à 50, unique
  slug: string; // ex. 'garde-et-appuis'
  module: ModuleId;
  title: string;
  level: LessonLevel;
  durationMin: number; // durée indicative de l'atelier
  objective: string;
  prerequisites: string[]; // 0 à 3 items (titres d'autres leçons ou capacités)
  organisation: { space: string; material: string[]; groups: string };
  schema: { kind: SchemaKind; phases: [string, string, string] }; // légende courte de chaque phase
  steps: [string, string, string, string, string]; // déroulé en cinq étapes
  decision: string; // situation de décision proposée
  corrections: { error: string; fix: string }[]; // 2 à 3
  criteria: string[]; // 3 critères observables
  adaptations: { enfants: string; ados: string; jeunesAdultes: string }; // 6–11 / 12–17 / 18–25 ans
  safety: string; // consigne de sécurité propre à l'atelier
}

export interface LessonModule { id: ModuleId; title: string; summary: string }

export const LESSON_MODULES: LessonModule[] = [
  { id: 1, title: 'Appuis, garde et coordination', summary: 'Se placer, se tenir et bouger juste avant de frapper.' },
  { id: 2, title: 'Enchaînements', summary: 'Relier les coups dans le vide avec rythme et équilibre.' },
  { id: 3, title: 'Défense et repositionnement', summary: 'Esquiver, parer et revenir en garde sans perdre ses appuis.' },
  { id: 4, title: 'Distance, rythme et décisions', summary: 'Lire l’espace, changer de tempo et choisir au bon moment.' },
  { id: 5, title: 'Intégration et transmission', summary: 'Assembler, s’auto-évaluer et aider un partenaire à progresser.' },
];
