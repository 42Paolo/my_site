"use client";

import { useRef, useEffect } from "react";

/* ── grid config ── */
const TILE   = 112;   // tile size px
const GAP    = 14;    // gap between tiles
const STEP   = TILE + GAP;
const CORNER = 20;    // top-face border-radius
const DEPTH  = 10;    // 3-D depth — how much the coloured base peeks below the white top
const RADIUS = 4.5;   // hover influence in tile units

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

/* rounded-rect path helper */
function rr(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y,     x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x,     y + h, r);
  ctx.arcTo(x,     y + h, x,     y,     r);
  ctx.arcTo(x,     y,     x + w, y,     r);
  ctx.closePath();
}

/**
 * Draw one backlit tile.
 *  x / y       — top-left of tile
 *  hue         — 0-360, per-tile random colour
 *  press       — 0-1 hover strength
 *  baseGlow    — 0-1 steady ambient backlight
 */
function drawTile(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  hue: number,
  press: number,
  baseGlow: number,
) {
  const intensity = Math.min(1, baseGlow + press * 0.82);
  const cx = x + TILE / 2;
  const cy = y + TILE + DEPTH * 0.4;

  /* ── 1. Soft glow halo behind the whole tile (very diffuse) ── */
  const hr = TILE * 0.95;
  const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, hr);
  halo.addColorStop(0,   `hsla(${hue},100%,62%,${intensity * 0.55})`);
  halo.addColorStop(0.5, `hsla(${hue},100%,58%,${intensity * 0.22})`);
  halo.addColorStop(1,   `hsla(${hue},100%,55%,0)`);
  ctx.fillStyle = halo;
  /* paint the halo only in the tile + gutter region */
  ctx.fillRect(x - GAP * 0.5, y - GAP * 0.5, TILE + GAP, TILE + GAP + DEPTH);

  /* ── 2. Coloured base face — the "backlight" visible under the white top ── */
  const baseAlpha = 0.55 + intensity * 0.38;
  ctx.fillStyle = `hsla(${hue},100%,60%,${baseAlpha})`;
  rr(ctx, x, y + DEPTH, TILE, TILE, CORNER - 2);
  ctx.fill();

  /* thin visible side strip at the bottom edge (connects top & base) */
  ctx.fillStyle = `hsla(${hue},100%,50%,${0.35 + intensity * 0.3})`;
  ctx.fillRect(x + CORNER * 0.6, y + TILE, TILE - CORNER * 1.2, DEPTH);

  /* ── 3. White top face — the "keycap" ── */
  /* Very subtle inner shadow so the tile feels slightly recessed vs its glow */
  ctx.shadowColor    = `hsla(${hue},100%,55%,${intensity * 0.25})`;
  ctx.shadowBlur     = 8 + press * 14;
  ctx.shadowOffsetY  = -2;
  rr(ctx, x, y, TILE, TILE, CORNER);
  ctx.fillStyle = "rgb(254,252,251)";
  ctx.fill();
  ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
}

/* ─────────────────────────────────────────────────────────────────────────── */

export default function HoverGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cols = 0, rows = 0;
    let hues:     number[] = [];
    let baseGlow: number[] = [];
    let press:    number[] = [];
    let target:   number[] = [];
    let raf = 0, W = 0, H = 0, dpr = 1;

    /* ── resize ── */
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      W = rect.width;  H = rect.height;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(W / STEP) + 1;
      rows = Math.ceil(H / STEP) + 1;
      const n = cols * rows;

      /* preserve hues across resizes so colours don't jump */
      const prev = hues;
      hues     = Array.from({ length: n }, (_, i) => prev[i] ?? Math.random() * 360);
      baseGlow = Array.from({ length: n }, () => 0.22 + Math.random() * 0.14);
      press    = Array(n).fill(0);
      target   = Array(n).fill(0);
    };

    /* ── render ── */
    const render = () => {
      ctx.clearRect(0, 0, W, H);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          press[idx] = lerp(press[idx] ?? 0, target[idx] ?? 0, 0.1);

          const x = c * STEP;
          const y = r * STEP;

          /* cull tiles completely outside canvas */
          if (x > W + TILE || y > H + TILE + DEPTH) continue;

          drawTile(ctx, x, y, hues[idx], press[idx], baseGlow[idx]);
        }
      }

      raf = requestAnimationFrame(render);
    };

    /* ── mouse — document-level so it fires even over text ── */
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      if (mx < 0 || mx > W || my < 0 || my > H) {
        target.fill(0);
        return;
      }

      /* tile grid coords of cursor */
      const mc = mx / STEP - 0.5;
      const mr = my / STEP - 0.5;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const d = Math.sqrt((c - mc) ** 2 + (r - mr) ** 2);
          target[r * cols + c] = Math.max(0, 1 - d / RADIUS) ** 2;
        }
      }
    };

    resize();
    render();
    document.addEventListener("mousemove", onMove);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "none", zIndex: 0 }}
    />
  );
}
