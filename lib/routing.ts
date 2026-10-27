import { Point, XYWH } from "@/types/canvas";

// Orthogonal (right-angle) connector routing around obstacles.
//
// Builds a sparse grid from the obstacles' padded edges (plus a few extra
// lanes beside each edge), then runs A* over it. Cost is path length plus a
// penalty per bend and per grid segment another connector already uses, so
// routes stay short and simple and parallel arrows take separate lanes
// instead of stacking on the same line.

export type Dir = [number, number];

const STUB = 16; // straight run out of / into a side before any bend
const LANE = 14; // spacing of the extra lanes beside each obstacle edge
// Clearance around obstacles and how far beyond the endpoints the search
// may roam; later attempts trade clearance for reach in tight layouts.
const ATTEMPTS = [
  { margin: 14, pad: 260 },
  { margin: 7, pad: 700 },
];
const BEND_COST = 36;
const SHARED_SEGMENT_COST = 240;

interface Box {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

// Grid segments used by already-routed connectors, shared across one
// routing pass so later connectors avoid earlier ones.
export type Occupancy = Map<string, number>;

const segmentKey = (ax: number, ay: number, bx: number, by: number) =>
  ax < bx || (ax === bx && ay < by)
    ? `${ax},${ay},${bx},${by}`
    : `${bx},${by},${ax},${ay}`;

const DIRS: Dir[] = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];
const dirIndex = (d: Dir) =>
  DIRS.findIndex(([dx, dy]) => dx === d[0] && dy === d[1]);

function uniqueSorted(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const out: number[] = [];
  for (const v of sorted) {
    if (!out.length || v - out[out.length - 1] > 0.5) out.push(v);
  }
  return out;
}

// Binary min-heap of [priority, state].
class Heap {
  private items: [number, number][] = [];
  get size() {
    return this.items.length;
  }
  push(priority: number, state: number) {
    const items = this.items;
    items.push([priority, state]);
    let i = items.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (items[parent][0] <= items[i][0]) break;
      [items[parent], items[i]] = [items[i], items[parent]];
      i = parent;
    }
  }
  pop(): [number, number] {
    const items = this.items;
    const top = items[0];
    const last = items.pop()!;
    if (items.length) {
      items[0] = last;
      let i = 0;
      for (;;) {
        const l = i * 2 + 1;
        const r = l + 1;
        let m = i;
        if (l < items.length && items[l][0] < items[m][0]) m = l;
        if (r < items.length && items[r][0] < items[m][0]) m = r;
        if (m === i) break;
        [items[m], items[i]] = [items[i], items[m]];
        i = m;
      }
    }
    return top;
  }
}

// Removes repeated points and collinear middle points.
export function simplifyPath(points: Point[]): Point[] {
  const out: Point[] = [];
  for (const p of points) {
    const last = out[out.length - 1];
    if (last && Math.abs(last.x - p.x) < 0.5 && Math.abs(last.y - p.y) < 0.5) {
      continue;
    }
    out.push(p);
  }
  return out.filter((p, i) => {
    if (i === 0 || i === out.length - 1) return true;
    const a = out[i - 1];
    const b = out[i + 1];
    return !(
      (Math.abs(a.x - p.x) < 0.5 && Math.abs(b.x - p.x) < 0.5) ||
      (Math.abs(a.y - p.y) < 0.5 && Math.abs(b.y - p.y) < 0.5)
    );
  });
}

// Right-angle route from `start` (leaving along `startDir`) to `end`
// (entering against `endDir`, i.e. `endDir` points out of the target side),
// avoiding `obstacles`. Returns null if no route fits the search region.
export function routeOrthogonal(
  start: Point,
  startDir: Dir,
  end: Point,
  endDir: Dir,
  obstacles: XYWH[],
  occupancy: Occupancy
): Point[] | null {
  for (const { margin, pad } of ATTEMPTS) {
    const route = routeOnce(start, startDir, end, endDir, obstacles, occupancy, margin, pad);
    if (route) return route;
  }
  return null;
}

