import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LaLuBa.ink — Tattoo's by Laura | Fürth & Nürnberg",
  description:
    "Minimalistische, präzise Tattoos in Fürth bei Nürnberg. Fine-Line, Script, Illustrativ & Wannados von Laura (@laluba.ink). Preise individuell nach Absprache.",
  icons: {
    icon: "/logo-original.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#050506",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${bodoniModa.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen bg-[#050506] text-[#f2f0f1] selection:bg-[#d9789b] selection:text-[#050506]">
        <div id="scroll-progress" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
