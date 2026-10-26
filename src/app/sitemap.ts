import type { MetadataRoute } from "next";
import { topics } from "@/data/topics";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/work",
    "/privacy",
    "/terms",
    ...topics.map((topic) => `/work/${topic.slug}`),
  ].map((route) => ({ url: `https://asdatable.com${route}` }));
}
