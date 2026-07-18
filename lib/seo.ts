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
  title: "Prime UAT | AAU UAT Preparation, Practice and Mock Exams",
  description:
    "Prepare for the Addis Ababa University Undergraduate Admission Test with focused practice questions, realistic mock exams, study guides, cutoff points, and tuition information.",
  locale: "en_ET",
  author: "Prime UAT Editorial Team",
};

export function absoluteUrl(path = "/") {
  return new URL(path, `${seo.siteUrl}/`).toString();
}
