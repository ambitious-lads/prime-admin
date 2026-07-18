import type { Metadata } from "next";
import { Sora, Plus_Jakarta_Sans, Archivo_Black } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { seo } from "@/lib/seo";

const display = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const body = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const accent = Archivo_Black({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  metadataBase: new URL(seo.siteUrl),
  title: { default: seo.title, template: "%s | Prime UAT" },
  description: seo.description,
  applicationName: seo.siteName,
  authors: [{ name: seo.author }],
  creator: seo.siteName,
  publisher: seo.siteName,
  category: "education",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: seo.locale,
    siteName: seo.siteName,
    title: seo.title,
    description: seo.description,
    url: "/",
    images: [{ url: "/images/prime.png", width: 1200, height: 630, alt: "Prime UAT preparation platform" }],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
    images: ["/images/prime.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  icons: { icon: "/images/logo.png", shortcut: "/images/logo.png", apple: "/images/logo.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${accent.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-ink">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
