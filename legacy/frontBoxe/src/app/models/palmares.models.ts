import { Boxeur } from './boxeur.models';
import { Categorie } from './categorie.models';

export interface Palmares {
  id?: number;
  victoires: number;
  defaites: number;
  nul: number;
  boxeur: Boxeur;
  categorie: Categorie;
}
