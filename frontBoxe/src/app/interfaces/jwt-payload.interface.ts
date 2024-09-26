// jwt-payload.interface.ts
export interface JwtPayload {
  id: number; // ou string, selon votre besoin
  roles?: string[]; // Assurez-vous que cela correspond à votre structure de token
  // Ajoutez d'autres propriétés si nécessaire
}
