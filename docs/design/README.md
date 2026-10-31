# ESC Boxe Tergnier — directions artistiques (site v2)

Trois thèmes complets, sélectionnables à la volée. Tout le visuel du site passe par les variables CSS
`--bx-*` (valeurs par défaut : `frontBoxe/src/styles/_tokens.scss`) ; chaque thème les redéfinit **toutes**
sous `html[data-theme="<nom>"]` et ajoute des surcharges ciblées sur les classes globales `.bx-*`.

| Thème | Nom affiché | Esprit | Fichier |
|---|---|---|---|
| `ring` (défaut) | Fight Night | Affiche de gala : noir, rouge sang, capitales condensées | `frontBoxe/src/styles/themes/_ring.scss` |
| `azur` | Azur | Premium lumineux façon Poker Winners, bleu azur, verre dépoli | `frontBoxe/src/styles/themes/_azur.scss` |
| `club` | Éditorial | Magazine sportif : blanc cassé, noir, jaune or, grandes photos | `frontBoxe/src/styles/themes/_club.scss` |

## Choisir un thème

- **URL** (prioritaire) : `?theme=ring`, `?theme=azur`, `?theme=club`. Le choix est ensuite mémorisé.
- **Sélecteur** : 3 pastilles « Fight Night / Azur / Éditorial » dans le pied de page
  (`app-theme-switcher`, `radiogroup` accessible au clavier : flèches, Début/Fin).
- **Mémoire** : `localStorage["esct_theme"]` (lecture/écriture protégées par try/catch).
- **Sans flash** : `public/theme-init.js` pose `data-theme` sur `<html>` avant le premier rendu.
  Il est chargé par `<script src>` dans `index.html` car la CSP (`script-src 'self'`, `public/.htaccess`)
  interdit les scripts inline. `ThemeService` (`shared/components/theme-switcher/theme.ts`) reprend la même
  logique côté Angular (priorité URL > localStorage > `ring`) et met à jour `<meta name="theme-color">`.

## Polices

Une seule balise Google Fonts (`display=swap`) dans `frontBoxe/src/index.html` :
Anton, Archivo (axes `wdth` 62–125 et `wght` 400–800), Archivo Black, Inter, Playfair Display.
La CSP autorise déjà `fonts.googleapis.com` (styles) et `fonts.gstatic.com` (polices).
Chaque pile a des replis système (Impact / Arial Narrow, Georgia, Arial Black / Inter).

> Piste RGPD pour la mise en ligne : auto-héberger ces polices (fichiers `woff2` dans `public/fonts`)
> pour ne plus appeler Google depuis le navigateur des visiteurs.

---

## 1. `ring` — Fight Night

**Intention.** L'affiche d'un soir de gala : la salle plongée dans le noir, le ring sous les projecteurs,
le rouge du sang et des gants. On reprend l'univers du logo (silhouette grise sur fond noir, lettrage
blanc condensé et brut) et on le pousse vers l'affiche de combat.

**Palette**

| Rôle | Hex |
|---|---|
| Fond | `#0b0b0c` |
| Surface / carte | `#111113` / `#18181b` (bord `#2b2b30`) |
| Texte / doux / atténué | `#f5f3ef` / `#c9c4bc` / `#9b958c` |
| Rouge sang (primaire, boutons) | `#d81424` (survol `#b50f1d`) |
| Rouge éclairci (liens, sur-titres) | `#ff4a4f` |
| Blanc os (accent) | `#e8e2d6` |
| Noir absolu (bandeaux, pied de page) | `#000000` / `#050505` |

**Typographie.** Titres **Anton** en capitales (graisse unique, très condensée, interlignage 0,98),
texte courant **Inter**.

**Principes.**
- Angles vifs : rayons 0 à 4 px, boutons à coin coupé (`clip-path`).
- Textures : grain argentique plein écran (SVG `feTurbulence` en data-URI, opacité 7 %, `pointer-events: none`),
  hachures diagonales sur les bandeaux sombres, bande rouge en biais dans les en-têtes de rubrique.
- Photos en noir et blanc contrasté (`grayscale` + `contrast`) ; le voile rouge passe par `--bx-hero-overlay` ;
  au survol, la couleur revient légèrement.
