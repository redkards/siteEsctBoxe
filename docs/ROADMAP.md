# Feuille de route — ESCT Boxe

## 2.0.0-beta.2 — Stabilisation technique
- [x] Contrat d'API, squelette Poker Winners, scripts de déploiement adaptés.
- [x] API et back-office : parcours de démonstration et tests verts sous SQLite.
- [x] Front compilé et 75 tests verts.
- [x] Trois thèmes implémentés ; **le propriétaire en choisit un** (ou un mélange).

## 2.0.0-beta.3 — Contenus réels (avec le club)
- [ ] Remplacer les données de démonstration : vrais boxeurs (avec accord écrit, et accord parental pour les mineurs),
  coachs, horaires, tarifs 2026-2027, adresse exacte des salles, historique du club.
- [ ] Mentions légales : nom de l'association, RNA/SIRET, président, hébergeur.
- [ ] Choix du nom de domaine du club.

## 2.0.0 — Mise en ligne (après GO du propriétaire)
- [ ] `deploy/server-setup.sh` puis `deploy/update.sh` sur o2switch ; HTTPS ; crons RGPD et sauvegardes.
- [ ] Test de restauration de la sauvegarde (standard PARADOXX).

## Ensuite
- Paiement en ligne de la cotisation (HelloAsso, gratuit pour les associations).
- Galerie photos par événement ; billetterie des galas ; notifications.
