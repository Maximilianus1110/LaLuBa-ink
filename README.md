# LaLuBa.ink — Tattoo's by Laura (Fürth bei Nürnberg)

Mobile-first Next.js (App Router), Three.js & GSAP Webseite für **Laura (`@laluba.ink`)**, Beginner Tattoo Artist in Fürth bei Nürnberg.

## Features
- **Originalgetreues Vektor-SVG-Logo (`LaLuBa.ink`)**: Per GSAP animiert (`public/logo.svg` & `src/components/LaLuBaLogo.tsx`).
- **3D Liquid-Silk Hero**: Interaktiver Three.js WebGL-Shader (`src/components/InkCanvas3D.tsx`).
- **Atelier & Top-3 Art Gallery**: Kuratierte Darstellung der 3 Hauptwerke mit nativer `<dialog>`-Detailansicht.
- **Instagram-Einbindung (`@laluba.ink`)**: Kompaktes 6er-Grid mit `/api/instagram`-Sync.
- **Kontakt & Optionaler 3-Tap Ideen-Konfigurator**: Direkte Links zu Instagram DM & WhatsApp, Hinweis *„Preise individuell nach Absprache“* sowie optionaler Referenzbild-Upload.
- **Aftercare & TouchUp Guide**: Nach den Studio-Flyern aufbereitet.

## Lokal starten

```bash
npm install
npm run dev
```

## Konfiguration
- **WhatsApp-Nummer & Studio-Daten**: In `src/config/studio.ts` (`whatsappNumber`) anpassen.
- **Live-Instagram-Sync (optional)**: In `.env.local` bzw. Vercel Environment Variables `INSTAGRAM_ACCESS_TOKEN` oder `INSTAGRAM_FEED_URL` setzen.

## Online-Demo auf Vercel deployen
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Maximilianus1110/LaLuBa-ink)
