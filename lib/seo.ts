const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.VERCEL_PROJECT_PRODUCTION_URL ??
  process.env.VERCEL_URL;

const normalizedSiteUrl = configuredSiteUrl
  ? configuredSiteUrl.startsWith("http")
    ? configuredSiteUrl
    : `https://${configuredSiteUrl}`
  : "http://localhost:3000";

export const seo = {
  siteUrl: normalizedSiteUrl.replace(/\/$/, ""),
  siteName: "Prime UAT",
  title:
    "Prime UAT | UAT Preparation, Practice and Mock Exams for Addis Ababa University (AAU) Undergraduate Admission",
  description:
    "Prepare for the UAT (Addis Ababa University Undergraduate Admission Test) with focused practice questions, realistic UAT mock exams, study guides, AAU cutoff points, and tuition information for undergraduate students.",
  locale: "en_ET",
  author: "Prime UAT Editorial Team",
};

export function absoluteUrl(path = "/") {
  return new URL(path, `${seo.siteUrl}/`).toString();
}
