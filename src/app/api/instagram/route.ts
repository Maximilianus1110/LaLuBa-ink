import { NextResponse } from "next/server";
import { STUDIO_CONFIG } from "@/config/studio";

export const revalidate = 1800; // Alle 30 Minuten synchronisieren

export interface SyncedInstaPost {
  id: string;
  title: string;
  caption: string;
  image: string;
  permalink: string;
  tag: string;
  vibe: string;
  timestamp?: string;
}

const FALLBACK_LATEST_SIX: SyncedInstaPost[] = [
  {
    id: "napoli-1926",
    title: "1926 NAPOLI",
    caption: "Klassisches Serif-Lettering sauber ausgefüllt auf dem Oberschenkel.",
    image: "/portfolio/napoli_1926.png",
    permalink: STUDIO_CONFIG.instagramUrl,
    tag: "Lettering",
    vibe: "Fine-Line & Script",
  },
  {
    id: "red-ink-liebe",
    title: "Red Ink — حب (Liebe)",
    caption: "Zartes arabisches Schriftzeichen in leuchtender Red Ink.",
    image: "/portfolio/red_ink_liebe.png",
    permalink: STUDIO_CONFIG.instagramUrl,
    tag: "Red Ink",
    vibe: "Red Ink / Micro",
  },
  {
    id: "process-foam",
    title: "Behind the Needle — 449",
    caption: "Einblick aus dem Studio in Fürth — sauberes Arbeiten & Wohlfühl-Vibe.",
    image: "/portfolio/process_foam.png",
    permalink: STUDIO_CONFIG.instagramUrl,
    tag: "Studio",
    vibe: "Fine-Line & Script",
  },
  {
    id: "script-ribs",
    title: "Vertical Rib Script",
    caption: "Langes, filigranes Rippen-Lettering entlang der Körperlinie.",
    image: "/portfolio/script_ribs.png",
    permalink: STUDIO_CONFIG.instagramUrl,
    tag: "Fine-Line",
    vibe: "Fine-Line & Script",
  },
  {
    id: "la-vida-es-prestada",
    title: "La Vida Es Prestada",
    caption: "Fließende Calligraffiti-Linien auf dem Oberschenkel.",
    image: "/portfolio/la_vida_es_prestada.png",
    permalink: STUDIO_CONFIG.instagramUrl,
    tag: "Script",
    vibe: "Fine-Line & Script",
  },
  {
    id: "smile-face",
    title: "SMILE Sketch",
    caption: "Roher Brush-Smiley direkt vom Stencil unter die Haut gebracht.",
    image: "/portfolio/smile_face.png",
    permalink: STUDIO_CONFIG.instagramUrl,
    tag: "Sketch",
    vibe: "Illustrativ / Character",
  },
];

interface GraphMediaItem {
  id: string;
  caption?: string;
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
}

export async function GET() {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const feedUrl = process.env.INSTAGRAM_FEED_URL;

  try {
    if (feedUrl) {
      const res = await fetch(feedUrl, { next: { revalidate: 1800 } });
      if (res.ok) {
        const json = await res.json();
        const rawList: GraphMediaItem[] = Array.isArray(json)
          ? json
          : Array.isArray(json?.posts)
            ? json.posts
            : Array.isArray(json?.data)
              ? json.data
              : [];

        const posts = rawList
          .filter((item) => item.media_url || item.thumbnail_url)
          .slice(0, 6)
          .map((item, idx) => ({
            id: item.id || `ig-${idx}`,
            title: (item.caption || "@laluba.ink").split("\n")[0].slice(0, 42),
            caption: item.caption || "Aktueller Beitrag auf @laluba.ink",
            image: item.thumbnail_url || item.media_url || "/portfolio/smile_face.png",
            permalink: item.permalink || STUDIO_CONFIG.instagramUrl,
            tag: "Instagram",
            vibe: "Fine-Line & Script",
            timestamp: item.timestamp,
          }));

        if (posts.length > 0) {
          return NextResponse.json({
            synced: true,
            source: "feed",
            posts,
          });
        }
      }
    }

    if (accessToken) {
      const endpoint = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=6&access_token=${encodeURIComponent(
        accessToken
      )}`;
      const res = await fetch(endpoint, { next: { revalidate: 1800 } });
      if (res.ok) {
        const json = await res.json();
        const rawList: GraphMediaItem[] = Array.isArray(json?.data) ? json.data : [];
        const posts = rawList
          .filter((item) => item.media_url || item.thumbnail_url)
          .slice(0, 6)
          .map((item) => ({
            id: item.id,
            title: (item.caption || "@laluba.ink").split("\n")[0].slice(0, 42),
            caption: item.caption || "Aktueller Beitrag auf @laluba.ink",
            image:
              item.media_type === "VIDEO"
                ? item.thumbnail_url || item.media_url || "/portfolio/bugs_lola.png"
                : item.media_url || item.thumbnail_url || "/portfolio/smile_face.png",
            permalink: item.permalink || STUDIO_CONFIG.instagramUrl,
            tag: "Instagram",
            vibe: "Fine-Line & Script",
            timestamp: item.timestamp,
          }));

        if (posts.length > 0) {
          return NextResponse.json({
            synced: true,
            source: "graph",
            posts,
          });
        }
      }
    }
  } catch {
    // Bei API-/Netzwerkfehler sauber auf lokale 6 Beiträge zurückfallen
  }

  return NextResponse.json({
    synced: false,
    source: "local-snapshot",
    posts: FALLBACK_LATEST_SIX,
  });
}
