/**
 * Utility to format asset paths correctly both in local development (base: "/")
 * and when deployed on GitHub Pages or subpath (base: "/mptbc-public/").
 */
export const getAssetUrl = (path: string): string => {
  if (!path) return "";
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:") ||
    path.startsWith("blob:")
  ) {
    return path;
  }
  const baseUrl = import.meta.env.BASE_URL || "/";
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  const cleanBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return `${cleanBase}${cleanPath}`;
};
