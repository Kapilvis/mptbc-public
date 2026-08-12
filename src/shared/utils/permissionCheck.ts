export function hasPermission(
  permissions?: Record<string, string[]>,
  feature?: string,
  action?: string,
) {
  if (permissions && feature && action) {
    return true;
  }
  return true;
}
