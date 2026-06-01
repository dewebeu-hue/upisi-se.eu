export function formatShortDateTime(timestamp: number): string {
  if (!Number.isFinite(timestamp)) {
    return "Nepoznat datum";
  }

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "Nepoznat datum";
  }

  return new Intl.DateTimeFormat("hr-HR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
