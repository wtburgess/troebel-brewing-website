import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://troebelbrewing.be/",
      priority: 1.0,
      changeFrequency: "weekly",
      lastModified: new Date(),
    },
    {
      url: "https://troebelbrewing.be/webshop/",
      priority: 0.9,
      changeFrequency: "weekly",
      lastModified: new Date(),
    },
    {
      url: "https://troebelbrewing.be/horeca/",
      priority: 0.8,
      changeFrequency: "monthly",
      lastModified: new Date("2025-01-01"),
    },
    {
      url: "https://troebelbrewing.be/verhaal/",
      priority: 0.7,
      changeFrequency: "monthly",
      lastModified: new Date("2025-01-01"),
    },
    {
      url: "https://troebelbrewing.be/voorwaarden/",
      priority: 0.3,
      changeFrequency: "yearly",
      lastModified: new Date("2025-01-01"),
    },
  ];
}
