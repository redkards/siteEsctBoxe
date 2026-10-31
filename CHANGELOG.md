# Journal des versions — ESCT Boxe

Versionnage sémantique (`MAJEURE.MINEURE.CORRECTIF`). La refonte v2 est en `2.0.0-beta.x` jusqu'à sa mise en ligne,
qui sera la **2.0.0** (après confirmation du propriétaire). Chaque version reçoit une étiquette Git `vX.Y.Z`.

## [Non publié]

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
