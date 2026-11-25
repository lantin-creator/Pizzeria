export function toInt(x) {
  if (Number.isInteger(x)) return x;
  if (typeof x === "string" && /^\d+$/.test(x)) return Number(x);
  return NaN;
}

export function errText(e) {
  return [e?.message, e?.cause?.message, e?.meta?.message].filter(Boolean).join(" ");
}