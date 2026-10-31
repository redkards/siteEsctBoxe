import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LEGAL, LegalSection, isPending, scrollToSection } from '../legal.config';

/** Ligne du registre des traitements affichée dans la politique */
export interface Processing {
  purpose: string;
  data: string;
  legalBasis: string;
  retention: string;
}

/**
 * Politique de confidentialité (RGPD, art. 13 et 14) : /confidentialite
 */
@Component({
  selector: 'app-confidentialite',
  imports: [RouterLink],
  templateUrl: './confidentialite.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: '../legal-layout.scss',
})
export class ConfidentialiteComponent {
  protected readonly legal = LEGAL;
  protected readonly pending = isPending;
  protected readonly scrollTo = scrollToSection;

  protected readonly sections: LegalSection[] = [
    { id: 'responsable', label: 'Responsable du traitement' },
    { id: 'traitements', label: 'Données, finalités et durées' },
    { id: 'mineurs', label: 'Adhérents mineurs' },
    { id: 'sante', label: 'Certificat médical' },
    { id: 'destinataires', label: 'Destinataires' },
    { id: 'stockage', label: 'Cookies et stockage local' },
    { id: 'securite', label: 'Sécurité et hébergement' },
    { id: 'droits', label: 'Vos droits' },
    { id: 'cnil', label: 'Réclamation auprès de la CNIL' },
    { id: 'modifications', label: 'Modifications' },
  ];

  protected readonly processings: Processing[] = [
    {
      purpose: 'Compte membre (connexion, espace personnel)',
      data: 'Prénom, nom, email, mot de passe (chiffré), téléphone et date de naissance (facultatifs), date d’acceptation des CGU, dates de création et de dernière connexion',
      legalBasis: 'Exécution du contrat (CGU, art. 6.1.b RGPD)',
      retention: 'Jusqu’à la suppression du compte ; compte inactif supprimé après 3 ans sans connexion (avec prévenance par email). Compte non activé : supprimé après 30 jours',
    },
    {
      purpose: 'Inscriptions et adhésions au club (demande en ligne, validation, prise de licence)',
      data: 'Identité de l’adhérent, email, téléphone, date de naissance, discipline, formule, saison, responsable légal (mineur), déclaration de certificat médical, message libre, statut de la demande, date du consentement',
      legalBasis: 'Exécution du contrat d’adhésion (art. 6.1.b) ; obligation légale pour la licence fédérale et la comptabilité (art. 6.1.c)',
      retention: 'Durée de l’adhésion puis 3 ans après la fin de la dernière saison. Demande refusée ou non aboutie : 1 an. Pièces comptables (cotisations) : 10 ans',
    },
    {
      purpose: 'Messagerie interne entre le membre et le club',
      data: 'Objet, contenu, date d’envoi et de lecture des messages, expéditeur et destinataire',
      legalBasis: 'Exécution du contrat (art. 6.1.b)',
      retention: 'Tant que le compte existe ; supprimés avec le compte, et au plus tard 3 ans après le dernier message',
    },
    {
      purpose: 'Formulaire de contact',
      data: 'Nom, email, objet, message',
      legalBasis: 'Intérêt légitime de l’association à répondre aux demandes (art. 6.1.f)',
      retention: '1 an après le traitement de la demande',
    },
    {
      purpose: 'Commentaires sur les actualités (publiés après modération)',
      data: 'Nom affiché, contenu du commentaire, date, statut de modération',
      legalBasis: 'Exécution du contrat (art. 6.1.b) ; intérêt légitime pour la modération (art. 6.1.f)',
      retention: 'Tant que l’actualité est en ligne ou jusqu’à la suppression du compte ; commentaire refusé : supprimé sous 30 jours',
    },
    {
      purpose: 'Sécurité du site (prévention des abus, limitation des tentatives)',
      data: 'Adresse IP, date et heure de connexion, journaux techniques',
      legalBasis: 'Intérêt légitime (art. 6.1.f) et obligation légale de conservation des données de connexion',
      retention: '1 an',
    },
    {
      purpose: 'Publication des fiches boxeurs et des photos du club',
      data: 'Prénom, nom, surnom, photo, catégorie, palmarès sportif',
      legalBasis: 'Consentement du boxeur ou de son représentant légal (art. 6.1.a), retirable à tout moment',
      retention: 'Tant que le boxeur est licencié au club, ou jusqu’au retrait du consentement',
    },
  ];
}
