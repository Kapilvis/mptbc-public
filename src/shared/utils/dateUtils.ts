// Formats date to "dd/mm/yyyy" string
export function formatDate(date: string | Date | undefined | null): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// Formats date to localized UI format (e.g. "15 Jun 2026")
export function formatDateUI(date: string | Date | undefined | null): string {
  if (!date) return "-";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Converts date to strict "YYYY-MM-DD" string
export function formatDateToString(
  date: string | Date | undefined | null,
): string | undefined {
  if (!date) return undefined;
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return undefined;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Extracts time to 24-hour "HH:mm:ss" string
export function formatTime(
  date: string | Date | null | undefined,
): string | null {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    if (typeof date === "string" && date.includes(":")) return date;
    return null;
  }
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

// Formats time to 12-hour UI format (e.g. "05:30 PM")
export function formatTimeUI(time: string | Date | null | undefined): string {
  if (!time) return "-";
  const date = new Date(
    typeof time === "string" && !time.includes("T")
      ? `1970-01-01T${time}`
      : time,
  );
  if (isNaN(date.getTime()))
    return typeof time === "string" ? time.substring(0, 5) : "-";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/**
 * Recursively parses ISO strings and "HH:mm:ss" time strings from an API response into JavaScript Date objects.
 */
export function parseApiDates<T = unknown>(obj: unknown): T {
  if (obj === null || obj === undefined || typeof obj !== "object") {
    if (typeof obj === "string") {
      // Handle "HH:mm:ss" or "HH:mm" time strings
      if (/^\d{2}:\d{2}(:\d{2})?$/.test(obj)) {
        const [h, m, s] = obj.split(":").map(Number);
        const d = new Date();
        d.setHours(h, m, s || 0, 0);
        return d as unknown as T;
      }
      // Handle standard ISO-8601 date strings
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(obj)) {
        const d = new Date(obj);
        if (!isNaN(d.getTime())) return d as unknown as T;
      }
    }
    return obj as unknown as T;
  }

  if (obj instanceof Date) return obj as unknown as T;

  if (Array.isArray(obj)) {
    return obj.map(parseApiDates) as unknown as T;
  }

  const parsedObj: Record<string, unknown> = {};
  for (const key in obj as Record<string, unknown>) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      parsedObj[key] = parseApiDates((obj as Record<string, unknown>)[key]);
    }
  }

  return parsedObj as unknown as T;
}
