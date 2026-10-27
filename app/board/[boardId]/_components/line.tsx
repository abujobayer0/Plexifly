import React from "react";
import { colorToCss, focusLayerLabel, tintColor } from "@/lib/utils";
import { labelChipSize } from "@/lib/connectors";
import { ShapeLabel } from "./shape-label";
import { LayerType, LineLayer } from "@/types/canvas";

interface LineProps {
  id: string;
  layer: LineLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

const STROKE_WIDTH = 1.75;
const HEAD_LENGTH = 11;
const HEAD_WIDTH = 8;
const CORNER_RADIUS = 10;

type Pt = [number, number];

const STUB = 16;

const sideVector = (side?: LineLayer["startSide"]): Pt => {
  switch (side) {
    case "left":
      return [-1, 0];
    case "right":
      return [1, 0];
    case "top":
      return [0, -1];
    case "bottom":
      return [0, 1];
    default:
      return [0, 0];
  }
};

// Drops repeated and collinear middle points so corners round cleanly.
function dedupe(points: Pt[]): Pt[] {
  const out: Pt[] = [];
  for (const p of points) {
    const last = out[out.length - 1];
    if (last && Math.abs(last[0] - p[0]) < 0.5 && Math.abs(last[1] - p[1]) < 0.5) {
      continue;
    }
    out.push(p);
  }
  return out.filter((p, i) => {
    if (i === 0 || i === out.length - 1) return true;
    const [ax, ay] = out[i - 1];
    const [bx, by] = out[i + 1];
    const collinear =
      (Math.abs(ax - p[0]) < 0.5 && Math.abs(bx - p[0]) < 0.5) ||
      (Math.abs(ay - p[1]) < 0.5 && Math.abs(by - p[1]) < 0.5);
    return !collinear;
  });
}

// Right-angle path through the given points with rounded corners.
function roundedPath(points: Pt[]) {
  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i - 1];
    const [x, y] = points[i];
    const [nx, ny] = points[i + 1];
    const inLen = Math.hypot(x - px, y - py);
    const outLen = Math.hypot(nx - x, ny - y);
    const r = Math.min(CORNER_RADIUS, inLen / 2, outLen / 2);
    if (r < 0.5) {
      d += ` L${x},${y}`;
      continue;
    }
    const ax = x - ((x - px) / inLen) * r;
    const ay = y - ((y - py) / inLen) * r;
    const bx = x + ((nx - x) / outLen) * r;
    const by = y + ((ny - y) / outLen) * r;
    d += ` L${ax},${ay} Q${x},${y} ${bx},${by}`;
  }
  const [lx, ly] = points[points.length - 1];
  return `${d} L${lx},${ly}`;
}

