import { geolocation, ipAddress, next } from "@vercel/edge";

// ---------------------------------------------------------------------------
// 可调：优先用环境变量（Vercel Dashboard），未设置则用下方默认值
// ---------------------------------------------------------------------------
const BACKDOOR_PARAM = "access";
const BACKDOOR_VALUE = (process.env.EDGE_ACCESS_SECRET ?? "hxj2026").trim();
const ADMIN_PATH = "/admin";
const COOKIE_NAME = "internal_auth";
const BLOCK_REDIRECT = (process.env.EDGE_BLOCK_REDIRECT ?? "https://www.google.com").trim();

const BOT_KEYWORDS = [
  "bot",
  "spider",
  "crawl",
  "python",
  "headless",
  "go-http",
  "curl/",
  "wget",
];

function getCookie(request: Request, name: string): string | null {
  const jar = request.headers.get("cookie");
  if (!jar) return null;
  for (const part of jar.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const k = part.slice(0, idx).trim();
    if (k !== name) continue;
    return decodeURIComponent(part.slice(idx + 1).trim());
  }
  return null;
}

function setAuthCookie(): string {
  const maxAge = 60 * 60 * 24 * 30;
  return `${COOKIE_NAME}=true; Path=/; Max-Age=${maxAge}; SameSite=Lax; Secure; HttpOnly`;
}

export default function middleware(request: Request): Response {
  const url = new URL(request.url);
  const { pathname, searchParams } = url;
  const ip = ipAddress(request) ?? "unknown";

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/assets/") ||
    pathname.includes(".")
  ) {
    return next();
  }

  // 秘密后门：访问一次 ?access=<暗号>，写入 Cookie，之后同浏览器跳过地理锁
  if (searchParams.get(BACKDOOR_PARAM) === BACKDOOR_VALUE) {
    return next({
      headers: {
        "Set-Cookie": setAuthCookie(),
      },
    });
  }

  // 后台路径或已带内部授权 Cookie：全球放行（便于境外管理 / 同事看站）
  if (pathname.startsWith(ADMIN_PATH) || getCookie(request, COOKIE_NAME) === "true") {
    return next();
  }

  const ua = (request.headers.get("user-agent") || "").toLowerCase();
  if (BOT_KEYWORDS.some((k) => ua.includes(k))) {
    console.log(`[middleware][bot] ${ip} ${request.headers.get("user-agent")}`);
    return Response.redirect(BLOCK_REDIRECT, 302);
  }

  const geo = geolocation(request);
  const country = geo.country ?? "";
  const vercelEnv = process.env.VERCEL_ENV ?? "";

  // vercel dev 常无 Geo，避免本地开发全被挡
  if (!country && vercelEnv === "development") {
    return next();
  }

  if (country !== "TW") {
    console.log(`[middleware][geo] country=${country || "unknown"} ip=${ip}`);
    return Response.redirect(BLOCK_REDIRECT, 302);
  }

  return next();
}

export const config = {
  matcher: ["/((?!api/|_next/|assets/|.*\\..*).*)"],
};
