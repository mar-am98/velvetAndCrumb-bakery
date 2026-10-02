/** Strip spaces/dashes for validation. */
export function normalizeCardNumber(raw: string): string {
  return raw.replace(/\D/g, "");
}

/** Format as groups of four for display. */
export function formatCardNumber(raw: string): string {
  const digits = normalizeCardNumber(raw).slice(0, 19);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

/** MM/YY with auto-inserted slash. */
export function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function formatCvc(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 4);
}

export function isExpiryValid(expiry: string): boolean {
  const match = /^(\d{2})\/(\d{2})$/.exec(expiry.trim());
  if (!match) return false;
  const month = Number(match[1]);
  const year = Number(match[2]);
  if (month < 1 || month > 12) return false;

  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;
  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  return true;
}

export function isPaymentValid(input: {
  nameOnCard: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}): boolean {
  const name = input.nameOnCard.trim();
  const digits = normalizeCardNumber(input.cardNumber);
  const cvc = input.cvc.trim();

  if (name.length < 2) return false;
  if (digits.length < 15 || digits.length > 19) return false;
  if (!isExpiryValid(input.expiry)) return false;
  if (cvc.length < 3 || cvc.length > 4) return false;
  return true;
}
