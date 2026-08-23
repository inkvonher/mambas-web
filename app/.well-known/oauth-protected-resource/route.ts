import { NextResponse } from "next/server";

const siteUrl = (process.env.SITE_URL || "https://mambaspdc.com").replace(
  /\/$/,
  "",
);

export async function GET() {
  const prm = {
    resource: siteUrl,
    authorization_servers: [siteUrl],
    scopes_supported: ["public:read", "appointments:create"],
    bearer_methods_supported: ["header"],
  };

  return NextResponse.json(prm, {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
