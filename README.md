# ESCT Boxe — v2

Site du club de Tergnier : vitrine, actualités, événements, boxeurs et palmarès, planning,
inscriptions, espace membre et back-office. Reprise de la branche `v2` de Claude.
Architecture inspirée de Poker Winners, application et données indépendantes.

- API : Symfony 7.4, PHP ≥ 8.2, Doctrine, MariaDB 10.6, JWT et EasyAdmin.
- Front : Angular 22, Node ≥ 22.22.3, TypeScript et signals.
- Trois thèmes complets : Fight Night (`ring`), Azur (`azur`), Éditorial (`club`). Choix final à valider.
- Ancien site conservé dans `legacy/`. `main` conserve l'ancienne version.

## Installation locale

1. `git switch v2`, puis `git pull --ff-only`.
2. `docker compose up -d` (MariaDB : 3307 ; Mailhog : 8025).
3. Dans `backBoxe/` : `composer install`, `php bin/console lexik:jwt:generate-keypair --skip-if-exists`,
   puis `php bin/console doctrine:migrations:migrate -n`.
4. Sur une base locale dédiée et vide uniquement : `php bin/console doctrine:fixtures:load -n`.
   Cette commande efface la base ciblée. Toutes les données chargées sont fictives et signalées comme démonstration.
5. API : `php -S localhost:8000 -t public public/index.php` depuis `backBoxe/`.
6. Front : `npm ci`, puis `npm start` depuis `frontBoxe/`. Ouvrir `http://localhost:4300`.

Comptes de démonstration : `demo@esctboxe.local`, `coach@esctboxe.local`, `admin@esctboxe.local`.
Le mot de passe de développement est documenté dans `CLAUDE.md`. Ne pas charger ces comptes en production.
Les trois variantes se sélectionnent via `?theme=ring`, `?theme=azur`, `?theme=club` ou le pied de page.

## Vérification

- Back : `php bin/console lexik:jwt:generate-keypair --skip-if-exists --env=test`, puis `php vendor/bin/phpunit`.
- Front : `npm run test:ci` (Chrome/Chromium requis), puis `npm run build`.
- Si nécessaire, définir `CHROME_BIN` vers le navigateur de test installé.
- Syntaxe des scripts : `bash -n deploy/<script>.sh` pour chacun.

Les tests back utilisent SQLite. La migration initiale cible une **base MariaDB dédiée et vide** ;
la conversion de la base historique et l'exécution de la migration sur l'hébergement restent à valider.

## Continuité et livraison

Lire `CLAUDE.md`, puis `MEMOIRE.md` pour le dernier bilan. Contrat : `docs/API.md`.
Décisions et compte rendu : `docs/paradoxx/`. Pas de mise en ligne avant GO explicite.
