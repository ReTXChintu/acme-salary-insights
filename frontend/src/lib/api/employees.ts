import type {
  CreateEmployeeInput,
  Employee,
  ListEmployeesParams,
  ListEmployeesResponse,
  UpdateEmployeeInput,
} from "../../features/employees/types";
import { parseApiError } from "./parseApiError";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

function buildEmployeesUrl(params: ListEmployeesParams = {}): string {
  const url = new URL(`${API_URL}/employees`);

  if (params.page !== undefined) {
    url.searchParams.set("page", String(params.page));
  }

  if (params.pageSize !== undefined) {
    url.searchParams.set("pageSize", String(params.pageSize));
  }

  if (params.search) {
    url.searchParams.set("search", params.search);
  }

  if (params.departmentId) {
    url.searchParams.set("departmentId", params.departmentId);
  }

  if (params.countryId) {
    url.searchParams.set("countryId", params.countryId);
  }

  return url.toString();
}

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(parseApiError(errorBody?.error ?? `Request failed with ${response.status}`));
  }

  return response.json() as Promise<T>;
}

export async function listEmployees(
  params: ListEmployeesParams = {},
): Promise<ListEmployeesResponse> {
  const response = await fetch(buildEmployeesUrl(params));
  return parseJson<ListEmployeesResponse>(response);
}

export async function getEmployee(id: string): Promise<Employee> {
  const response = await fetch(`${API_URL}/employees/${id}`);
  return parseJson<Employee>(response);
}

export async function createEmployee(
  input: CreateEmployeeInput,
): Promise<Employee> {
  const response = await fetch(`${API_URL}/employees`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  return parseJson<Employee>(response);
}

export async function updateEmployee(
  id: string,
  input: UpdateEmployeeInput,
): Promise<Employee> {
  const response = await fetch(`${API_URL}/employees/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  return parseJson<Employee>(response);
}

export async function deleteEmployee(id: string): Promise<Employee> {
  const response = await fetch(`${API_URL}/employees/${id}`, {
    method: "DELETE",
  });

  return parseJson<Employee>(response);
}
