import { readFileSync, writeFileSync } from "fs";
import { spawnSync } from "child_process";

const scope = "mpm4hndtbr-4652s-projects";
const project = "sp2s-3";
const src = ".env.sp2s3.bootstrap";
const out = ".env.sp2s3.production";

const overrides = {
  SITE_CODE: "lanatw1",
  VITE_SHOP_SITE_URL: "https://lanatw1.com",
  VITE_SHOP_HOME_TITLE: "LANA \u7159\u5f48\u4e3b\u6a5f\u5b98\u65b9\u5546\u57ce\uff5c\u73fe\u8ca8\u914d\u9001",
  VITE_SHOP_HOME_DESCRIPTION:
    "LANA \u5c0f\u87ba\u8170\u7159\u5f48\u3001\u4e3b\u6a5f\u8207\u901a\u914d\u7cfb\u5217\u73fe\u8ca8\u3002\u53f0\u7063\u914d\u9001\uff0c\u50c5\u9650 18 \u6b72\u4ee5\u4e0a\u3002",
  VITE_SHOP_ORG_NAME: "LANA \u5b98\u65b9",
  VITE_SHOP_WEBSITE_NAME: "LANA \u96fb\u5b50\u7159\u5b98\u65b9\u5546\u57ce",
  VITE_SHOP_JSON_LD_BRAND: "LANA",
};

const lines = readFileSync(src, "utf8").split(/\r?\n/);
const map = new Map();
for (const line of lines) {
  const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
  if (!m) continue;
  map.set(m[1], m[2].replace(/^"|"$/g, ""));
}
for (const [k, v] of Object.entries(overrides)) map.set(k, v);

const body = [...map.entries()].map(([k, v]) => `${k}=${v}`).join("\n") + "\n";
writeFileSync(out, body, "utf8");

const vercel = (args) =>
  spawnSync("npx", ["--yes", "vercel@latest", ...args], {
    stdio: "inherit",
    shell: true,
    cwd: process.cwd(),
  });

console.log("==> link", project);
vercel(["link", "--yes", "--project", project, "--scope", scope]);

for (const [key, value] of map.entries()) {
  if (key.startsWith("VERCEL_") || !value) continue;
  console.log("==> env add", key);
  spawnSync(
    "npx",
    ["--yes", "vercel@latest", "env", "add", key, "production", "--scope", scope, "--force"],
    { input: value + "\n", shell: true, stdio: ["pipe", "inherit", "inherit"], cwd: process.cwd() }
  );
}

console.log("==> deploy production");
vercel(["deploy", "--prod", "--yes", "--scope", scope]);
