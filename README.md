# Therapy Office of Anna Tseytlina — website

Therapy practice website built with React, Vite and Tailwind. The build includes separate editorial, contact, confirmation, privacy and terms pages, plus a custom 404.

## Connecting the consultation form

Set `endpoint` in `public/consultation-form.json` to the public HTTPS submission URL from the chosen form service, then redeploy. The endpoint must accept a browser POST with multipart fields named `name`, `email`, `state` and `message`, allow requests from the site origin and return a successful HTTP status after accepting the submission. Keep any secret credentials on the provider’s server.

An empty endpoint enables the preview flow. It validates the fields and opens the thank-you page without sending or saving visitor details. With an endpoint connected, the confirmation follows a successful submission. If delivery fails, the visitor can retry with the fields preserved.

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
