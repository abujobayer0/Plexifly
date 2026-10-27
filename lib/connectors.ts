import { LiveMap, LiveObject } from "@liveblocks/client";
import { Layer, LayerType, LineLayer, Point, XYWH } from "@/types/canvas";
import { Dir, Occupancy, routeOrthogonal } from "./routing";

type LiveLayers = LiveMap<string, LiveObject<Layer>>;

// Gap between a connector's end and the edge of the shape it attaches to.
const EDGE_GAP = 6;

export const isLineLayer = (layer: Layer): layer is LineLayer =>
  layer.type === LayerType.Line || layer.type === LayerType.Arrow;

// Shapes a connector can attach to (anything but lines and paths).
export const isConnectable = (layer: Layer) =>
  !isLineLayer(layer) && layer.type !== LayerType.Path;

export function getLineEndpoints(layer: LineLayer) {
  const { x, y, width, height, flipX, flipY, waypoints } = layer;
  if (waypoints && waypoints.length >= 2) {
    const [sx, sy] = waypoints[0];
    const [ex, ey] = waypoints[waypoints.length - 1];
    return { start: { x: x + sx, y: y + sy }, end: { x: x + ex, y: y + ey } };
  }
  return {
    start: { x: flipX ? x + width : x, y: flipY ? y + height : y },
    end: { x: flipX ? x : x + width, y: flipY ? y : y + height },
  };
}

export function lineBoundsFromEndpoints(start: Point, end: Point) {
  return {
    x: Math.min(start.x, end.x),
    y: Math.min(start.y, end.y),
    width: Math.abs(end.x - start.x),
    height: Math.abs(end.y - start.y),
    flipX: end.x < start.x,
    flipY: end.y < start.y,
  };
}

const center = (b: XYWH): Point => ({
  x: b.x + b.width / 2,
  y: b.y + b.height / 2,
});

type Side = "left" | "right" | "top" | "bottom";
type Axis = "h" | "v";

// Vertical center of a table row, or null if `layer` isn't a table.
export function tableRowY(layer: Layer, row: number) {
  if (layer.type !== LayerType.Table) return null;
  const rows = layer.cells.length;
  const index = Math.min(Math.max(row, 0), rows - 1);
  return layer.y + (layer.height / rows) * (index + 0.5);
}

// Table row under canvas y, or undefined when `layer` isn't a table.
export function tableRowAt(layer: Layer, y: number) {
  if (layer.type !== LayerType.Table) return undefined;
  const rows = layer.cells.length;
  return Math.min(
    Math.max(Math.floor(((y - layer.y) / layer.height) * rows), 0),
    rows - 1
  );
}

// Which axis a connector between boxes `a` and `b` should run along.
function chooseAxis(a: XYWH, b: XYWH): Axis {
  const ca = center(a);
  const cb = center(b);
  const gapX = Math.abs(cb.x - ca.x) - (a.width + b.width) / 2;
  const gapY = Math.abs(cb.y - ca.y) - (a.height + b.height) / 2;
  return gapX >= gapY ? "h" : "v";
}

// Side of `box` facing `toward` on the given axis.
function facingSide(box: XYWH, toward: Point, axis: Axis): Side {
  const c = center(box);
  if (axis === "h") return toward.x >= c.x ? "right" : "left";
  return toward.y >= c.y ? "bottom" : "top";
}

// Point just outside `side` of `box`, shifted `offset` along the side, or
// level with a table row when `rowY` is given.
function portOn(box: XYWH, side: Side, offset: number, rowY: number | null) {
  const c = center(box);
  switch (side) {
    case "right":
      return { x: box.x + box.width + EDGE_GAP, y: rowY ?? c.y + offset };
    case "left":
      return { x: box.x - EDGE_GAP, y: rowY ?? c.y + offset };
    case "bottom":
      return { x: c.x + offset, y: box.y + box.height + EDGE_GAP };
    case "top":
      return { x: c.x + offset, y: box.y - EDGE_GAP };
  }
}

// First-pass route for a brand-new connector (no spreading). Attached ends
// leave and enter at side midpoints along whichever axis separates them more.
export function routeConnector(
  start: Point,
  end: Point,
  startLayer?: Layer,
  endLayer?: Layer
) {
  const a: XYWH = startLayer ?? { ...start, width: 0, height: 0 };
  const b: XYWH = endLayer ?? { ...end, width: 0, height: 0 };
  const elbow = chooseAxis(a, b);
  return {
    start: startLayer ? portOn(a, facingSide(a, center(b), elbow), 0, null) : start,
    end: endLayer ? portOn(b, facingSide(b, center(a), elbow), 0, null) : end,
    elbow,
  };
}

