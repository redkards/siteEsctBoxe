export interface Boxeur {
  id?: number; // L'ID est optionnel lors de la création
  boxeurNom: string;
  boxeurPrenom: string;
  poids: number;
  boxeurDateNaissance?: string; // Ajout de la date de naissance si nécessaire
}
