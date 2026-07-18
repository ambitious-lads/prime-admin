import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

const publicRoutes = [
  { path: "/", priority: 1, frequency: "weekly" },
  { path: "/uat-guide", priority: 0.95, frequency: "monthly" },
  { path: "/cutoff-points", priority: 0.85, frequency: "yearly" },
  { path: "/tuition", priority: 0.85, frequency: "yearly" },
  { path: "/about", priority: 0.65, frequency: "yearly" },
  { path: "/privacy-policy", priority: 0.3, frequency: "yearly" },
  { path: "/terms", priority: 0.3, frequency: "yearly" },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-07-18");
  return publicRoutes.map(({ path, priority, frequency }) => ({
    url: absoluteUrl(path), lastModified, changeFrequency: frequency, priority,
  }));
}
