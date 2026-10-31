# Expert Sécurité et protection des données — PARADOXX DÉVELOPPEMENT

## Mission et compétences

Revoir les flux de données, accès, secrets et dépendances ; proposer des contrôles proportionnés avant une bêta. Compétences : sécurité applicative, authentification/autorisation, minimisation des données, isolation des démonstrations, gestion des secrets et revue de configuration.

Limites : cette revue statique bornée ne constitue ni un audit exhaustif, ni une certification, ni un avis juridique. Aucun serveur distant, compte ou environnement Poker Winners n’a été inspecté. Toute conformité réglementaire exige une analyse adaptée au traitement réel.

## Entrées et sorties

Entrée vérifiée : `deliverables/ESCT_Boxe_3_Demos.html`, scripts intégrés et attributs de ressources/formulaires. Entrées requises pour activation : configuration d’hébergement, règles d’accès, périmètre `/demos/`, mécanisme de bêta et journaux expurgés.

Sortie : constats traçables, limites, anomalies et contrôles à exécuter avant publication. Aucun changement du HTML ni activation effectués.

## Constats vérifiés dans le fichier

- Le formulaire d’essai appelle `preventDefault()` et affiche un résultat local. Aucun `action` ou `formaction` explicite ; aucun appel réseau programmatique relevé (`fetch`, XHR, Beacon, WebSocket).
- Aucune référence de ressource externe active relevée dans les attributs `src`/`href` : l’unique lien non embarqué est une ancre locale. Les images sont intégrées.
- Aucun stockage applicatif des saisies trouvé : pas de cookies, localStorage, sessionStorage ou IndexedDB dans les scripts. Les valeurs restent dans le DOM ; le comportement de restauration du navigateur n’est pas garanti.
- Aucun secret apparent dans les scripts et marqueurs recherchés ; ce contrôle ne prouve pas l’absence universelle de secrets.
- Les remarques peuvent être copiées au presse-papiers ou téléchargées en fichier texte sur action explicite. Cette persistance locale doit être distinguée de l’absence d’envoi du formulaire. Employer des données fictives.
- `noindex,nofollow` et `no-referrer` sont présents ; ils ne protègent pas l’accès.

## Anomalie et contrôles prévus

Le bouton « copier le lien » conserve tous les paramètres de l’URL sauf le thème remplacé : un paramètre confidentiel éventuel serait copié. Prévoir une liste blanche limitée au thème ; aucun paramètre secret réel n’a été constaté.

Avant `/demos/` : vérifier côté serveur l’accès anonyme, les URL directes et variantes, les fichiers statiques, la révocation et le cache partagé. Reprendre le principe de bêta protégée demandé pour Poker Winners seulement après inspection de sa configuration. Tester la soumission sans JavaScript : le formulaire n’a pas de protection déclarative contre la navigation native. Contrôler en navigateur les requêtes et données persistées.

## Outils disponibles

Utilisés : `rg`, Python standard et analyse HTML locale, gratuits/libres. Disponibles selon besoin : shell/git ; skills Sites et Vercel de protection des déploiements, non exécutés ici. Aucun outil installé ni service payant requis par cette revue.

### Résolution lors de l'intégration
Le coordinateur a remplacé la copie intégrale de l'URL par une reconstruction limitée au chemin et au thème.
La protection effective de la bêta reste à vérifier lors du déploiement autorisé.