- Le rouge `#d81424` ne porte jamais de petit texte sur le noir (4,0:1) : liens et sur-titres utilisent
  `#ff4a4f` (5,9:1).

## 2. `azur` — Azur

**Intention.** La version boxe de l'univers Poker Winners : premium, aéré, lumineux. Le bleu azur remplace
le rouge (et le vert est banni, à la demande du propriétaire). Le club se présente comme une maison
accueillante et soignée, pour les familles comme pour les compétiteurs.

**Palette**

| Rôle | Hex |
|---|---|
| Fond (avec halos azur fixes) | `#eef4fb` |
| Surface | `#f6f9fd` |
| Carte (verre) | `rgb(255 255 255 / .72)` + `backdrop-filter: blur(16px)` |
| Texte / doux / atténué | `#0c1b2e` / `#2f4560` / `#56677c` |
| Bleu primaire (boutons, liens) | `#1667c2` (survol `#0f56a8`), dégradé bouton `#1976d2 → #1258a8` |
| Azur vif (décor, halos) | `#1e88e5` |
| Bleu acier (accent) | `#8fbbea` |
| Marine (bandeaux, pied de page) | `#0a2342` |

**Typographie.** Titres **Playfair Display** 700–800, casse normale ; texte **Inter**.

**Principes.**
- Rayons généreux : 28 / 18 / 12 px ; boutons, badges et sur-titres en pilule.
- Glassmorphism : cartes semi-transparentes floutées sur fond à halos radiaux.
- Ombres douces teintées de bleu (`rgb(15 60 120 / …)`), légère élévation au survol.
- Bandeaux sombres en dégradé marine avec halo azur.
- `#1e88e5` reste décoratif : blanc sur `#1e88e5` ne fait que 3,7:1, d'où `#1667c2` pour le texte et les boutons.

## 3. `club` — Éditorial

