import type { Metadata } from "next";
import { AftercareCompanion } from "@/components/AftercareCompanion";

export const metadata: Metadata = {
  title: "Aftercare Guide — LaLuBa.ink by Laura",
  description:
    "Persönlicher Tattoo-Pflege- & Heilungsguide von LaLuBa.ink (Fürth bei Nürnberg).",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AftercarePage() {
  return <AftercareCompanion />;
}
