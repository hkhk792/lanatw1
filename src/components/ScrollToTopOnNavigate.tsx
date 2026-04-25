import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * 全域 `html { scroll-behavior: smooth }` 會讓 `scrollTo` 變成平滑捲動；
 * 路由切換時改為瞬間置頂，避免「先看到中段再滑回頂」的體感。
 */
function scrollWindowToTopInstant() {
  const html = document.documentElement;
  const body = document.body;
  const prevHtml = html.style.scrollBehavior;
  const prevBody = body.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  body.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  html.scrollTop = 0;
  body.scrollTop = 0;
  queueMicrotask(() => {
    html.style.scrollBehavior = prevHtml;
    body.style.scrollBehavior = prevBody;
  });
}

/**
 * 客户端路由切换后，把视窗滚到页面最上方。
 * 路径为 `/` 时不处理，交给首页自行做「返回时还原滚动」。
 */
export function ScrollToTopOnNavigate() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    if (pathname === "/" || pathname === "") return;
    scrollWindowToTopInstant();
  }, [pathname]);
  return null;
}
