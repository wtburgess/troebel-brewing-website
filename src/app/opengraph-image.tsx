import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Troebel Brewing Co. | Hopmerkelijke Brouwsels uit Antwerpen";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#1C1C1C",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 12,
            background: "#D4A017",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 12,
            background: "#D4A017",
          }}
        />
        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: "#D4A017",
            letterSpacing: "-2px",
            lineHeight: 1,
            marginBottom: 16,
          }}
        >
          TROEBEL
        </div>
        <div
          style={{
            fontSize: 36,
            color: "#FFFDF7",
            letterSpacing: "8px",
            marginBottom: 40,
            textTransform: "uppercase",
          }}
        >
          Brewing Co.
        </div>
        <div
          style={{
            width: 120,
            height: 4,
            background: "#D4A017",
            marginBottom: 40,
          }}
        />
        <div
          style={{
            fontSize: 28,
            color: "#FFFDF7",
            opacity: 0.8,
            textAlign: "center",
            maxWidth: 700,
          }}
        >
          Hopmerkelijke Brouwsels uit Antwerpen
        </div>
      </div>
    ),
    { ...size }
  );
}
