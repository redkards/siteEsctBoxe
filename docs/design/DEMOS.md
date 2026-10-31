# ESCT Boxe — trois démos et choix mixte

Présentation autonome : `frontBoxe/public/demos/index.html` (photos du club en `../img/`).
Livrable autonome équivalent : ESCT_Boxe_3_Demos.html, images embarquées, consultable hors connexion.
Le site principal garde son habillage provisoire simplifié.

| Variante | Orientation | Fonctions spécifiques testables |
|---|---|---|
| `ring` / Fight Night | Compétition | Sélecteur de boxeur/palmarès ; suivi fictif de gala |
| `azur` / Azur | Adhérents | Conseil d'essai adulte/mineur ; planning filtrable |
| `club` / Éditorial | Vie du club | Actualités filtrables ; article dépliable ; export calendrier TEST |

Comparateur : sélectionner une base graphique, cocher les fonctions de plusieurs modèles, saisir les remarques
et télécharger une synthèse TXT. Les choix ne sont pas envoyés ni sauvegardés par une application distante.
Copie du texte et téléchargement créent volontairement une copie locale des remarques.

## Liens préparés, activation distante non effectuée

- Entrée commune : `https://esct-beta.redkards-dev.fr/demos/`
- Modèle 1 : `https://esct-beta.redkards-dev.fr/demos/?theme=ring`
- Modèle 2 : `https://esct-beta.redkards-dev.fr/demos/?theme=azur`
- Modèle 3 : `https://esct-beta.redkards-dev.fr/demos/?theme=club`

Ces adresses sont des cibles de déploiement, pas une preuve de disponibilité.
Après GO : build/bêta via les scripts ESCT existants, protection HTTP par mot de passe vérifiée sur /demos/
et sur les images, HTTPS, noindex. Aucun nouveau mot de passe généré ou déploiement effectué ici.
Le domaine/API/bêta de Poker Winners reste indépendant.

## Vérifications du lot

- Six agents responsables des six grandes familles : rapports `docs/paradoxx/EXPERT-*.md`.
- Audit statique : IDs, labels et navigation cohérents ; syntaxe des deux scripts valide.
- Navigateur : palmarès Sam, simulation de suivi gala, parcours mineur, filtre jeunes,
  filtre résultats et article déplié, sélection mixte, export TXT testés.
- Correctifs de revue : URL copiée limitée à chemin+thème ; export ICS terminé par CRLF, UID distinct.
- Calendrier et formulaires sont des simulations. Aucun paiement, email réel ou inscription enregistrée.
- Pas de nouveau test de production MariaDB ni de déploiement distant dans ce lot.
