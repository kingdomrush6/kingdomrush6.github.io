import { mkdirSync, readdirSync, renameSync, rmSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const name = basename(root);
const release = join(root, "release");
const archive = join(release, `${name}.zip`);
const temporary = join(release, `.${name}-${process.pid}.zip`);

const excludedDirectories = new Set([
  ".git", ".next", ".playwright-cli", ".vercel", ".cache",
  ".agents", ".codex", ".aws", ".ssh",
  "node_modules", "out", "output", "release", "coverage",
  "test-results", "playwright-report",
]);

function excludeFile(name) {
  if (name === ".env.example") return false;
  return name.startsWith(".env")
    || name === ".DS_Store"
    || name === ".npmrc"
    || /\.(?:tsbuildinfo|log|zip|tar|tgz|gz|7z|pem|key|p12|pfx)$/i.test(name);
}

function collect(directory) {
  return readdirSync(directory, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap(entry => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        return excludedDirectories.has(entry.name) ? [] : collect(path);
      }
      // Skip symlinks so files outside the project cannot enter the archive.
      if (!entry.isFile() || excludeFile(entry.name)) return [];
      const source = relative(dirname(root), path);
      if (/[\r\n]/.test(source)) throw new Error("Source filenames cannot contain line breaks.");
      return [source];
    });
}

try {
  const zipCheck = spawnSync("zip", ["-v"], { stdio: "ignore" });
  if (zipCheck.error || zipCheck.status !== 0) {
    throw new Error("The system zip command is required to package the source.");
  }
  mkdirSync(release, { recursive: true });
  const files = collect(root);
  if (!files.length) throw new Error("No source files found.");

  // Read the file list from stdin instead of relying on shell expansion.
  const result = spawnSync("zip", ["-q", temporary, "-@"], {
    cwd: dirname(root),
    input: `${files.join("\n")}\n`,
    encoding: "utf8",
  });
  if (result.error || result.status !== 0) {
    throw new Error(result.error?.message || result.stderr || "ZIP creation failed.");
  }
  renameSync(temporary, archive);
  console.log(`Created ${relative(root, archive)} with ${files.length} source files.`);
  console.log("Excluded dependencies, build output, Git history, local tooling, test artifacts and private environment files.");
} catch (error) {
  rmSync(temporary, { force: true });
  console.error(`Packaging failed: ${error.message}`);
  process.exitCode = 1;
}
