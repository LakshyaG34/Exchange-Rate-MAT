export function formatRate(value, maximumFractionDigits = 4) {
  const number = Number(value);
  if (!Number.isFinite(number)) return value ?? "—";

  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(number);
}
export function formatApiDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return value;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
