# Feuille de route — ESCT Boxe

## Fait — 2.0.0-rc.1 (1er novembre 2026)
- [x] API Symfony 7.4 + back-office, front Angular 22 : vitrine, inscriptions, espace membre, messagerie, RGPD.
- [x] 21 propositions de design ; DA retenue : **Mix 1 · 7 · 12** (variante claire pour les pages parents).
- [x] 50 leçons sans contact (5 modules), Ma séance, chrono de rounds, agenda régional des galas, citation du jour.
- [x] Contrôle qualité indépendant : 8 défauts corrigés. 107 tests front, 20 tests back (153 assertions) verts.
- [x] Bêta de démonstration sans serveur (API simulée).

## 2.0.0 — Mise en ligne (bloqué par le club et le GO du propriétaire)
- [ ] Contenus réels : voir `docs/CONTENUS-A-FOURNIR.md` (horaires, tarifs, coachs, boxeurs avec accords, mentions légales, photos, logo).
- [ ] Relecture des 50 leçons par un entraîneur du club.
- [ ] Hébergement : `deploy/server-setup.sh` puis `deploy/update.sh` (o2switch) ; HTTPS ; e-mails réels ; crons RGPD et sauvegardes ; test de restauration.
- [ ] Nom de domaine ; retrait du `noindex`.

## Ensuite
- Paiement en ligne de la cotisation (HelloAsso, gratuit pour les associations).
- Synchronisation de la progression des leçons avec le compte membre (aujourd'hui stockée sur l'appareil).
- Galerie photos par événement ; billetterie des galas ; notifications.
