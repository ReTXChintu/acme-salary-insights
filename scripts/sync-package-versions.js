import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const { version } = JSON.parse(
  readFileSync(join(rootDir, "package.json"), "utf8"),
);

for (const relativePath of ["frontend/package.json", "backend/package.json"]) {
  const filePath = join(rootDir, relativePath);
  const pkg = JSON.parse(readFileSync(filePath, "utf8"));
  pkg.version = version;
  writeFileSync(filePath, `${JSON.stringify(pkg, null, 2)}\n`);
}