export const Line = ({ id, layer, onPointerDown, selectionColor }: LineProps) => {
  const {
    x,
    y,
    width,
    height,
    fill,
    flipX,
    flipY,
    type,
    elbow,
    startId,
    endId,
    startSide,
    endSide,
    waypoints,
    value,
    labelAt,
  } = layer;

  const x1 = flipX ? width : 0;
  const y1 = flipY ? height : 0;
  const x2 = flipX ? 0 : width;
  const y2 = flipY ? 0 : height;

  // Attached connectors run at right angles between box sides; free lines
  // stay straight.
  const isElbow = Boolean(elbow && (startId || endId));
  let points: Pt[] = [
    [x1, y1],
    [x2, y2],
  ];
  if (waypoints && waypoints.length >= 2) {
    // A full route around obstacles, computed by the connector router.
    points = waypoints.map(([px, py]) => [px, py] as Pt);
  } else if (isElbow) {
    // Leave and enter perpendicular to the item's side: a short stub out
    // of each side, then bends between the stubs. When the stubs point away
    // from each other (items overlap on that axis) the middle run switches
    // axis, giving a clean S/U route instead of a line hugging an edge.
    const startDir = sideVector(startSide);
    const endDir = sideVector(endSide);
    const sx = x1 + startDir[0] * STUB;
    const sy = y1 + startDir[1] * STUB;
    const ex = x2 + endDir[0] * STUB;
    const ey = y2 + endDir[1] * STUB;
    const horizontal = elbow === "h";
    const forward = horizontal
      ? (ex - sx) * (startDir[0] || Math.sign(ex - sx) || 1) >= 0
      : (ey - sy) * (startDir[1] || Math.sign(ey - sy) || 1) >= 0;
    const mx = (sx + ex) / 2;
    const my = (sy + ey) / 2;
    const middle: Pt[] =
      horizontal === forward
        ? [[mx, sy], [mx, ey]]
        : [[sx, my], [ex, my]];
    points = dedupe([[x1, y1], [sx, sy], ...middle, [ex, ey], [x2, y2]]);
  }
  const d = roundedPath(points);

  const color = fill ? colorToCss(fill) : "#64748b";
  const hasHead = type === LayerType.Arrow;
  const [tx, ty] = points[points.length - 1];
  const [fx, fy] = points[points.length - 2];
  const angle = Math.atan2(ty - fy, tx - fx);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const baseX = tx - HEAD_LENGTH * cos;
  const baseY = ty - HEAD_LENGTH * sin;
  const head = `${tx},${ty} ${baseX - (HEAD_WIDTH / 2) * sin},${baseY + (HEAD_WIDTH / 2) * cos} ${baseX + (HEAD_WIDTH / 2) * sin},${baseY - (HEAD_WIDTH / 2) * cos}`;
  // Stop the stroke at the arrowhead's base so the tip stays crisp.
  const strokePath = hasHead
    ? roundedPath([...points.slice(0, -1), [baseX + cos, baseY + sin]])
    : d;

  // The label sits on the middle of the longest straight run, on a pill
  // that masks the line behind it so text and line never collide.
  let longest = { ax: points[0][0], ay: points[0][1], bx: points[1][0], by: points[1][1] };
  for (let i = 1; i < points.length; i++) {
    const [ax, ay] = points[i - 1];
    const [bx, by] = points[i];
    if (
      Math.hypot(bx - ax, by - ay) >
      Math.hypot(longest.bx - longest.ax, longest.by - longest.ay)
    ) {
      longest = { ax, ay, bx, by };
    }
  }
  const chip = labelChipSize(value) ?? { width: 56, height: 22 };
  const hasLabel = Boolean(labelChipSize(value));
  // The router stores the best chip spot; otherwise use the longest run.
  const [labelCx, labelCy] = labelAt ?? [
    (longest.ax + longest.bx) / 2,
    (longest.ay + longest.by) / 2,
  ];
  const labelWidth = chip.width;
  const labelHeight = chip.height;
  const labelX = labelCx - labelWidth / 2;
  const labelY = labelCy - labelHeight / 2;

  return (
    <g
      onPointerDown={(e) => onPointerDown(e, id)}
      onDoubleClick={() => focusLayerLabel(id)}
      style={{ transform: `translate(${x}px, ${y}px)` }}
    >
      {/* Wide invisible stroke so thin lines are easy to grab. */}
      <path
        d={d}
        fill="none"
        stroke="transparent"
        strokeWidth={16}
        strokeLinecap="round"
      />
      {selectionColor && (
        <path
          d={d}
          fill="none"
          stroke={selectionColor}
          strokeWidth={STROKE_WIDTH + 5}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.35}
        />
      )}
      <path
        d={strokePath}
        fill="none"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {hasHead && <polygon points={head} fill={color} strokeLinejoin="round" />}
      {hasLabel && (
        <rect
          x={labelX}
          y={labelY}
          width={labelWidth}
          height={labelHeight}
          rx={labelHeight / 2}
          fill="#ffffff"
          // Border tinted in the arrow's color ties the chip to its line.
          stroke={colorToCss(tintColor(fill ?? { r: 100, g: 116, b: 139 }, 0.45))}
          strokeWidth={1}
          pointerEvents="none"
        />
      )}
      <ShapeLabel
        id={id}
        x={labelX}
        y={labelY}
        width={labelWidth}
        height={labelHeight}
        value={value}
        color="#475569"
        placeholder="Label"
      />
    </g>
  );
};
