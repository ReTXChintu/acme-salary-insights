import { prisma } from "../../shared/prisma.js";

export async function getReferenceLabelMaps(): Promise<{
  countries: Map<string, string>;
  departments: Map<string, string>;
}> {
  const [countries, departments] = await Promise.all([
    prisma.country.findMany({ select: { id: true, name: true } }),
    prisma.department.findMany({ select: { id: true, name: true } }),
  ]);

  return {
    countries: new Map(countries.map((country) => [country.id, country.name])),
    departments: new Map(
      departments.map((department) => [department.id, department.name]),
    ),
  };
}
