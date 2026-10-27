import {
  Camera,
  Color,
  Layer,
  LayerType,
  PathLayer,
  Point,
  Side,
  XYWH,
} from "@/types/canvas";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
const COLORS = [
  "#FF5733", // Red Orange
  "#5733FF", // Electric Violet
  "#FF8C00", // Dark Orange
  "#FFD700", // Gold
  "#228B22", // Forest Green
  "#8B008B", // Dark Magenta
  "#FF3366", // Strawberry Red
  "#FF00FF", // Magenta
  "#FF9F00", // Amber
  "#DA70D6", // Orchid
  "#48C9B0", // Turquoise
  "#1F618D", // Deep Blue
  "#2E8B57", // Sea Green
  "#7D3C98", // Purple
  "#F4A300", // Vivid Amber
  "#D9534F", // Scarlet Red
];

export function connectionIdToColor(connectionId: number): string {
  return COLORS[connectionId % COLORS.length];
}

export function pointerEventToCanvasPoint(
  e: React.PointerEvent,
  camera: Camera
) {
  return {
    x: (Math.round(e.clientX) - camera.x) / camera.zoom,
    y: (Math.round(e.clientY) - camera.y) / camera.zoom,
  };
}

export function colorToCss(color: Color) {
  return `#${color.r.toString(16).padStart(2, "0")}${color.g.toString(16).padStart(2, "0")}${color.b.toString(16).padStart(2, "0")}`;
}
export function resizeBounds(bounds: XYWH, corner: Side, point: Point): XYWH {
  const result = {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
  };

  if ((corner & Side.Left) === Side.Left) {
    result.x = Math.min(point.x, bounds.x + bounds.width);
    result.width = Math.abs(bounds.x + bounds.width - point.x);
  }
  if ((corner & Side.Right) === Side.Right) {
    result.x = Math.min(point.x, bounds.x);
    result.width = Math.abs(point.x - bounds.x);
  }
  if ((corner & Side.Top) === Side.Top) {
    result.y = Math.min(point.y, bounds.y + bounds.height);
    result.height = Math.abs(bounds.y + bounds.height - point.y);
  }
  if ((corner & Side.Bottom) === Side.Bottom) {
    result.y = Math.min(point.y, bounds.y);
    result.height = Math.abs(point.y - bounds.y);
  }

  return result;
}

export function findIntersectingLayersWithRectangle(
  layerIds: readonly string[],
  layers: ReadonlyMap<string, Layer>,
  a: Point,
  b: Point
) {
  const rect = {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    width: Math.abs(a.x - b.x),
    height: Math.abs(a.y - b.y),
  };
  const ids = [];
  for (const layerId of layerIds) {
    const layer = layers.get(layerId);
    if (layer == null) continue;
    const { x, y, width, height } = layer;
    // Frames are only picked up when fully enclosed, so box-selecting
    // inside a frame doesn't grab the frame itself.
    if (layer.type === LayerType.Frame) {
      if (
        rect.x <= x &&
        rect.y <= y &&
        rect.x + rect.width >= x + width &&
        rect.y + rect.height >= y + height
      ) {
        ids.push(layerId);
      }
      continue;
    }
    if (
      rect.x + rect.width > x &&
      rect.x < x + width &&
      rect.y + rect.height > y &&
      rect.y < y + height
    ) {
      ids.push(layerId);
    }
  }

  return ids;
}

// Merges boxes that touch or sit within `gap` of each other into their
// combined bounding boxes, repeating until no clusters are that close.
export function mergeIntoClusters(rects: XYWH[], gap: number): XYWH[] {
  const near = (a: XYWH, b: XYWH) =>
    a.x <= b.x + b.width + gap &&
    b.x <= a.x + a.width + gap &&
    a.y <= b.y + b.height + gap &&
    b.y <= a.y + a.height + gap;

  let clusters = rects.map((r) => ({ ...r }));
  let merged = true;
  while (merged) {
    merged = false;
    const next: XYWH[] = [];
    for (const rect of clusters) {
      const hit = next.find((c) => near(c, rect));
      if (hit) {
        const right = Math.max(hit.x + hit.width, rect.x + rect.width);
        const bottom = Math.max(hit.y + hit.height, rect.y + rect.height);
        hit.x = Math.min(hit.x, rect.x);
        hit.y = Math.min(hit.y, rect.y);
        hit.width = right - hit.x;
        hit.height = bottom - hit.y;
        merged = true;
      } else {
        next.push(rect);
      }
    }
    clusters = next;
  }
  return clusters;
}

