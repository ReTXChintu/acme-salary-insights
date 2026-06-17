import type {
  CreateSalaryInput,
  ListSalariesResponse,
  Salary,
} from "../../features/salaries/types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(errorBody?.error ?? `Request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function listSalaries(
  employeeId: string,
): Promise<ListSalariesResponse> {
  const response = await fetch(`${API_URL}/employees/${employeeId}/salaries`);
  return parseJson<ListSalariesResponse>(response);
}

export async function createSalary(
  employeeId: string,
  input: CreateSalaryInput,
): Promise<Salary> {
  const response = await fetch(`${API_URL}/employees/${employeeId}/salaries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  return parseJson<Salary>(response);
}