**Intention.** Le magazine sportif (L'Équipe, campagnes Nike) : des titres énormes, de grandes photos,
des filets noirs, une étiquette jaune pour chaque rubrique. Frais, direct, très lisible.

**Palette**

| Rôle | Hex |
|---|---|
| Fond (blanc cassé) | `#f6f4ef` |
| Gris béton (surface) | `#ece9e2` |
| Carte | `#ffffff` (bord `#e2dfd7`) |
| Texte / doux / atténué | `#111111` / `#2b2b2b` / `#5c5a55` |
| Noir (primaire, boutons) | `#111111` |
| Jaune or (accent) | `#f5b700` |

**Typographie.** Grotesque large **Archivo** (largeur 118 %, graisse 800) en capitales pour les titres,
**Archivo** en texte courant (repli Inter).

**Principes.**
- Grilles nettes, rayons moyens (10 / 6 / 4 px), pas d'ombre sur les cartes : des bords.
- Chaque titre de section est posé sur un filet noir de 5 px (jaune sur fond sombre).
- Sur-titres en étiquette jaune, liens soulignés jaune, survol en surlignage jaune.
- Le jaune ne porte jamais de texte sur fond clair : il sert de fond (texte noir, 10,5:1).
  Bouton principal noir, qui devient jaune sur les bandeaux sombres.

---

## Contrastes (WCAG 2.1 AA)

Calculés avec `python3 docs/design/contrast.py` (luminance relative WCAG ; les fonds semi-transparents
sont composés sur le fond de page). Seuils : 4,5:1 texte normal, 3:1 grand texte (≥ 24 px ou ≥ 18,7 px gras).
Un audit du DOM rendu (chaque nœud texte contre son fond effectif) a aussi été passé sur les pages capturées.

### Thème `ring`

| Paire | Texte | Fond | Ratio | AA normal (4.5) | AA grand (3) |
|---|---|---|---|---|---|
| ink / bg | `#f5f3ef` | `#0b0b0c` | 17.75 | oui | oui |
| ink-soft / bg | `#c9c4bc` | `#0b0b0c` | 11.34 | oui | oui |
| muted / bg | `#9b958c` | `#0b0b0c` | 6.62 | oui | oui |
| ink / card | `#f5f3ef` | `#18181b` | 15.99 | oui | oui |
| muted / card | `#9b958c` | `#18181b` | 5.97 | oui | oui |
| primary-ink / primary (bouton) | `#ffffff` | `#d81424` | 5.19 | oui | oui |
| primary-ink / primary-hover | `#ffffff` | `#b50f1d` | 6.88 | oui | oui |
| link (rouge éclairci) / bg | `#ff4a4f` | `#0b0b0c` | 5.94 | oui | oui |
| accent-ink / accent (os) | `#0b0b0c` | `#e8e2d6` | 15.25 | oui | oui |
| primary-ink / primary-soft sur bg | `#f5f3ef` | `#2a0d10` | 16.29 | oui | oui |
| link / card | `#ff4a4f` | `#18181b` | 5.35 | oui | oui |
| dark-ink / dark | `#ffffff` | `#000000` | 21.00 | oui | oui |
| footer-ink / footer-bg | `#bdb8b0` | `#050505` | 10.33 | oui | oui |

### Thème `azur`

| Paire | Texte | Fond | Ratio | AA normal (4.5) | AA grand (3) |
|---|---|---|---|---|---|
| ink / bg | `#0c1b2e` | `#eef4fb` | 15.65 | oui | oui |
| ink-soft / bg | `#2f4560` | `#eef4fb` | 8.86 | oui | oui |
| muted / bg | `#56677c` | `#eef4fb` | 5.23 | oui | oui |
| ink / card (glass 72 % sur bg) | `#0c1b2e` | `#fafcfe` | 16.85 | oui | oui |
| muted / card (glass) | `#56677c` | `#fafcfe` | 5.63 | oui | oui |
| primary-ink / primary (bouton) | `#ffffff` | `#1667c2` | 5.60 | oui | oui |
| primary-ink / primary-hover | `#ffffff` | `#0f56a8` | 7.20 | oui | oui |
| primary (liens) / bg | `#1667c2` | `#eef4fb` | 5.05 | oui | oui |
| primary (liens) / card | `#1667c2` | `#ffffff` | 5.60 | oui | oui |
| dark-ink / dark | `#ffffff` | `#0a2342` | 15.77 | oui | oui |
| accent-ink / accent | `#0c1b2e` | `#8fbbea` | 8.63 | oui | oui |
| dark-muted / dark | `#a9bdd6` | `#0a2342` | 8.21 | oui | oui |
| footer-ink / footer-bg | `#c4d3e6` | `#0a2342` | 10.37 | oui | oui |

### Thème `club`

| Paire | Texte | Fond | Ratio | AA normal (4.5) | AA grand (3) |
|---|---|---|---|---|---|
| ink / bg | `#111111` | `#f6f4ef` | 17.18 | oui | oui |
| ink-soft / bg | `#2b2b2b` | `#f6f4ef` | 12.88 | oui | oui |
| muted / bg | `#5c5a55` | `#f6f4ef` | 6.27 | oui | oui |
| ink / card | `#111111` | `#ffffff` | 18.88 | oui | oui |
| muted / card | `#5c5a55` | `#ffffff` | 6.89 | oui | oui |
| primary-ink / primary (bouton noir) | `#ffffff` | `#111111` | 18.88 | oui | oui |
| accent-ink / accent (jaune) | `#111111` | `#f5b700` | 10.48 | oui | oui |
| liens (ink souligné or) / bg | `#111111` | `#f6f4ef` | 17.18 | oui | oui |
| dark-ink / dark | `#ffffff` | `#111111` | 18.88 | oui | oui |
| accent / dark (titres jaunes sur noir) | `#f5b700` | `#111111` | 10.48 | oui | oui |
| footer-ink / footer-bg | `#c9c6bf` | `#111111` | 11.07 | oui | oui |
| dark-muted / dark | `#b3b0a8` | `#111111` | 8.72 | oui | oui |
| ink / surface (béton) | `#111111` | `#ece9e2` | 15.57 | oui | oui |
| muted / surface (béton) | `#5c5a55` | `#ece9e2` | 5.68 | oui | oui |

## Aperçus

Captures Playwright (Chromium, 1440 × 900 pleine page, et 390 px pour l'accueil mobile) dans
[`apercus/`](apercus/) : `<thème>-accueil.png`, `<thème>-boxeurs.png`, `<thème>-fiche-boxeur.png`,
`<thème>-accueil-390.png`.
