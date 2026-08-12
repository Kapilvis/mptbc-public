const authority =
  (import.meta.env.VITE_AUTH_BASE as string) ?? "https://localhost:5100";

export const AUTH_CONFIG = {
  authority,
  client_id: (import.meta.env.VITE_CLIENT_ID as string) ?? "spa-client",
  redirect_uri:
    (import.meta.env.VITE_AUTHORIZE_REDIRECT as string) ??
    `${window.location.origin}/callback`,
  post_logout_redirect_uri:
    (import.meta.env.VITE_POST_LOGOUT_URI as string) ??
    `${window.location.origin}/callback`,
  scope:
    (import.meta.env.VITE_AUTHORIZE_SCOPE as string) ??
    "openid scp:profile scp:email offline_access identity.api",
  apiBaseUrl: import.meta.env.VITE_API_BASE ?? "http://localhost:5220",
} as const;
