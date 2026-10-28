# 🥊 ESCT Boxe - Site de Gestion

Application web complète pour la gestion d'un club de boxe, comprenant un espace membre, l'inscription en ligne, la messagerie interne et la gestion des actualités/palmarès.

## 🏗️ Stack Technique
- **Backend** : Symfony 6.4, PHP 8.1+, Doctrine ORM, LexikJWT, NelmioApiDoc
- **Frontend** : Angular 18, TypeScript, RxJS
- **Base de données** : PostgreSQL 16
- **Containerisation** : Docker & Docker Compose

## 🚀 Installation et Démarrage

### 1. Prérequis
- PHP 8.1+ et Composer
- Node.js 18+ et npm
- Docker & Docker Compose (recommandé)

### 2. Backend (Symfony)
```bash
cd backBoxe
cp .env .env.local
composer install
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
php bin/console lexik:jwt:generate-keypair
symfony server:start -d
```

### 3. Frontend (Angular)
```bash
cd frontBoxe
npm install
npm start
```

## 📚 Documentation API
Documentation Swagger : `http://localhost:8000/api/docs`

## 🧪 Tests
```bash
# Backend
cd backBoxe && php bin/phpunit

# Frontend
cd frontBoxe && npm test
```
