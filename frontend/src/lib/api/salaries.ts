import type { ListSalariesResponse } from "../../features/salaries/types";

export async function listSalaries(
  _employeeId: string,
): Promise<ListSalariesResponse> {
  throw new Error("Not implemented");
}
