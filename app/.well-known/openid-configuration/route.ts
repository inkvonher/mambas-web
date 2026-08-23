import { NextResponse } from "next/server";

const siteUrl = (process.env.SITE_URL || "https://mambaspdc.com").replace(
  /\/$/,
  "",
);

export async function GET() {
  const oidcMetadata = {
    issuer: siteUrl,
    authorization_endpoint: `${siteUrl}/api/auth/authorize`,
    token_endpoint: `${siteUrl}/api/auth/token`,
    jwks_uri: `${siteUrl}/.well-known/jwks.json`,
    registration_endpoint: `${siteUrl}/api/auth/register`,
    revocation_endpoint: `${siteUrl}/api/auth/revoke`,
    response_types_supported: ["token", "id_token"],
    subject_types_supported: ["public"],
    id_token_signing_alg_values_supported: ["RS256"],
    scopes_supported: ["openid", "public:read", "appointments:create"],
    token_endpoint_auth_methods_supported: ["none", "client_secret_post"],
    agent_auth: {
      skill: `${siteUrl}/auth.md`,
      register_uri: `${siteUrl}/api/auth/register`,
      claim_uri: `${siteUrl}/api/auth/claim`,
      revocation_uri: `${siteUrl}/api/auth/revoke`,
      events_supported: ["revocation"],
      identity_types_supported: ["anonymous", "identity_assertion"],
      identity_assertion: {
        assertion_types_supported: [
          "urn:ietf:params:oauth:token-type:id-jag",
          "verified_email",
        ],
        credential_types_supported: ["ephemeral_token", "bearer"],
        claim_uri: `${siteUrl}/api/auth/claim`,
      },
      anonymous: {
        credential_types_supported: ["ephemeral_token", "bearer"],
        claim_uri: `${siteUrl}/api/auth/claim`,
      },
    },
  };

  return NextResponse.json(oidcMetadata, {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
