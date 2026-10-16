export function toISODate(ddmmyyyy) {
  if (!ddmmyyyy || typeof ddmmyyyy !== "string") return null;
  const parts = ddmmyyyy.split(".");
  if (parts.length !== 3) return null;

  const d = Number(parts[0]);
  const m = Number(parts[1]);
  const y = Number(parts[2]);

  if (Number.isNaN(d) || Number.isNaN(m) || Number.isNaN(y)) return null;
  if (m < 1 || m > 12) return null;
  if (d < 1 || d > 31) return null;
  if (y < 1900 || y > 2100) return null;

  const date = new Date(y, m - 1, d);
  if (
    date.getFullYear() !== y ||
    date.getMonth() !== m - 1 ||
    date.getDate() !== d
  ) {
    return null;
  }

  const pad = (n) => String(n).padStart(2, "0");
  return `${y}-${pad(m)}-${pad(d)}`;
}

export function ensureISODate(value) {
  if (!value || typeof value !== "string") return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  return toISODate(value);
}

export function fromISODate(isoDate) {
  if (!isoDate || typeof isoDate !== "string") return "";
  const [y, m, d] = isoDate.split("-");
  if (!d || !m || !y) return "";
  return `${d}.${m}.${y}`;
}

export function isValidBirthday(value) {
  if (!value || typeof value !== "string") return false;
  if (value.length !== 10) return false;
  const [d, m, y] = value.split(".").map(Number);
  if (Number.isNaN(d) || Number.isNaN(m) || Number.isNaN(y)) return false;
  if (m < 1 || m > 12) return false;
  if (d < 1 || d > 31) return false;
  if (y < 1900 || y > 2100) return false;
  const date = new Date(y, m - 1, d);
  return (
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d
  );
}