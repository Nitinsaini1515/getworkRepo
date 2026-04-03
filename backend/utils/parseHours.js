/**
 * Parse numeric hours from UI strings like "4", "4 hrs", "4 hours today".
 */
export function parseHoursValue(hours) {
  if (hours == null || hours === "") return 0;
  if (typeof hours === "number" && !Number.isNaN(hours)) return Math.max(0, hours);
  const s = String(hours);
  const m = s.match(/(\d+(?:\.\d+)?)/);
  return m ? Math.max(0, parseFloat(m[1], 10)) : 0;
}
