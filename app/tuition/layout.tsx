import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AAU Undergraduate Tuition Fees",
  description: "Review Addis Ababa University undergraduate tuition fee categories for Ethiopian and international students by field of study.",
  alternates: { canonical: "/tuition" },
  openGraph: { title: "AAU Undergraduate Tuition Fees", description: "Search undergraduate tuition fee categories by program and student classification.", url: "/tuition", type: "website" },
};

export default function TuitionLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
