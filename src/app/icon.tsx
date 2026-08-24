import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#14171f",
          borderRadius: 6,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="3.2" fill="#818cf8" />
          <ellipse
            cx="16"
            cy="16"
            rx="14"
            ry="6"
            stroke="#818cf8"
            strokeWidth="1.8"
            transform="rotate(-24 16 16)"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
