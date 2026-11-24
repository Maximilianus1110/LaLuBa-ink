export const STUDIO_CONFIG = {
  brandName: "LaLuBa.ink",
  artistName: "Laura",
  subtitle: "Tattoo's by Laura",
  location: "Fürth / Nürnberg",
  locationShort: "Fürth bei Nürnberg",
  roleLabel: "Beginner Tattoo Artist",
  tagline: "Schicke mir deine Idee und wir bringen sie unter deine Haut.",
  pricingNote: "Preise immer individuell nach Absprache",
  instagramHandle: "@laluba.ink",
  instagramUrl: "https://www.instagram.com/laluba.ink/",
  // Platzhalter-Nummer — hier einfach Lauras echte WhatsApp-Nummer im Format 4917... eintragen
  whatsappNumber: "491700000000",
  whatsappPlaceholderNotice:
    "Hinweis: Aktuell ist eine Platzhalter-Nummer hinterlegt (in src/config/studio.ts anpassbar).",
} as const;

export interface TattooWork {
  id: string;
  title: string;
  category: string;
  placement: string;
  sizeHint: string;
  image: string;
  description: string;
  highlightTag: string;
  configVibe: string;
}

export const TOP_THREE_WORKS: TattooWork[] = [
  {
    id: "bugs-lola",
    title: "All Eyes On Me — Bugs & Lola",
    category: "Illustrativ / Character",
    placement: "Oberschenkel / Großflächig",
    sizeHint: "Statement Piece (ca. 18–22 cm)",
    image: "/portfolio/bugs_lola.png",
    description:
      "Ausdrucksstarkes Character-Duo mit feinen Stipple-Schattierungen, kleinen Fine-Line-Herzen und geschwungenem Custom Lettering.",
    highlightTag: "01 · Highlight Piece",
    configVibe: "Illustrativ / Character",
  },
  {
    id: "la-vida-es-prestada",
    title: "La Vida Es Prestada",
    category: "Fine-Line & Script",
    placement: "Oberschenkel",
    sizeHint: "Large Script (ca. 16–20 cm)",
    image: "/portfolio/la_vida_es_prestada.png",
    description:
      "Fließende Calligraffiti-Linien mit eleganten Schwüngen, exakt an die Körperlinie angepasst — sauber gestochen mit feinen Konturen.",
    highlightTag: "02 · Signature Script",
    configVibe: "Fine-Line & Script",
  },
  {
    id: "angel-wings",
    title: "Heaven's Footprints",
    category: "Partner-Tattoo",
    placement: "Unterarm / Paar",
    sizeHint: "Partner-Duo (je ca. 7–9 cm)",
    image: "/portfolio/angel_wings.png",
    description:
      "Persönliches Erinnerungs- & Partner-Tattoo mit filigranen Engelsflügeln, Heiligenschein und fein ausgearbeiteten Baby-Fußabdrücken.",
    highlightTag: "03 · Emotional Duo",
    configVibe: "Partner-Tattoo",
  },
];

export interface InstaPost {
  id: string;
  title: string;
  caption: string;
  image: string;
  type: "gestochen" | "wannado";
  tag: string;
  vibe: string;
}

