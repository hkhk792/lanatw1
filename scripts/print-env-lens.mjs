const keys = [
  "SITE_CODE",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "ORDER_BACKEND",
];
for (const name of keys) {
  const v = process.env[name] ?? "";
  console.log(`${name} len=${v.length}`);
}
