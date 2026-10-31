# Journal des versions — ESCT Boxe

Versionnage sémantique (`MAJEURE.MINEURE.CORRECTIF`). La refonte v2 est en `2.0.0-beta.x` jusqu'à sa mise en ligne,
qui sera la **2.0.0** (après confirmation du propriétaire). Chaque version reçoit une étiquette Git `vX.Y.Z`.

## [Non publié]

- Design provisoire simplifié à la demande du propriétaire : style clair, police système, accueil compact, sans effets décoratifs ni chargement Google Fonts. Trois thèmes conservés dans les sources pour une reprise ultérieure ; sélecteur masqué.

## [2.0.0-beta.2] — 2026-10-31 — Reprise et stabilisation

- Fixtures boxe à la place des données poker et services inexistants.
- Tests auth/RGPD adaptés au club, parcours publics, inscriptions, messagerie et accès staff testés.
- Migration initiale MariaDB ajoutée pour une base dédiée vide ; exécution serveur à valider.
- Scripts corrigés : base `_esct`, sortie Angular, domaine public dédié, branche v2.
- Jeton JWT limité aux URL de l'API. Documentation et mémoire de reprise actualisées.
- Trois thèmes de Claude conservés ; choix final en attente. Aucun déploiement.

## [2.0.0-beta.1] — 2026-10-31 — Refonte v2 sur le modèle Poker Winners

### Ajouté
- Nouvelle API Symfony 7.4 (`backBoxe/`) : JWT + refresh tokens, EasyAdmin, MariaDB 10.6, limites de débit, RGPD.
- Domaine du club : disciplines, coachs, boxeurs et combats (palmarès), événements et galas, planning hebdomadaire,
  salles, tarifs, inscriptions en ligne, messages de contact, messagerie membre ↔ club, partenaires.
- Nouveau front Angular 22 (`frontBoxe/`) : toutes les pages du club, l'inscription en plusieurs étapes, l'espace membre.
- Trois directions artistiques au choix : Fight Night (`ring`), Azur (`azur`), Éditorial (`club`).
- Méthode : `CLAUDE.md`, `MEMOIRE.md`, `docs/API.md`, `docs/ROADMAP.md`, mini-système PARADOXX (`docs/paradoxx/`),
  scripts de déploiement o2switch, `docker-compose.yml`.

### Modifié
- L'ancienne version (Symfony 6.4 / Angular 18 / PostgreSQL) est déplacée dans `legacy/` sur la branche `v2`.

### Présentation et organisation
- Trois démonstrations autonomes distinctes (compétition, adhérents, vie du club) dans `/demos/`.
- Comparateur avec choix mixte et export TXT ; exports et formulaires sans envoi distant.
- PARADOXX DÉVELOPPEMENT : six familles d'expertise, revues réalisées par six agents et passation Notion pour Claude.
- Liens bêta préparés ; aucun déploiement distant dans ce lot.