export const INSTAGRAM_POSTS: InstaPost[] = [
  {
    id: "napoli-1926",
    title: "1926 NAPOLI",
    caption: "Klassisches Serif-Lettering sauber ausgefüllt auf dem Oberschenkel.",
    image: "/portfolio/napoli_1926.png",
    type: "gestochen",
    tag: "Bold Lettering",
    vibe: "Fine-Line & Script",
  },
  {
    id: "red-ink-liebe",
    title: "Red Ink — حب (Liebe)",
    caption: "Zartes arabisches Schriftzeichen in leuchtender Red Ink.",
    image: "/portfolio/red_ink_liebe.png",
    type: "gestochen",
    tag: "Red Ink",
    vibe: "Red Ink / Micro",
  },
  {
    id: "script-ribs",
    title: "Vertical Rib Script",
    caption: "Langes, filigranes Rippen-Lettering entlang der Körperlinie.",
    image: "/portfolio/script_ribs.png",
    type: "gestochen",
    tag: "Fine-Line",
    vibe: "Fine-Line & Script",
  },
  {
    id: "smile-face",
    title: "SMILE Sketch",
    caption: "Roher Brush-Smiley direkt vom Stencil unter die Haut gebracht.",
    image: "/portfolio/smile_face.png",
    type: "gestochen",
    tag: "Sketch Style",
    vibe: "Illustrativ / Character",
  },
  {
    id: "process-foam",
    title: "Behind the Needle — 449",
    caption: "Einblick aus dem Studio in Fürth — sauber arbeiten & Wohlfühl-Vibe.",
    image: "/portfolio/process_foam.png",
    type: "gestochen",
    tag: "Studio Process",
    vibe: "Fine-Line & Script",
  },
  {
    id: "wannado-butterfly",
    title: "Cyber-Gothic Butterfly",
    caption: "Wannado-Inspiration mit Blackwork-Stippling & Neon-Pink-Akzenten.",
    image: "/portfolio/wannado_butterfly.jpg",
    type: "wannado",
    tag: "Wannado",
    vibe: "Wannado-Inspiration",
  },
  {
    id: "wannado-dagger-rose",
    title: "Dagger & Rose",
    caption: "Gothic Romance Klassiker mit Dolch, Rose und feinen Sparkles.",
    image: "/portfolio/wannado_dagger_rose.jpg",
    type: "wannado",
    tag: "Wannado",
    vibe: "Wannado-Inspiration",
  },
  {
    id: "wannado-barbed-heart",
    title: "Dark Romance Key",
    caption: "Stacheldraht-Herz mit Vintage-Schlüssel & Blush-Akzent.",
    image: "/portfolio/wannado_barbed_heart.jpg",
    type: "wannado",
    tag: "Wannado",
    vibe: "Wannado-Inspiration",
  },
  {
    id: "wannado-cherub",
    title: "Punk Angel Cherub",
    caption: "Rebellischer Tattoo-Cherub mit Sternen & Gothic-Charme.",
    image: "/portfolio/wannado_cherub.jpg",
    type: "wannado",
    tag: "Wannado",
    vibe: "Wannado-Inspiration",
  },
];

export const AFTERCARE_STEPS = [
  {
    id: "folie",
    step: "01",
    title: "Folie entfernen",
    badge: "FOLIE ENTFERNEN",
    points: [
      "Folie nach der vereinbarten Zeit entfernen (meist nach 48 Std., je nach Absprache).",
      "Tattoo vorsichtig mit lauwarmem Wasser und milder, parfümfreier Seife reinigen.",
      "Sanft mit einem sauberen, fusselfreien Tuch abtupfen (nicht rubbeln!).",
    ],
  },
  {
    id: "pflege",
    step: "02",
    title: "Tägliche Pflege",
    badge: "PFLEGE",
    points: [
      "Dünn mit der empfohlenen Tattoo-Salbe eincremen.",
      "2–3× täglich wiederholen.",
      "Nur so viel Salbe verwenden, dass das Tattoo nicht austrocknet und die Haut atmen kann.",
      "Hände vor der Pflege immer gründlich waschen.",
    ],
  },
  {
    id: "vermeiden",
    step: "03",
    title: "Das solltest du vermeiden",
    badge: "VERMEIDEN",
    points: [
      "Kein direktes Sonnenlicht oder Solarium.",
      "Kein Schwimmen, Sauna, Dampfbad oder Whirlpool.",
      "Keine enge, reibende Kleidung über der frischen Stelle.",
      "Nicht kratzen, pellen oder Krusten abziehen.",
      "Keine stark verschwitzten Sporteinheiten in den ersten Tagen.",
      "In den ersten 4 Tagen keinen Alkohol.",
    ],
  },
  {
    id: "heilung",
    step: "04",
    title: "Heilungszeit",
    badge: "HEILUNGSZEIT",
    points: [
      "Die äußere Heilungsphase dauert in der Regel 2–4 Wochen.",
      "Je nach Körperstelle und Hauttyp kann es etwas länger dauern.",
      "Während der Heilung kann das Tattoo leicht spannen, jucken oder sich schälen — das ist völlig normal.",
    ],
  },
] as const;

export const TOUCHUP_INFO = {
  title: "TOUCHUP",
  subtitle: "Gut gepflegt — für ein langes, schönes Ergebnis",
  points: [
    "Falls nötig, ist ein kostenloser TouchUp nach vollständiger Abheilung möglich.",
    "Der Termin hierfür sollte innerhalb der Heilungsphase (bis zu 6 Wochen nach dem Termin) vereinbart werden.",
    "Danach gelten reguläre Preise.",
  ],
  alert:
    "Bei Unsicherheiten, starken Rötungen, anhaltenden Schmerzen oder anderen Auffälligkeiten melde dich bitte jederzeit bei mir.",
} as const;
