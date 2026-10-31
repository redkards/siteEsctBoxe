export interface MessageType {
  id?: number;
  contenu: string;
  destinataire: string;
  expediteur: string;
  msgDate: Date;
  isVisible: boolean;
}
