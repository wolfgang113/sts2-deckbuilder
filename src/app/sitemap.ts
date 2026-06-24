import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://stsdeck.com";

  const routes = [
    "",
    "/cards",
    "/deckbuilder",
    "/decks",
    "/guides",
    "/guides/new",
    "/relics",
    "/potions",
    "/bosses",
    "/feedback",
    "/login",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