interface Plan {
  id: string;
  live: LiveObject<Layer>;
  layer: LineLayer;
  a: XYWH;
  b: XYWH;
  axis: Axis;
  startSide: Side;
  endSide: Side;
  startRowY: number | null;
  endRowY: number | null;
  startOffset: number;
  endOffset: number;
}

// Items connectors route around: anything solid or textual, but not
// sections (which arrows may cross), pen strokes, or other lines. Arrow
// labels live on the arrows themselves, so they never block a route.
const isObstacle = (layer: Layer) =>
  layer.type !== LayerType.Frame &&
  layer.type !== LayerType.Path &&
  !isLineLayer(layer);

// Size of an arrow's label chip, or null when it has no label.
export function labelChipSize(value?: string) {
  const text = (value ?? "").replace(/<[^>]*>/g, "").trim();
  if (!text) return null;
  return { width: Math.max(56, text.length * 7.6 + 28), height: 22 };
}

const boxesOverlap = (a: XYWH, b: XYWH) =>
  a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;

// Whether an axis-aligned segment passes through a box.
const segmentHitsBox = (p: Point, q: Point, box: XYWH) => {
  const x0 = Math.min(p.x, q.x);
  const x1 = Math.max(p.x, q.x);
  const y0 = Math.min(p.y, q.y);
  const y1 = Math.max(p.y, q.y);
  return x1 >= box.x && x0 <= box.x + box.width && y1 >= box.y && y0 <= box.y + box.height;
};

// Picks the center for a label chip on a straight run of `path` that can
// hold the whole chip, preferring the middle of long runs and avoiding
// items, other chips and other arrows' lines.
function placeLabelChip(
  path: Point[],
  size: { width: number; height: number },
  obstacles: XYWH[],
  chips: XYWH[],
  otherSegments: [Point, Point][]
): Point {
  let best: { point: Point; score: number } | null = null;
  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1];
    const b = path[i];
    const length = Math.hypot(b.x - a.x, b.y - a.y);
    const horizontal = Math.abs(b.y - a.y) < 0.5;
    const need = (horizontal ? size.width : size.height) + 20;
    if (length < need) continue;
    for (const t of [0.5, 0.35, 0.65, 0.2, 0.8]) {
      const point = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
      // Keep the whole chip on this run, clear of the bends.
      const half = (horizontal ? size.width : size.height) / 2 + 8;
      const along = horizontal ? point.x : point.y;
      const lo = Math.min(horizontal ? a.x : a.y, horizontal ? b.x : b.y);
      const hi = Math.max(horizontal ? a.x : a.y, horizontal ? b.x : b.y);
      if (along - half < lo || along + half > hi) continue;
      const box = {
        x: point.x - size.width / 2,
        y: point.y - size.height / 2,
        width: size.width,
        height: size.height,
      };
      let score = Math.abs(t - 0.5) * 20 - length * 0.02;
      score += obstacles.filter((o) => boxesOverlap(o, box)).length * 1000;
      score += chips.filter((c) => boxesOverlap(c, box)).length * 800;
      score += otherSegments.filter(([p, q]) => segmentHitsBox(p, q, box)).length * 300;
      if (!best || score < best.score) best = { point, score };
    }
  }
  if (best) return best.point;
  // No run is long enough: fall back to the middle of the longest one.
  let longest: [Point, Point] = [path[0], path[path.length - 1]];
  for (let i = 1; i < path.length; i++) {
    if (
      Math.hypot(path[i].x - path[i - 1].x, path[i].y - path[i - 1].y) >
      Math.hypot(longest[1].x - longest[0].x, longest[1].y - longest[0].y)
    ) {
      longest = [path[i - 1], path[i]];
    }
  }
  return { x: (longest[0].x + longest[1].x) / 2, y: (longest[0].y + longest[1].y) / 2 };
}

const SIDE_DIRS: Record<Side, Dir> = {
  left: [-1, 0],
  right: [1, 0],
  top: [0, -1],
  bottom: [0, 1],
};

