export function formatBirthday(value) {
  const digits = value.replace(/\D/g, "").slice(0, 8);

  const d = digits.slice(0, 2);
  const m = digits.slice(2, 4);
  const y = digits.slice(4, 8);

  if (digits.length <= 2) return d;
  if (digits.length <= 4) return `${d}.${m}`;
  return `${d}.${m}.${y}`;
}