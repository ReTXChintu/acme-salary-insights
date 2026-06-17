# ACME Salary Insights Requirements

## Product Vision

ACME Salary Insights is a web-based salary management and analytics platform for an organization with approximately 10,000 employees. It replaces spreadsheet-based HR workflows with a maintainable application for managing employee records, tracking immutable salary history, and understanding payroll distribution across the organization.

The product should help HR managers make informed compensation decisions by providing reliable employee data, salary records, and payroll analytics in one place.

## User Persona

### HR Manager

The primary user is an HR Manager responsible for maintaining employee and salary information across departments and countries.

The HR Manager needs to:

- Create and maintain employee records.
- Track salary changes over time.
- Search, filter, and review employee information quickly.
- Understand current payroll totals and salary distribution.
- Analyze pay across departments and countries.

No authentication or user management is required for this assessment.

## Goals

- Provide a web application for managing employee records.
- Provide salary history tracking where salary records are immutable.
- Support approximately 10,000 employees with usable search, filtering, and pagination.
- Provide analytics for payroll totals, averages, country breakdowns, department breakdowns, top paid employees, and salary distribution.
- Use a clean, testable architecture with clear frontend, backend, service, repository, and database boundaries.
- Follow strict backend TDD using RED -> GREEN -> REFACTOR.

## Core Features

### Employee Management

- Create employee records.
- View employee details.
- Search employees.
- Filter employees by department and country.
- Update employee records.
- Soft delete employees.
- List employees with pagination.

Default employee list page size is 10.

### Salary Management

- Create salary records for employees.
- View salary history for an employee.
- Determine the current salary from the latest effective date.
- Treat salary history as immutable: updating salary creates a new salary record instead of modifying prior records.

### Analytics

- View total payroll.
- View average salary.
- View payroll by country.
- View payroll by department.
- View top paid employees.
- View salary distribution using these bands:
  - 0-50k
  - 50k-100k
  - 100k-150k
  - 150k-200k
  - 200k+

### Application Layout

- Sidebar with ACME Salary Insights branding.
- Navigation links for Dashboard, Employees, and Analytics.
- Navbar greeting: Hello HR Manager.

## Domain Requirements

### Country

- id
- name
- currency

### Department

- id
- name

### Employee

- id
- employeeCode
- firstName
- lastName
- email
- departmentId
- countryId
- isActive
- deletedAt
- createdAt
- updatedAt

### Salary

- id
- employeeId
- amount
- currency
- effectiveDate
- createdAt

### Relationships

- Employee belongs to Department.
- Employee belongs to Country.
- Employee has many Salary records.
- Department has many Employees.
- Country has many Employees.

## Seed Data Requirements

The application should support seeded development data containing:

- 10,000 employees.
- 5 departments.
- 5 countries.
- At least one salary record for every employee.
- Unique employee emails.
- Unique employee codes.

Departments:

- Engineering
- Product
- HR
- Finance
- Sales

Countries:

- India
- United States
- United Kingdom
- Germany
- Singapore

## Non-Functional Requirements

- The application should remain usable with approximately 10,000 employees.
- Backend code should prioritize correctness, testability, maintainability, and readability.
- Backend features should be developed with strict TDD.
- Frontend development should use lightweight TDD for meaningful UI behavior.
- APIs should use validation for request inputs.
- The codebase should use TypeScript for type safety.
- The architecture should separate route handling, business logic, data access, validation, and presentation concerns.
- Salary history must preserve historical records and avoid destructive updates.

## Explicitly Out Of Scope

- Authentication
- Authorization
- RBAC
- Payroll processing
- Currency conversion
- Multi-tenancy
- Email notifications
- User management
- Logout workflows
