# Contenus à fournir par le club — avant la mise en ligne

Tout ce qui est listé ici est aujourd'hui un **exemple** sur la bêta. Une fois reçu, chaque élément se remplace
à un seul endroit (fichier indiqué), sans toucher au design.

| # | Information | Exemple actuel | Où ça se remplace |
|---|---|---|---|
| 1 | Année de création de la section boxe | 1982 (à confirmer) | `backBoxe/src/Content/ClubInfo.php` |
| 2 | Adresse exacte de la salle | « Complexe sportif, 02700 Tergnier » | `ClubInfo.php` + base (salles) |
| 3 | Téléphone et e-mail publics du club | aucun / contact@esctboxe.local | `ClubInfo.php` |
| 4 | Liens Facebook, Instagram, YouTube | aucun | `ClubInfo.php` |
| 5 | Horaires par groupe (éducative, loisir, féminine, compétition) | Lun–Ven 17 h 30 – 21 h, Sam 10 h – 12 h | Back-office `/admin` → Planning |
| 6 | Tarifs 2026-2027 (jeunes, adultes, licence incluse ou non) | 90 € / 150 € (démonstration) | Back-office → Tarifs |
| 7 | Coachs (nom, rôle, diplôme, photo autorisée) | fictifs | Back-office → Coachs |
| 8 | Boxeurs à présenter + palmarès (accord écrit ; accord parental pour les mineurs) | fictifs | Back-office → Boxeurs |
| 9 | Nombre de titres remportés par le club | 25 (à confirmer) | `ClubInfo.php` |
| 10 | Mentions légales : nom officiel de l'association, RNA ou SIRET, adresse du siège, président (directeur de publication), affiliation FFBoxe | « à compléter » | `frontBoxe/src/app/features/legal/` (données légales) |
| 11 | 3 à 6 belles photos de salle, avec autorisation des personnes visibles | photos actuelles du dépôt | `frontBoxe/public/img/` |
| 12 | Logo : garder l'actuel ou le retravailler | logo actuel | `frontBoxe/src/app/shared/components/logo/` |
| 13 | Nom de domaine souhaité (ex. esctboxe.fr) | aucun | hébergement |
| 14 | Validation des 50 leçons par un entraîneur du club | non validées | relecture, puis retrait de la mention « à valider » |

## Pour la mise en ligne (accord du propriétaire requis)
- Hébergement de l'API (o2switch prévu, scripts prêts dans `deploy/`) : accès à fournir, saisis par le propriétaire.
- E-mails réels (inscriptions, mots de passe oubliés) : adresse d'envoi du club.
- HTTPS, sauvegardes quotidiennes et test de restauration.
