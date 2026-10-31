# Expert Développement applications — PARADOXX DÉVELOPPEMENT

## Rôle et compétences

Transformer les besoins validés en interfaces fonctionnelles et vérifier les parcours avant livraison : JavaScript, HTML/CSS, état d’interface, filtres, navigation, exports locaux et diagnostic reproductible. Privilégier les outils gratuits ou libres déjà disponibles ; aucun abonnement, achat ou installation payante.

## Entrées et sorties

**Entrées :** maquette autonome `deliverables/ESCT_Boxe_3_Demos.html`, exigences de comparaison des trois modèles, choix mixtes, export TXT et calendrier ICS.

**Sorties :** constats vérifiables, propositions de corrections minimales et critères de recette. Cette revue ne modifie pas le HTML, ne publie rien et ne déclenche ni push, ni déploiement, ni opération Notion.

## Skills pertinents disponibles

- `sites:sites` : construction et évolution d’un site lors d’une implémentation ultérieure autorisée.
- `vercel:react-best-practices` : revue React/TSX uniquement si cette technologie est retenue ; non applicable au HTML actuel.
- `vercel:verification` : vérification de parcours complets avec serveur de développement si nécessaire.

Ces skills sont disponibles dans la session ; aucun n’a été invoqué pour cette revue JavaScript autonome, réalisée avec Python standard et Node.js.

## Critères de fin

Syntaxe valide ; identifiants uniques ; navigation vers une seule section active ; sélection graphique et fonctions combinables ; exports portant les choix effectifs ; calendrier explicitement fictif ; défauts transmis au responsable avant clôture. Toute vérification qui n’a pas été exécutée doit être signalée.

## Résultats concrets — 31 octobre 2026

- Les deux scripts extraits passent `node --check` ; aucun identifiant HTML dupliqué.
- Un banc de simulation Node.js exécute les scripts réels avec un DOM minimal : ouverture des trois thèmes, navigation spécifique de chacun, retour au comparateur et mémorisation de la base graphique réussis.
- Sélection « Mélange des trois », fonctions des modèles 1 et 3 et remarque libre : contenu TXT exporté vérifié.
- Export ICS : présence de dates début/fin et du marquage TEST vérifiée. **Défaut initial confirmé : CRLF final absent.** Le responsable indique avoir ajouté le CRLF terminal dans l’artefact et sa copie de prévisualisation.
- L’UID ICS initialement constant pouvait confondre plusieurs exemples ; le responsable indique avoir ajouté un UID unique par export. Il confirme aussi que le lien de modèle est reconstruit avec le chemin et le paramètre `theme` seulement. Ces corrections ont été signalées après les tests ci-dessus, sans nouvelle exécution du banc.
- Limite : les assertions portent sur la logique en simulation, pas sur le rendu ni l’interopérabilité d’un logiciel calendrier. Playwright est présent mais son navigateur Chromium est absent ; aucune installation effectuée.
