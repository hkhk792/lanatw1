const SCROLL_Y_KEY = "obsidian-vapor-zen-home-scroll-y";
const RESTORE_FLAG_KEY = "obsidian-vapor-zen-restore-home-scroll";

function isHomePath(): boolean {
  const p = window.location.pathname;
  return p === "/" || p === "";
}

/** Save current window scroll Y only while the user is on the homepage (`/`). */
export function flushHomeScrollPosition(): void {
  try {
    if (!isHomePath()) return;
    sessionStorage.setItem(SCROLL_Y_KEY, String(window.scrollY));
  } catch {
    // ignore
  }
}

/** Throttled-friendly: persist scroll while user is browsing the homepage. */
export function persistCurrentHomeScroll(): void {
  flushHomeScrollPosition();
}

/** Next navigation to `/` should restore the last saved homepage scroll position. */
export function requestHomeScrollRestore(): void {
  try {
    sessionStorage.setItem(RESTORE_FLAG_KEY, "1");
  } catch {
    // ignore
  }
}

export function consumeHomeScrollRestore(): boolean {
  try {
    if (sessionStorage.getItem(RESTORE_FLAG_KEY) !== "1") return false;
    sessionStorage.removeItem(RESTORE_FLAG_KEY);
    return true;
  } catch {
    return false;
  }
}

export function getPersistedHomeScrollY(): number {
  try {
    const raw = sessionStorage.getItem(SCROLL_Y_KEY);
    const y = raw ? parseInt(raw, 10) : 0;
    return Number.isFinite(y) && y >= 0 ? y : 0;
  } catch {
    return 0;
  }
}
