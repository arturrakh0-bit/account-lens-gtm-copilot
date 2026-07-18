import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://lens.arturrakhimullin.com"),
  title: "Account Lens — Evidence-first GTM Copilot",
  description: "A local-first account research, qualification, and human review prototype.",
  openGraph: {
    title: "Account Lens — Evidence-first GTM Copilot",
    description: "Research, score, and review accounts with visible evidence and deterministic logic.",
    type: "website",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "Account Lens — Evidence-first GTM qualification" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Account Lens — Evidence-first GTM Copilot",
    description: "Research · Score · Review",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
