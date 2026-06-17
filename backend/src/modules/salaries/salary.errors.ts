export class InvalidSalaryAmountError extends Error {
  constructor(amount: number) {
    super(`Salary amount "${amount}" is invalid`);
    this.name = "InvalidSalaryAmountError";
  }
}

export class InvalidCurrencyError extends Error {
  constructor(currency: string) {
    super(`Currency "${currency}" is invalid`);
    this.name = "InvalidCurrencyError";
  }
}
