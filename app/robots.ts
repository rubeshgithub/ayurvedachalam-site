import type { MetadataRoute } from "next";
import { abs } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const staging = process.env.STAGING === "1";
  return {
    rules: staging ? [{ userAgent: "*", disallow: "/" }] : [{ userAgent: "*", allow: "/", disallow: ["/cms", "/api/", "/styleguide", "/preview"] }],
    sitemap: abs("/sitemap.xml"),
  };
}
