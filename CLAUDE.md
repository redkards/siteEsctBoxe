# ESCT Boxe — v2

Site du club **ESC Boxe Tergnier** (Aisne) : vitrine (club, disciplines, planning, tarifs, boxeurs et palmarès,
événements, actualités), inscriptions en ligne, espace membre avec messagerie, et back-office pour les coachs.
Refonte v2 construite sur le modèle du projet Poker Winners (même architecture, même méthode), pilotée en
**mini-système PARADOXX** (voir `docs/paradoxx/`). Projet indépendant : aucun code, aucune base ni configuration partagés.

**Au démarrage :** `git pull` puis lire [MEMOIRE.md](MEMOIRE.md). **Avant de s'arrêter :** le mettre à jour, puis commit et push.

## Structure
- `backBoxe/` : API Symfony 7.4 (PHP ≥ 8.2), Doctrine/MariaDB 10.6, JWT + refresh tokens, EasyAdmin (`/admin`).
- `frontBoxe/` : Angular 22 (standalone, signals), Node ≥ 22. Trois thèmes : `ring`, `azur`, `club` (`src/styles/themes/`).
- `docs/API.md` : contrat d'API, la source de vérité entre le back et le front.
- `docs/` : `design/` (thèmes), `recap/` (rapports PDF), `paradoxx/` (décisions, rapports d'étape), `deploiement/`, `ROADMAP.md`.
- `deploy/` : scripts o2switch (sous-domaines provisoires `esct-api.` / `esct-beta.redkards-dev.fr`).
- `legacy/` : ancienne version (Symfony 6.4 / Angular 18), conservée pour référence. Ne plus la modifier.

## Lancer en local
1. `docker compose up -d` à la racine (MariaDB sur le port 3307, Mailhog sur 8025).
2. API : `cd backBoxe && composer install && php bin/console lexik:jwt:generate-keypair --skip-if-exists && php bin/console doctrine:migrations:migrate -n && php bin/console doctrine:fixtures:load -n && php -S localhost:8000 -t public public/index.php`
3. Front : `cd frontBoxe && npm ci && npx ng serve --port 4300`. Pour choisir un thème : `?theme=ring|azur|club`.

Comptes de démo (mot de passe `Demo1234!`) : `demo@esctboxe.local`, `coach@esctboxe.local`, `admin@esctboxe.local`.

## Vérifications
- Back : `cd backBoxe && php bin/phpunit` (base SQLite, `.env.test`).
- Front : `cd frontBoxe && npm run test:ci && npx ng build`.

## Règles
- Ne jamais mettre le site en ligne sans confirmation explicite du propriétaire.
- Ne jamais committer de secrets (`.env.local`, `.env.*.local`, `*.pem`).
- Travailler sur la branche `v2` jusqu'à validation ; `main` contient l'ancienne version.
- Commit + push à chaque étape validée (tests verts). SemVer : `CHANGELOG.md`, version de `frontBoxe/package.json`, tag `vX.Y.Z`.
- Photos : uniquement celles du club (`frontBoxe/public/img`). Données de démonstration fictives, marquées comme telles.
- Décisions et rapports d'étape : format PARADOXX dans `docs/paradoxx/` + page Notion « ESCT Boxe — Site du club » du QG.

## Production rapide et économie de tokens — demande du propriétaire, 31/10/2026
- Réutiliser la v2 de Claude et la méthode Poker Winners.
- Lectures ciblées, sorties courtes, bilan dans MEMOIRE.md ; éviter les relectures et tests redondants.
- Aucun plafond numérique de tokens fourni : ne pas en inventer. Aucun service IA payant ajouté.
- Trois thèmes conservés pour le choix du propriétaire : Fight Night, Azur, Éditorial.
- Travail simplifié et efficace ; en fin de lot, bilan Markdown concis plutôt que document supplémentaire.
