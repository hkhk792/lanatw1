import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "obsidian-vapor-zen-line-widget-pos";
const EDGE_GAP = 24;
const DRAG_THRESHOLD = 4;

type Position = { right: number; bottom: number };

const DEFAULT_POS: Position = { right: 32, bottom: 32 };

function clampToViewport(pos: Position, width: number, height: number): Position {
  const maxRight = Math.max(EDGE_GAP, window.innerWidth - width - EDGE_GAP);
  const maxBottom = Math.max(EDGE_GAP, window.innerHeight - height - EDGE_GAP);
  return {
    right: Math.min(Math.max(EDGE_GAP, pos.right), maxRight),
    bottom: Math.min(Math.max(EDGE_GAP, pos.bottom), maxBottom),
  };
}

function loadPosition(): Position {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_POS;
    const parsed = JSON.parse(raw) as Position;
    if (
      parsed &&
      typeof parsed === "object" &&
      typeof parsed.right === "number" &&
      typeof parsed.bottom === "number"
    ) {
      return parsed;
    }
  } catch {
    // ignore
  }
  return DEFAULT_POS;
}

type Props = {
  /** Optional URL or link to open when clicked (no drag). Defaults to a local protocol. */
  lineHref?: string;
  /** Optional notification count. Falsy hides the red dot. */
  notificationCount?: number;
};

const FloatingLineWidget = ({ lineHref = "https://line.me/ti/p/~abs791012", notificationCount = 1 }: Props) => {
  const [pos, setPos] = useState<Position>(DEFAULT_POS);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<{
    startX: number;
    startY: number;
    startRight: number;
    startBottom: number;
    moved: boolean;
    pointerId: number;
  } | null>(null);

  useEffect(() => {
    const saved = loadPosition();
    const el = containerRef.current;
    if (!el) {
      setPos(saved);
      return;
    }
    const { offsetWidth, offsetHeight } = el;
    setPos(clampToViewport(saved, offsetWidth, offsetHeight));
  }, []);

  useEffect(() => {
    const onResize = () => {
      const el = containerRef.current;
      if (!el) return;
      setPos((current) => clampToViewport(current, el.offsetWidth, el.offsetHeight));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const persist = useCallback((next: Position) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    const el = containerRef.current;
    if (!el) return;
    dragStateRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startRight: pos.right,
      startBottom: pos.bottom,
      moved: false,
      pointerId: e.pointerId,
    };
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const state = dragStateRef.current;
    if (!state || state.pointerId !== e.pointerId) return;
    const dx = e.clientX - state.startX;
    const dy = e.clientY - state.startY;
    if (!state.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
    if (!state.moved) {
      state.moved = true;
      setIsDragging(true);
    }
    const el = containerRef.current;
    if (!el) return;
    const next = clampToViewport(
      { right: state.startRight - dx, bottom: state.startBottom - dy },
      el.offsetWidth,
      el.offsetHeight
    );
    setPos(next);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const state = dragStateRef.current;
    if (!state || state.pointerId !== e.pointerId) return;
    const el = containerRef.current;
    if (el && el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    if (state.moved) {
      persist(pos);
    }
    setIsDragging(false);
    dragStateRef.current = null;
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      return;
    }
    if (lineHref) window.open(lineHref, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      ref={containerRef}
      role="group"
      aria-label="聯絡我們 LINE"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClick={handleClick}
      style={{
        right: `${pos.right}px`,
        bottom: `${pos.bottom}px`,
        touchAction: "none",
      }}
      className={`fixed z-50 flex select-none items-center gap-2 ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      <span className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm">
        Line
      </span>

      <button
        type="button"
        aria-label="透過 LINE 聯絡我們"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        className="relative grid h-12 w-12 place-items-center rounded-full bg-[#06C755] text-white shadow-lg transition-transform hover:scale-105"
      >
        <span className="text-[11px] font-extrabold tracking-wider">LINE</span>
        {notificationCount > 0 ? (
          <span className="absolute -top-0.5 -right-0.5 min-w-[1.15rem] h-[1.15rem] rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white flex items-center justify-center">
            {notificationCount > 99 ? "99+" : notificationCount}
          </span>
        ) : null}
      </button>
    </div>
  );
};

export default FloatingLineWidget;
