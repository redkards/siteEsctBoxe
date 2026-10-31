# ESCT Boxe — mémoire de reprise

État au 31 octobre 2026, ChatGPT/Codex. Base : travail de Claude sur `v2`, commit `5c71a07`.
Version : **2.0.0-beta.2**, stabilisation. Pas de déploiement. `main` et `legacy/` préservés.

## Consignes propriétaire

- Continuer la v2 de Claude, avec la méthode Poker Winners, en production rapide, simplifiée et efficace.
- Limiter les tokens : lectures ciblées, comptes rendus concis, réutilisation des tests réussis.
- Aucun plafond numérique communiqué. Aucune API IA payante ajoutée.
- Trois exemples à choisir : Fight Night (`ring`), Azur (`azur`), Éditorial (`club`). Ne pas imposer de choix.
- Aucune mise en ligne ni dépense sans accord explicite.

## Réalisé

- Remplacement des fixtures poker par les comptes, disciplines, planning, tarifs, boxeurs, combats,
  événements, actualités, inscription et message fictifs propres à la boxe.
- Adaptation des tests auth et RGPD au domaine du club ; tests intégrés des parcours et permissions.
- Migration initiale MariaDB 10.6 ajoutée (base dédiée vide uniquement).
- Correction des scripts de sauvegarde, de compilation et de déploiement pour viser ESCT.
- Correction du contrôle de préfixe des URL recevant le JWT.
- README, changelog, feuille de route et consignes actualisés.

## Preuves

- Angular : **75 tests réussis** dans Chromium ; build production réussi.
- Symfony : **20 tests, 153 assertions** réussis sous PHP 8.3/SQLite.
- Conteneur Symfony prod, 13 gabarits Twig et schéma Doctrine SQLite validés.
- Syntaxe Bash vérifiée. La migration MariaDB est reconnue mais n'a pas été exécutée sur MariaDB.
- Rapport : `docs/paradoxx/REPRISE-2026-10-31.md`.

## Reste avant mise en ligne

1. Choix du propriétaire parmi les trois thèmes existants.
2. Contenus réels du club : horaires, tarifs, coordonnées, informations légales, autorisations de photos.
3. Vérification visuelle sur les appareils cibles et test d'installation sur une base MariaDB dédiée.
4. Hébergement, emails réels, HTTPS et restauration de sauvegarde à tester après GO de déploiement.

Le fichier de mémoire est une passation consultable ; aucune synchronisation automatique avec Claude n'est prouvée.