// Top-left position for a box of `size` as close as possible to
// `preferredCenter` without overlapping any `occupied` box (keeping `gap`
// between them). Searches outward in square rings on a grid; if nothing
// nearby is free, places the box to the right of everything.
export function findFreeSpot(
  occupied: XYWH[],
  size: { width: number; height: number },
  preferredCenter: Point,
  gap = 40
): Point {
  // Avoid whole groups, not just individual items, so new content never
  // lands in the gaps inside an existing diagram or template.
  occupied = mergeIntoClusters(occupied, gap);
  const origin = {
    x: preferredCenter.x - size.width / 2,
    y: preferredCenter.y - size.height / 2,
  };
  const fits = (x: number, y: number) =>
    occupied.every(
      (r) =>
        x + size.width + gap <= r.x ||
        x >= r.x + r.width + gap ||
        y + size.height + gap <= r.y ||
        y >= r.y + r.height + gap
    );

  if (fits(origin.x, origin.y)) return origin;

  const step = 40;
  const maxRings = 80;
  for (let ring = 1; ring <= maxRings; ring++) {
    let best: Point | null = null;
    let bestDistance = Infinity;
    const consider = (i: number, j: number) => {
      const x = origin.x + i * step;
      const y = origin.y + j * step;
      const distance = Math.hypot(i, j);
      if (distance < bestDistance && fits(x, y)) {
        best = { x, y };
        bestDistance = distance;
      }
    };
    for (let i = -ring; i <= ring; i++) {
      consider(i, -ring);
      consider(i, ring);
    }
    for (let j = -ring + 1; j <= ring - 1; j++) {
      consider(-ring, j);
      consider(ring, j);
    }
    if (best) return best;
  }

  const right = Math.max(...occupied.map((r) => r.x + r.width));
  return { x: right + gap, y: origin.y };
}

// Mixes a color toward white; amount 0 keeps it, 1 gives white.
export function tintColor(color: Color, amount: number): Color {
  const mix = (c: number) => Math.round(c + (255 - c) * amount);
  return { r: mix(color.r), g: mix(color.g), b: mix(color.b) };
}

// Mixes a color toward black; amount 0 keeps it, 1 gives black.
export function shadeColor(color: Color, amount: number): Color {
  const mix = (c: number) => Math.round(c * (1 - amount));
  return { r: mix(color.r), g: mix(color.g), b: mix(color.b) };
}

const luminance = (c: Color) => 0.299 * c.r + 0.587 * c.g + 0.114 * c.b;

// Shared look for filled shapes: the fill, a thin border in a darker shade
// of the same hue, and readable label text.
export function shapePalette(fill: Color) {
  const light = luminance(fill) > 170;
  return {
    fill: colorToCss(fill),
    stroke: colorToCss(shadeColor(fill, light ? 0.32 : 0.2)),
    text: light ? colorToCss(shadeColor(fill, 0.78)) : "#ffffff",
  };
}

// Soft two-layer shadow used by shapes, tables and images.
export const SOFT_SHADOW =
  "drop-shadow(0 1px 1px rgba(15,23,42,0.06)) drop-shadow(0 4px 10px rgba(15,23,42,0.07))";

// Puts the caret in a layer's editable label (shapes, frames).
export function focusLayerLabel(layerId: string) {
  const el = document.querySelector<HTMLElement>(
    `[data-label-for="${layerId}"]`
  );
  if (!el) return;
  el.focus();
  // Select after the focus re-render: react-contenteditable moves the caret
  // to the end whenever it updates while focused.
  setTimeout(() => {
    const range = document.createRange();
    range.selectNodeContents(el);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }, 0);
}

export function getContrastingTextColor(color: Color) {
  const luminance = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
  return luminance > 182 ? "#000000" : "#ffffff";
}

export function penPointToPathLayer(
  points: number[][],
  color: Color
): PathLayer {
  if (points.length < 2) {
    throw new Error("Cannot transform points with less than 2 points");
  }
  let left = Number.POSITIVE_INFINITY;
  let top = Number.POSITIVE_INFINITY;
  let right = Number.NEGATIVE_INFINITY;
  let bottom = Number.NEGATIVE_INFINITY;

  for (const point of points) {
    const [x, y] = point;
    if (left > x) {
      left = x;
    }
    if (top > y) {
      top = y;
    }
    if (right < x) {
      right = x;
    }
    if (bottom < y) {
      bottom = y;
    }
  }
  return {
    type: LayerType.Path,
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
    fill: color,
    points: points.map(([x, y, pressure]) => [x - left, y - top, pressure]),
  };
}

export function getSvgPathFromStroke(stroke: number[][]) {
  if (!stroke.length) return "";

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"]
  );

  d.push("Z");
  return d.join(" ");
}
