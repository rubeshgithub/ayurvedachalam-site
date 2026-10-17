import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

// architecture.md §9: generated OG image with the H1 and the brand colours.
export function GET(req: NextRequest) {
  const title = (req.nextUrl.searchParams.get("title") || "Ayurvedachalam").slice(0, 110);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#FAF6EE", color: "#1E2A25", fontFamily: "Georgia, serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 28, color: "#1F4D3F" }}>Ayurvedachalam<div style={{ width: 12, height: 16, background: "#A9502A", borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%" }} /></div>
        <div style={{ fontSize: title.length > 60 ? 56 : 68, lineHeight: 1.08, letterSpacing: -1 }}>{title}</div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#5E6B64", fontFamily: "sans-serif" }}><span>Ayurveda · Therapies · Spiritual Healing — Calgary</span><span>ayurvedachalam.com</span></div>
        <div style={{ position: "absolute", left: 600, top: 0, width: 2, height: 630, background: "linear-gradient(#FAF6EE, #A9502A 15%, #A9502A 85%, #FAF6EE)", opacity: 0.5 }} />
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
