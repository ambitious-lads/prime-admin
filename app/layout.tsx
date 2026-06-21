import type { Metadata } from "next";
import { Sora, Plus_Jakarta_Sans, Archivo_Black } from "next/font/google";
import "./globals.css";

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
  title: "Primely — Your complete exam prep companion",
  description:
    "Practice sets, full-length mock tests, courses, and progress analytics in one focused app. Built for students preparing for competitive exams.",
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
      <body className="min-h-full bg-background text-ink">{children}</body>
    </html>
  );
}
