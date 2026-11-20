export const BASE_CURRENCIES = ["USD", "INR", "EUR", "GBP", "JPY", "AUD", "CAD", "AED", "SGD"];

export function currencyName(code) {
  try {
    return new Intl.DisplayNames(["en"], { type: "currency" }).of(code) || code;
  } catch {
    return code;
  }
}
