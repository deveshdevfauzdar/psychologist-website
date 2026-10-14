# Therapy Office of Anna Tseytlina — website

Single-page site built with React, Vite and Tailwind.

```bash
npm install
npm run dev      # http://127.0.0.1:5173/
npm run build    # production build in dist/
```

## Deploying

Every push to `main` builds the site and publishes `dist/` to the `gh-pages` branch
(see `.github/workflows/deploy.yml`). GitHub Pages serves that branch at
https://deveshdevfauzdar.github.io/psychologist-website/.

Asset paths are relative (`base: './'` in `vite.config.ts`), so the same build also works at a domain root.
