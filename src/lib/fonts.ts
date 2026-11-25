import { Great_Vibes, LINE_Seed_JP } from "next/font/google";

export const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["cyrillic", "latin"],
  variable: "--font-great-vibes",
  display: "swap",
});

export const lineSeed = LINE_Seed_JP({
  weight: ["400", "700"],
  subsets: ["cyrillic", "latin"],
  variable: "--font-line-seed",
  display: "swap",
  adjustFontFallback: false,
});
