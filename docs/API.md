# ESCT Boxe — Contrat d'API v2 (source de vérité back ↔ front)

Préfixe `/api`. JSON. Erreurs `{"message": "..."}` (+ `code` éventuel). Validation 422 `{violations:[{propertyPath,title}]}`.
Pagination : `{items, page, limit, total, pages}` via `?page=&limit=` (max 50).
Dates : ISO 8601. Montants : centimes (int). Images : URL absolue ou chemin `/uploads/...`, nullable.

## Domaine (entités Doctrine)

| Entité | Champs principaux |
|---|---|
| User (repris de Poker Winners) | email, password, roles (ROLE_USER < ROLE_COACH < ROLE_ADMIN), pseudo→**firstName, lastName**, phone, birthDate, emailVerifiedAt, consent, lastLoginAt, createdAt |
| Article (actualités, repris de PW) | title, slug, excerpt, content (HTML simple), coverImage, category (enum: club, competition, gala, stage, vie-du-club), publishedAt, author |
| Discipline | name, slug, shortDescription, description, icon (nom), image, minAge, position |
| Coach | firstName, lastName, slug, role (ex. « Entraîneur principal »), bio, photo, diplomas (string), disciplines (M2M), position |
| Boxer | firstName, lastName, slug, nickname, birthDate, sex (enum M/F), weightKg (float), weightClass (string, ex. « -63,5 kg »), level (enum: educatif, amateur, elite, pro), discipline (M2O), photo, bio, wins, losses, draws, kos, active (bool), featured (bool) |
| Fight (palmarès détaillé) | boxer (M2O), date, opponent, opponentClub, location, event (M2O Gala nullable), result (enum: victoire, defaite, nul), method (enum: points, ko, tko, abandon, disqualification), rounds (int nullable) |
| Gala (événements) | title, slug, type (enum: gala, competition, stage, portes-ouvertes), startsAt, endsAt, venue, address, city, description, poster, ticketUrl, price (centimes nullable), published |
| TrainingSlot (planning) | dayOfWeek (1=lundi..7), startTime ("18:00"), endTime, discipline (M2O), audience (enum: enfants, ados, adultes, competiteurs, feminin, tous), coach (M2O nullable), venue (M2O) |
| Venue (salles) | name, address, postalCode, city, latitude, longitude, description, photo |
| Pricing (tarifs) | label, audience, priceCents, period (enum: saison, mois, seance), description, highlighted (bool), position |
| Membership (inscriptions / adhésions) | user (M2O nullable), firstName, lastName, email, phone, birthDate, discipline (M2O), pricing (M2O nullable), season ("2026-2027"), legalGuardian (string nullable, si mineur), medicalCertificate (bool déclaré), message, status (enum: en_attente, validee, refusee), consentAt, createdAt |
| ContactMessage | name, email, subject, message, createdAt, handled (bool) |
| Message (messagerie interne membre ↔ club) | sender (User), recipient (User nullable = « le club »), subject, body, createdAt, readAt |
| Partner | name, logo, url, position |

## Endpoints publics (GET sauf mention)

- `GET /api/club` → `{name, tagline, foundedYear, stats:{members, boxers, coaches, titles}, address, phone, email, socials:{facebook, instagram, youtube}}` (constantes de `src/Content/ClubInfo.php` + compteurs)
- `GET /api/articles?page&limit&category` → paginé `{id,title,slug,excerpt,coverImage,category,publishedAt}` ; `GET /api/articles/{slug}` → + content, author
- `GET /api/disciplines` ; `GET /api/disciplines/{slug}` (+ slots, coaches)
- `GET /api/coaches`
- `GET /api/boxers?discipline&level&sex&q&page&limit` (actifs) ; `GET /api/boxers/featured` ; `GET /api/boxers/{slug}` (+ fights triés date desc, record {wins,losses,draws,kos})
- `GET /api/galas?when=upcoming|past&type&page&limit` ; `GET /api/galas/{slug}` (+ fights liés)
- `GET /api/planning` → liste de TrainingSlot avec discipline{name,slug}, coach{firstName,lastName}, venue{name,city}
- `GET /api/venues` ; `GET /api/pricing` ; `GET /api/partners`
- `POST /api/memberships` (public ou connecté ; rate limit 5/10 min) → 201 `{id,status}`
- `POST /api/contact` (rate limit 5/10 min) → 202

## Auth & compte (repris de Poker Winners)

- `POST /api/register`, `POST /api/login` (json_login → `{token, refresh_token}`), `POST /api/token/refresh`, `POST /api/verify-email`, `POST /api/verify-email/resend`
- `GET /api/me` → `{id,email,firstName,lastName,phone,birthDate,roles,createdAt}` ; `PATCH /api/me` ; `POST /api/me/password` ; RGPD export/suppression comme PW
- `GET /api/me/memberships`
- `GET /api/me/messages` (reçus + envoyés, paginé) ; `POST /api/me/messages` `{subject, body}` (vers le club) ; `POST /api/me/messages/{id}/read`

## Admin

EasyAdmin sur `/admin` (ROLE_COACH minimum, ROLE_ADMIN pour Users/Pricing/Partners) : CRUD de toutes les entités, tableau de bord avec compteurs (inscriptions en attente, messages non lus, contacts non traités), actions « Valider / Refuser » sur Membership, réponse à un message membre.
