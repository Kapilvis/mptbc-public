/**
 * OIDC ID Token profile claims issued by the OpenIddict auth server.
 * Shape is derived from the JWT payload returned by https://localhost:5100/
 */
export interface WcdUserProfile {
  /** Issuer - the auth server base URL */
  iss: string;

  /** Expiry timestamp (Unix epoch seconds) */
  exp: number;

  /** Issued-at timestamp (Unix epoch seconds) */
  iat: number;

  /** Audience - always "spa-client" */
  aud: string;

  /** Subject - the user's unique GUID identifier */
  sub: string;

  /** Display name (username) e.g. "admin" */
  name: string;

  /** OpenIddict authorization ID */
  oi_au_id: string;

  /** OpenIddict token ID */
  oi_tkn_id: string;

  /** Email address (optional — only present if email scope granted) */
  email?: string;

  /** Role(s) assigned to the user (optional) */
  role?: string | string[];
}
