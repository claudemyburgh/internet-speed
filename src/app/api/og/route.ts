export const runtime = "edge";

export async function GET() {
  // Placeholder OG image API - replace with @vercel/og or Satori later.
  const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#8b5cf6"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="black"/>
  <circle cx="300" cy="200" r="200" fill="url(#g)" opacity="0.35"/>
  <circle cx="900" cy="400" r="220" fill="url(#g)" opacity="0.35"/>
  <text x="600" y="340" fill="white" font-size="72" text-anchor="middle" font-family="Arial, Helvetica, sans-serif">Speedster</text>
  <text x="600" y="400" fill="#ddd" font-size="28" text-anchor="middle" font-family="Arial, Helvetica, sans-serif">Modern Internet Speed Test</text>
</svg>`;
  return new Response(svg, {
    headers: { "content-type": "image/svg+xml" },
  });
}