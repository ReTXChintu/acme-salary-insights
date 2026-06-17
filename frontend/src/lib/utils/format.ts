export function formatCurrency(amount: number, currency = "INR"): string {
  return `${new Intl.NumberFormat("en-IN").format(amount)} ${currency}`;
}

export function formatCount(value: number): string {
  return new Intl.NumberFormat("en-IN").format(value);
}
