import { ImageResponse } from "next/og";
import { APP_DOMAIN } from "@/lib/constants";
import { getPublicLexiconMetadata } from "@/lib/public-lexicon-metadata";

type LexiconOgRouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

const size = {
  width: 1200,
  height: 630,
};

function getTitleFontSize(title: string): number {
  if (title.length > 56) {
    return 56;
  }

  if (title.length > 44) {
    return 66;
  }

  if (title.length > 34) {
    return 76;
  }

  return 90;
}

function LexiconOgImage({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const titleFontSize = getTitleFontSize(title);

  return (
    <div
      style={{
        alignItems: "center",
        background:
          "linear-gradient(90deg, rgba(255,111,181,0.15) 1px, transparent 1px), linear-gradient(0deg, rgba(44,125,255,0.12) 1px, transparent 1px), #fff8e8",
        backgroundSize: "54px 54px",
        color: "#241b2f",
        display: "flex",
        fontFamily: "Arial, Helvetica, sans-serif",
        height: "100%",
        justifyContent: "center",
        padding: "62px",
        width: "100%",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.88)",
          border: "3px solid rgba(36,27,47,0.16)",
          borderRadius: "40px",
          boxShadow: "0 32px 80px rgba(36,27,47,0.18)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "54px 62px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            background: "rgba(189,118,255,0.26)",
            borderRadius: "999px",
            bottom: "96px",
            height: "130px",
            position: "absolute",
            right: "64px",
            width: "130px",
          }}
        />
        <div
          style={{
            background: "rgba(255,232,122,0.78)",
            borderRadius: "18px",
            height: "50px",
            left: "70px",
            opacity: 0.92,
            position: "absolute",
            top: "-22px",
            transform: "rotate(-5deg)",
            width: "210px",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div
            style={{
              background: "#ff6fb5",
              borderRadius: "999px",
              color: "#ffffff",
              display: "flex",
              fontSize: 30,
              fontWeight: 900,
              padding: "13px 24px",
              transform: "rotate(-2deg)",
            }}
          >
            Pozivnica za leksikon
          </div>
          <div
            style={{
              background: "#8bd95d",
              border: "2px solid rgba(36,27,47,0.16)",
              borderRadius: "999px",
              display: "flex",
              fontSize: 34,
              fontWeight: 900,
              padding: "12px 24px",
              transform: "rotate(4deg)",
            }}
          >
            💿 ✨
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <h1
            style={{
              fontSize: titleFontSize,
              fontWeight: 950,
              letterSpacing: 0,
              lineHeight: 0.98,
              margin: 0,
              maxWidth: 930,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              color: "#5e526d",
              fontSize: 38,
              fontWeight: 750,
              lineHeight: 1.18,
              margin: 0,
              maxWidth: 820,
            }}
          >
            {subtitle}
          </p>
        </div>
        <div
          style={{
            alignItems: "center",
            display: "flex",
            fontSize: 30,
            fontWeight: 850,
            justifyContent: "space-between",
          }}
        >
          <span>Bez registracije. Privatni linkovi.</span>
          <span style={{ color: "#2c7dff" }}>{APP_DOMAIN}</span>
        </div>
      </div>
    </div>
  );
}

export async function GET(_request: Request, { params }: LexiconOgRouteContext) {
  const { slug } = await params;
  const lexicon = await getPublicLexiconMetadata(slug);
  const title = lexicon
    ? `${lexicon.ownerName} te zove u leksikon ✨`
    : "Upiši se ✨";
  const subtitle = lexicon
    ? "Upiši se kao nekad u osnovnoj"
    : "Digitalni leksikon kao iz osnovne";

  return new ImageResponse(
    <LexiconOgImage subtitle={subtitle} title={title} />,
    size,
  );
}
