import { ImageResponse } from "next/og";
import { APP_DOMAIN } from "@/lib/constants";

const size = {
  width: 1200,
  height: 630,
};

function OgNotebookImage() {
  return (
    <div
      style={{
        alignItems: "center",
        background:
          "linear-gradient(90deg, rgba(255,111,181,0.16) 1px, transparent 1px), linear-gradient(0deg, rgba(44,125,255,0.12) 1px, transparent 1px), #fff8e8",
        backgroundSize: "56px 56px",
        color: "#241b2f",
        display: "flex",
        fontFamily: "Arial, Helvetica, sans-serif",
        height: "100%",
        justifyContent: "center",
        padding: "64px",
        width: "100%",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.86)",
          border: "3px solid rgba(36,27,47,0.16)",
          borderRadius: "42px",
          boxShadow: "0 32px 80px rgba(36,27,47,0.18)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "58px 64px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            background: "rgba(255,232,122,0.78)",
            borderRadius: "18px",
            height: "52px",
            left: "50%",
            opacity: 0.92,
            position: "absolute",
            top: "-24px",
            transform: "translateX(-50%) rotate(-2deg)",
            width: "210px",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div
            style={{
              background: "#ffe87a",
              border: "2px solid rgba(36,27,47,0.16)",
              borderRadius: "999px",
              color: "#241b2f",
              display: "flex",
              fontSize: 28,
              fontWeight: 800,
              padding: "14px 26px",
            }}
          >
            Bez registracije
          </div>
          <div
            style={{
              background: "#ff6fb5",
              borderRadius: "999px",
              color: "#ffffff",
              display: "flex",
              fontSize: 36,
              fontWeight: 900,
              padding: "12px 24px",
              transform: "rotate(3deg)",
            }}
          >
            ✨ beta
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <h1
            style={{
              fontSize: 108,
              fontWeight: 950,
              letterSpacing: 0,
              lineHeight: 0.95,
              margin: 0,
              maxWidth: 880,
            }}
          >
            Upiši se ✨
          </h1>
          <p
            style={{
              color: "#5e526d",
              fontSize: 42,
              fontWeight: 700,
              lineHeight: 1.18,
              margin: 0,
              maxWidth: 880,
            }}
          >
            Digitalni leksikon kao iz osnovne
          </p>
        </div>
        <div
          style={{
            alignItems: "center",
            display: "flex",
            fontSize: 30,
            fontWeight: 800,
            justifyContent: "space-between",
          }}
        >
          <span>Pošalji link frendicama</span>
          <span style={{ color: "#2c7dff" }}>{APP_DOMAIN}</span>
        </div>
      </div>
    </div>
  );
}

export async function GET() {
  return new ImageResponse(<OgNotebookImage />, size);
}
