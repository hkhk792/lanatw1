/**
 * 将 obsidian-vapor-zen main 同步到各 sp2s 子域独立仓库（触发各自 Vercel 部署）。
 *
 *   node scripts/sync-sp2s-repos.mjs
 *   node scripts/sync-sp2s-repos.mjs --repos=sp2s-1,sp2s-2,sp2s-4,sp2s-5,lanatw1
 */
import { spawnSync } from "child_process";

const ghOwner = "hkhk792";
const args = process.argv.slice(2);
const reposArg = args.find((a) => a.startsWith("--repos="))?.split("=")[1];
const defaultRepos = ["sp2s-1", "sp2s-2", "sp2s-4", "sp2s-5", "lanatw1"];
const repos = (reposArg || defaultRepos.join(","))
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const branch = spawnSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
  encoding: "utf8",
}).stdout.trim();
if (branch !== "main") {
  console.error("Run from main branch (current:", branch, ")");
  process.exit(1);
}

const sha = spawnSync("git", ["rev-parse", "--short", "HEAD"], {
  encoding: "utf8",
}).stdout.trim();
console.log("Pushing", sha, "to", repos.join(", "));

for (const name of repos) {
  const url = `https://github.com/${ghOwner}/${name}.git`;
  const push = spawnSync("git", ["push", url, "main:main"], {
    encoding: "utf8",
    stdio: "pipe",
  });
  if (push.status !== 0) {
    console.error("FAIL", name, push.stderr || push.stdout);
    process.exitCode = 1;
  } else {
    console.log("OK", name);
  }
}
