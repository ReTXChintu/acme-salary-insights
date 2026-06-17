export class EmployeeNotFoundError extends Error {
  constructor(id: string) {
    super(`Employee with id "${id}" not found`);
    this.name = "EmployeeNotFoundError";
  }
}

export class DuplicateEmailError extends Error {
  constructor(email: string) {
    super(`Employee with email "${email}" already exists`);
    this.name = "DuplicateEmailError";
  }
}

export class InvalidDepartmentError extends Error {
  constructor(departmentId: string) {
    super(`Department with id "${departmentId}" not found`);
    this.name = "InvalidDepartmentError";
  }
}

export class InvalidCountryError extends Error {
  constructor(countryId: string) {
    super(`Country with id "${countryId}" not found`);
    this.name = "InvalidCountryError";
  }
}
