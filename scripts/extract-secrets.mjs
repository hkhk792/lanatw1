import { writeFileSync } from "fs";

const keys = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "ADMIN_SECRET",
];

const lines = keys.filter((k) => process.env[k]).map((k) => `${k}=${process.env[k]}`);
writeFileSync(".env.secrets.manual", lines.join("\n") + "\n", "utf8");
console.log("exported", lines.length, "keys");