function routeOnce(
  start: Point,
  startDir: Dir,
  end: Point,
  endDir: Dir,
  obstacles: XYWH[],
  occupancy: Occupancy,
  MARGIN: number,
  REGION_PAD: number
): Point[] | null {
  const s1 = { x: start.x + startDir[0] * STUB, y: start.y + startDir[1] * STUB };
  const e1 = { x: end.x + endDir[0] * STUB, y: end.y + endDir[1] * STUB };

  const region: Box = {
    x0: Math.min(s1.x, e1.x) - REGION_PAD,
    y0: Math.min(s1.y, e1.y) - REGION_PAD,
    x1: Math.max(s1.x, e1.x) + REGION_PAD,
    y1: Math.max(s1.y, e1.y) + REGION_PAD,
  };
  const boxes: Box[] = obstacles
    .map((o) => ({
      x0: o.x - MARGIN,
      y0: o.y - MARGIN,
      x1: o.x + o.width + MARGIN,
      y1: o.y + o.height + MARGIN,
    }))
    .filter(
      (b) =>
        b.x1 > region.x0 && b.x0 < region.x1 && b.y1 > region.y0 && b.y0 < region.y1
    );

  const xsRaw = [s1.x, e1.x, (s1.x + e1.x) / 2, region.x0, region.x1];
  const ysRaw = [s1.y, e1.y, (s1.y + e1.y) / 2, region.y0, region.y1];
  for (const b of boxes) {
    xsRaw.push(b.x0, b.x1, b.x0 - LANE, b.x1 + LANE, b.x0 - 2 * LANE, b.x1 + 2 * LANE);
    ysRaw.push(b.y0, b.y1, b.y0 - LANE, b.y1 + LANE, b.y0 - 2 * LANE, b.y1 + 2 * LANE);
  }
  const clampX = (v: number) => Math.min(Math.max(v, region.x0), region.x1);
  const clampY = (v: number) => Math.min(Math.max(v, region.y0), region.y1);
  const xs = uniqueSorted(xsRaw.map(clampX));
  const ys = uniqueSorted(ysRaw.map(clampY));
  const nx = xs.length;
  const ny = ys.length;

  const insideBox = (x: number, y: number) =>
    boxes.some((b) => x > b.x0 + 0.01 && x < b.x1 - 0.01 && y > b.y0 + 0.01 && y < b.y1 - 0.01);

  const findIndex = (arr: number[], v: number) => {
    let best = 0;
    for (let i = 1; i < arr.length; i++) {
      if (Math.abs(arr[i] - v) < Math.abs(arr[best] - v)) best = i;
    }
    return best;
  };
  const sx = findIndex(xs, s1.x);
  const sy = findIndex(ys, s1.y);
  const ex = findIndex(xs, e1.x);
  const ey = findIndex(ys, e1.y);

  const node = (ix: number, iy: number) => iy * nx + ix;
  const blockedNode = new Uint8Array(nx * ny);
  for (let iy = 0; iy < ny; iy++) {
    for (let ix = 0; ix < nx; ix++) {
      blockedNode[node(ix, iy)] = insideBox(xs[ix], ys[iy]) ? 1 : 0;
    }
  }
  // The stub ends are always usable, even if they sit in a neighbor's margin.
  blockedNode[node(sx, sy)] = 0;
  blockedNode[node(ex, ey)] = 0;

  const startDirIndex = dirIndex(startDir);
  const arriveDirIndex = dirIndex([-endDir[0], -endDir[1]] as Dir);
  const stateCount = nx * ny * 4;
  const cost = new Float64Array(stateCount).fill(Infinity);
  const prev = new Int32Array(stateCount).fill(-1);
  const heap = new Heap();
  const h = (ix: number, iy: number) =>
    Math.abs(xs[ix] - xs[ex]) + Math.abs(ys[iy] - ys[ey]);

  const startState = node(sx, sy) * 4 + Math.max(startDirIndex, 0);
  cost[startState] = 0;
  heap.push(h(sx, sy), startState);
  let goalState = -1;

  while (heap.size) {
    const [, state] = heap.pop();
    const n = state >> 2;
    const d = state & 3;
    const ix = n % nx;
    const iy = (n / nx) | 0;
    const base = cost[state];
    if (ix === ex && iy === ey) {
      goalState = state;
      break;
    }
    for (let nd = 0; nd < 4; nd++) {
      const [dx, dy] = DIRS[nd];
      // No U-turns.
      if (dx === -DIRS[d][0] && dy === -DIRS[d][1]) continue;
      const jx = ix + dx;
      const jy = iy + dy;
      if (jx < 0 || jy < 0 || jx >= nx || jy >= ny) continue;
      const m = node(jx, jy);
      if (blockedNode[m]) continue;
      const midX = (xs[ix] + xs[jx]) / 2;
      const midY = (ys[iy] + ys[jy]) / 2;
      // Steps out of the start stub / into the end stub are always allowed,
      // since those points may sit in a close neighbor's clearance.
      const isStubStep = n === node(sx, sy) || m === node(ex, ey);
      if (!isStubStep && insideBox(midX, midY)) continue;
      const length = Math.abs(xs[jx] - xs[ix]) + Math.abs(ys[jy] - ys[iy]);
      const shared = occupancy.get(segmentKey(xs[ix], ys[iy], xs[jx], ys[jy])) ?? 0;
      let step = length + (nd !== d ? BEND_COST : 0) + shared * SHARED_SEGMENT_COST;
      if (jx === ex && jy === ey && arriveDirIndex >= 0 && nd !== arriveDirIndex) {
        step += BEND_COST;
      }
      const nextState = m * 4 + nd;
      const total = base + step;
      if (total < cost[nextState]) {
        cost[nextState] = total;
        prev[nextState] = state;
        heap.push(total + h(jx, jy), nextState);
      }
    }
  }
  if (goalState < 0) return null;

  // Walk back, recording the grid segments this route uses.
  const gridPoints: Point[] = [];
  for (let st = goalState; st >= 0; st = prev[st]) {
    const n = st >> 2;
    gridPoints.push({ x: xs[n % nx], y: ys[(n / nx) | 0] });
  }
  gridPoints.reverse();
  for (let i = 1; i < gridPoints.length; i++) {
    const a = gridPoints[i - 1];
    const b = gridPoints[i];
    const key = segmentKey(a.x, a.y, b.x, b.y);
    occupancy.set(key, (occupancy.get(key) ?? 0) + 1);
  }

  return simplifyPath([start, s1, ...gridPoints, e1, end]);
}
