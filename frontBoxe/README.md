# ESC Boxe Tergnier — front v2

Angular 22 (composants standalone + signals). Contrat d'API : `../docs/API.md`.

```bash
npm ci
npx ng serve --port 4300      # http://localhost:4300 (API attendue sur http://localhost:8000/api)
npm run test:ci               # Jasmine/Karma en Chrome headless
npx ng build                  # build de production (dist/esct-boxe-front)
```

- Styles : variables sémantiques `--bx-*` dans `src/styles/_tokens.scss`, classes globales `.bx-*` dans `src/styles.scss`.
- Thèmes : `src/styles/themes/` (appliqués via `html[data-theme="…"]`, choix `?theme=ring|azur|club`).
- Services typés de l'API : `src/app/core/api/`.