// Re-routes connectors attached to any of `changedIds` (all connectors when
// omitted; a connector's own id also counts), detaching ends whose shape no
// longer exists. Arrows that meet the same side of a shape are spread
// evenly along it, ordered by where their other end is; table-row ends
// attach level with their row. With `avoid` (the default) each route steers
// around other items and away from tracks earlier routes took; without it
// (used while dragging, for speed) connectors fall back to a simple elbow.
export function updateConnectors(
  liveLayers: LiveLayers,
  changedIds?: ReadonlySet<string>,
  { avoid = true }: { avoid?: boolean } = {}
) {
  const connectors: { id: string; live: LiveObject<Layer>; layer: LineLayer }[] = [];
  liveLayers.forEach((live, id) => {
    const layer = live.toImmutable();
    if (isLineLayer(layer) && (layer.startId || layer.endId)) {
      connectors.push({ id, live, layer });
    }
  });

  // Drop attachments to shapes that are gone.
  for (const connector of connectors) {
    const liveLine = connector.live as unknown as LiveObject<LineLayer>;
    const { startId, endId } = connector.layer;
    if (startId && !liveLayers.get(startId)) {
      liveLine.delete("startId");
      liveLine.delete("startRow");
    }
    if (endId && !liveLayers.get(endId)) {
      liveLine.delete("endId");
      liveLine.delete("endRow");
    }
    connector.layer = liveLine.toImmutable();
  }

  // Re-route everything on the affected shapes (two levels out), so each
  // shared side is spread with its full set of arrows.
  let selected = connectors;
  if (changedIds) {
    const touches = (c: (typeof connectors)[number], shapes: Set<string>) =>
      shapes.has(c.id) ||
      (c.layer.startId != null && shapes.has(c.layer.startId)) ||
      (c.layer.endId != null && shapes.has(c.layer.endId));
    let shapes = new Set(changedIds);
    for (let level = 0; level < 2; level++) {
      selected = connectors.filter((c) => touches(c, shapes));
      shapes = new Set(shapes);
      for (const c of selected) {
        if (c.layer.startId) shapes.add(c.layer.startId);
        if (c.layer.endId) shapes.add(c.layer.endId);
      }
    }
    selected = connectors.filter((c) => touches(c, shapes));
  }

  const plans: Plan[] = [];
  for (const { id, live, layer } of selected) {
    const startLayer = layer.startId
      ? liveLayers.get(layer.startId)?.toImmutable()
      : undefined;
    const endLayer = layer.endId
      ? liveLayers.get(layer.endId)?.toImmutable()
      : undefined;
    if (!startLayer && !endLayer) continue;
    const { start, end } = getLineEndpoints(layer);
    const a: XYWH = startLayer ?? { ...start, width: 0, height: 0 };
    const b: XYWH = endLayer ?? { ...end, width: 0, height: 0 };
    const startRowY =
      startLayer && layer.startRow != null
        ? tableRowY(startLayer, layer.startRow)
        : null;
    const endRowY =
      endLayer && layer.endRow != null ? tableRowY(endLayer, layer.endRow) : null;
    // Row links always leave a table sideways.
    const axis: Axis =
      startRowY != null || endRowY != null ? "h" : chooseAxis(a, b);
    plans.push({
      id,
      live,
      layer,
      a: startLayer ?? a,
      b: endLayer ?? b,
      axis,
      startSide: facingSide(a, center(b), axis),
      endSide: facingSide(b, center(a), axis),
      startRowY,
      endRowY,
      startOffset: 0,
      endOffset: 0,
    });
  }

  // Spread ends that share a shape side (row ends already have their own spot).
  const groups = new Map<string, { plan: Plan; end: "start" | "end" }[]>();
  for (const plan of plans) {
    if (plan.layer.startId && plan.startRowY == null) {
      const key = `${plan.layer.startId}|${plan.startSide}`;
      groups.set(key, [...(groups.get(key) ?? []), { plan, end: "start" }]);
    }
    if (plan.layer.endId && plan.endRowY == null) {
      const key = `${plan.layer.endId}|${plan.endSide}`;
      groups.set(key, [...(groups.get(key) ?? []), { plan, end: "end" }]);
    }
  }
  for (const [key, entries] of groups) {
    if (entries.length < 2) continue;
    const side = key.split("|")[1] as Side;
    const vertical = side === "left" || side === "right";
    const box = entries[0].end === "start" ? entries[0].plan.a : entries[0].plan.b;
    const otherCenter = (e: (typeof entries)[number]) =>
      center(e.end === "start" ? e.plan.b : e.plan.a);
    entries.sort((p, q) => {
      const d = vertical
        ? otherCenter(p).y - otherCenter(q).y
        : otherCenter(p).x - otherCenter(q).x;
      return d || p.plan.id.localeCompare(q.plan.id);
    });
    const length = vertical ? box.height : box.width;
    const spacing = Math.min(22, length / (entries.length + 1));
    entries.forEach((entry, i) => {
      const offset = (i - (entries.length - 1) / 2) * spacing;
      if (entry.end === "start") entry.plan.startOffset = offset;
      else entry.plan.endOffset = offset;
    });
  }

  const obstacles: { id: string; box: XYWH }[] = [];
  if (avoid) {
    liveLayers.forEach((live, id) => {
      const layer = live.toImmutable();
      if (isObstacle(layer)) {
        obstacles.push({
          id,
          box: { x: layer.x, y: layer.y, width: layer.width, height: layer.height },
        });
      }
    });
  }
  const occupancy: Occupancy = new Map();
  const routedPaths = new Map<string, Point[]>();

  // Route shorter connectors first so they get the most direct tracks.
  const ordered = [...plans].sort(
    (p, q) =>
      Math.hypot(center(p.a).x - center(p.b).x, center(p.a).y - center(p.b).y) -
      Math.hypot(center(q.a).x - center(q.b).x, center(q.a).y - center(q.b).y)
  );

  for (const plan of ordered) {
    const { start, end } = getLineEndpoints(plan.layer);
    const startPoint = plan.layer.startId
      ? portOn(plan.a, plan.startSide, plan.startOffset, plan.startRowY)
      : start;
    const endPoint = plan.layer.endId
      ? portOn(plan.b, plan.endSide, plan.endOffset, plan.endRowY)
      : end;
    const sides = {
      ...(plan.layer.startId && { startSide: plan.startSide }),
      ...(plan.layer.endId && { endSide: plan.endSide }),
    };
    const liveLine = plan.live as unknown as LiveObject<LineLayer>;

    const route = avoid
      ? routeOrthogonal(
          startPoint,
          plan.layer.startId ? SIDE_DIRS[plan.startSide] : [0, 0],
          endPoint,
          plan.layer.endId ? SIDE_DIRS[plan.endSide] : [0, 0],
          obstacles.map((o) => o.box),
          occupancy
        )
      : null;

    if (route) {
      const minX = Math.min(...route.map((p) => p.x));
      const minY = Math.min(...route.map((p) => p.y));
      const maxX = Math.max(...route.map((p) => p.x));
      const maxY = Math.max(...route.map((p) => p.y));
      liveLine.update({
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
        flipX: false,
        flipY: false,
        elbow: plan.axis,
        ...sides,
        waypoints: route.map((p) => [p.x - minX, p.y - minY]),
      });
      routedPaths.set(plan.id, route);
    } else {
      liveLine.delete("waypoints");
      liveLine.delete("labelAt");
      liveLine.update({
        ...lineBoundsFromEndpoints(startPoint, endPoint),
        elbow: plan.axis,
        ...sides,
      });
    }
  }

  if (!avoid) return;

  // Place label chips once every route is known. Chips of connectors not
  // re-routed this pass keep their spots and count as taken.
  const pathOf = (layer: LineLayer): Point[] =>
    layer.waypoints && layer.waypoints.length >= 2
      ? layer.waypoints.map(([px, py]) => ({ x: layer.x + px, y: layer.y + py }))
      : (() => {
          const { start, end } = getLineEndpoints(layer);
          return [start, end];
        })();
  const allSegments: { id: string; segment: [Point, Point] }[] = [];
  const chips: XYWH[] = [];
  for (const { id, layer } of connectors) {
    const current = (liveLayers.get(id)?.toImmutable() ?? layer) as LineLayer;
    const path = routedPaths.get(id) ?? pathOf(current);
    for (let i = 1; i < path.length; i++) {
      allSegments.push({ id, segment: [path[i - 1], path[i]] });
    }
    const size = labelChipSize(current.value);
    if (!routedPaths.has(id) && size && current.labelAt) {
      chips.push({
        x: current.x + current.labelAt[0] - size.width / 2,
        y: current.y + current.labelAt[1] - size.height / 2,
        width: size.width,
        height: size.height,
      });
    }
  }
  const obstacleBoxes = obstacles.map((o) => o.box);
  for (const plan of ordered) {
    const path = routedPaths.get(plan.id);
    const live = plan.live as unknown as LiveObject<LineLayer>;
    const current = live.toImmutable();
    const size = labelChipSize(current.value);
    if (!path || !size) continue;
    const others = allSegments.filter((s) => s.id !== plan.id).map((s) => s.segment);
    const center = placeLabelChip(path, size, obstacleBoxes, chips, others);
    chips.push({
      x: center.x - size.width / 2,
      y: center.y - size.height / 2,
      width: size.width,
      height: size.height,
    });
    live.update({ labelAt: [center.x - current.x, center.y - current.y] });
  }
}

const contains = (outer: XYWH, inner: XYWH) =>
  inner.x >= outer.x &&
  inner.y >= outer.y &&
  inner.x + inner.width <= outer.x + outer.width &&
  inner.y + inner.height <= outer.y + outer.height;

// The given ids plus every layer that sits fully inside a selected section,
// so moving a section carries its contents along.
export function expandWithSectionContents(
  liveLayers: LiveLayers,
  ids: readonly string[]
): string[] {
  const result = new Set(ids);
  const frames = ids
    .map((id) => liveLayers.get(id)?.toImmutable())
    .filter((layer): layer is Layer => layer?.type === LayerType.Frame);
  if (frames.length === 0) return [...result];

  liveLayers.forEach((liveLayer, id) => {
    if (result.has(id)) return;
    const layer = liveLayer.toImmutable();
    if (frames.some((frame) => contains(frame, layer))) result.add(id);
  });
  return [...result];
}
