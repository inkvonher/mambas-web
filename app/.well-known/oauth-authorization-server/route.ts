import { NextResponse } from "next/server";

const siteUrl = (process.env.SITE_URL || "https://mambaspdc.com").replace(
  /\/$/,
  "",
);

export async function GET() {
  const oauthServerMetadata = {
    issuer: siteUrl,
    authorization_endpoint: `${siteUrl}/api/auth/authorize`,
    token_endpoint: `${siteUrl}/api/auth/token`,
    jwks_uri: `${siteUrl}/.well-known/jwks.json`,
    grant_types_supported: ["client_credentials", "anonymous"],
    response_types_supported: ["token"],
    scopes_supported: ["public:read", "appointments:create"],
    agent_auth: {
      skill: `${siteUrl}/.well-known/agent-skills/booking/SKILL.md`,
      register_uri: `${siteUrl}/api/auth/register`,
      identity_types_supported: ["anonymous"],
      anonymous: {
        credential_types_supported: ["ephemeral_token"],
        claim_uri: `${siteUrl}/api/auth/anonymous-claim`,
      },
    },
  };

  return NextResponse.json(oauthServerMetadata, {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
