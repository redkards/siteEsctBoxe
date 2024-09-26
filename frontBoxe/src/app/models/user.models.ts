export default interface User {
  id: number;
  email: string;
  roles: string;
  password: string;
  nom: string;
  prenom: string;
  tel: number;
  dateNaissance: string;
  profilePicture?: string; // Champ optionnel pour la photo de profil
}
