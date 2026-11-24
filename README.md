# Winear.me

A world map of wineries: wine-bottle markers, winery stories, wines and prices, and an events calendar with "Add to Google Calendar".

## Structure
- `public/` – the website (index.html, sample wineries in `wineries.json`, map outline in `countries.json`, Leaflet map library)
- `server.js` – small Node.js server that serves `public/` (no dependencies)
- `package.json` – start command for GoDaddy Node.js Hosting (`npm start`)

## Run locally
```
npm start
```
Then open http://localhost:3000

## Deploy (GoDaddy Node.js Hosting)
Push to `main`, then in the GoDaddy app page click **Update Preview**, check it, and click **Publish to Live**.

## Not yet included
Sign-in, saved plans, winery requests and admin approvals need a backend (planned: Firebase with Google sign-in) and Google Maps.
