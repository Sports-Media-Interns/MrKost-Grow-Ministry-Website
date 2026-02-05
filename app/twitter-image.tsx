import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Grow Ministry - AI-Powered Digital Solutions for Churches";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#5B7F5E",
          backgroundImage: "linear-gradient(135deg, #5B7F5E 0%, #4A6A4D 50%, #3D5840 100%)",
        }}
      >
        {/* Logo circle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 140,
            height: 140,
            borderRadius: "50%",
            backgroundColor: "#F5F0E8",
            marginBottom: 32,
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "#5B7F5E",
            }}
          >
            GM
          </div>
        </div>

        {/* Main title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: "#F5F0E8",
              textAlign: "center",
              lineHeight: 1.1,
              textShadow: "0 2px 10px rgba(0,0,0,0.2)",
            }}
          >
            Grow Ministry
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 400,
              color: "#F5F0E8",
              opacity: 0.9,
              marginTop: 16,
              textAlign: "center",
            }}
          >
            AI-Powered Digital Solutions for Churches
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginTop: 48,
          }}
        >
          <div
            style={{
              fontSize: 20,
              color: "#B8A088",
              fontWeight: 500,
              padding: "10px 20px",
              borderRadius: 8,
              backgroundColor: "rgba(255,255,255,0.1)",
            }}
          >
            CRM
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#B8A088",
              fontWeight: 500,
              padding: "10px 20px",
              borderRadius: 8,
              backgroundColor: "rgba(255,255,255,0.1)",
            }}
          >
            Websites
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#B8A088",
              fontWeight: 500,
              padding: "10px 20px",
              borderRadius: 8,
              backgroundColor: "rgba(255,255,255,0.1)",
            }}
          >
            AI Phone Agents
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#B8A088",
              fontWeight: 500,
              padding: "10px 20px",
              borderRadius: 8,
              backgroundColor: "rgba(255,255,255,0.1)",
            }}
          >
            SEO
          </div>
        </div>

        {/* Footer badge */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            right: 40,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              fontSize: 14,
              color: "#F5F0E8",
              opacity: 0.7,
            }}
          >
            SDVOSB Certified | Veteran-Owned
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
