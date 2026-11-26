export function toInt(x) {
  if (Number.isInteger(x)) return x;
  if (typeof x === "string" && /^\d+$/.test(x)) return Number(x);
  return NaN;
}

export function errText(e) {
  return [e?.message, e?.cause?.message, e?.meta?.message].filter(Boolean).join(" ");
}

const KNOWN_ERRORS = {
  INSUFFICIENT_FUNDS: 402,
  CART_EMPTY: 400,
  WALLET_NOT_FOUND: 404,
  PROMO_NOT_FOUND: 404,
  PROMO_EXPIRED: 400,
  PROMO_MIN_TOTAL: 400,
  PROMO_EXHAUSTED: 400,
  PROMO_ALREADY_USED: 400,
};

export function mapDbError(e) {
  const t = errText(e);
  for (const [code, status] of Object.entries(KNOWN_ERRORS)) {
    if (t.includes(code)) return { status, error: code };
  }
  return null;
}