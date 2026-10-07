import type { Metadata } from "next";
import { Manrope, Nunito } from "next/font/google";
import "./globals.css";

const bodyFont = Manrope({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const displayFont = Nunito({ subsets: ["latin"], variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  title: "OpportunusAI Dashboard | Demo",
  description: "Painel demonstrativo com dados inteiramente sintéticos."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body className={`${bodyFont.variable} ${displayFont.variable}`}>{children}</body></html>;
}
