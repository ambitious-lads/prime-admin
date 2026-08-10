import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AAU Undergraduate Cutoff Points by Program",
  description: "Search Addis Ababa University (AAU) UAT undergraduate placement cutoff points for self-sponsored and government-sponsored applicants to undergraduate programs.",
  alternates: { canonical: "/cutoff-points" },
  openGraph: { title: "AAU Undergraduate Cutoff Points", description: "Compare Addis Ababa University (AAU) UAT undergraduate placement thresholds by program and sponsorship type.", url: "/cutoff-points", type: "website" },
};

export default function CutoffPointsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
