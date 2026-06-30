import type { Metadata } from "next";
import { Sora, Plus_Jakarta_Sans, Archivo_Black } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

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
  title: "Prime UAT — Ace the University Entrance Exam, study smarter",
  description:
    "Prime UAT is the all-in-one study companion for Ethiopian students preparing for the University Entrance Exam. Curated practice, realistic mock exams, premium courses, analytics, and an AI tutor — on web and mobile.",
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
