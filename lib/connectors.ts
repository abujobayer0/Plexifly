import { LiveMap, LiveObject } from "@liveblocks/client";
import { Layer, LayerType, LineLayer, Point, XYWH } from "@/types/canvas";

type LiveLayers = LiveMap<string, LiveObject<Layer>>;

// Gap between a connector's end and the edge of the shape it attaches to.
const EDGE_GAP = 6;

export const isLineLayer = (layer: Layer): layer is LineLayer =>
  layer.type === LayerType.Line || layer.type === LayerType.Arrow;

// Shapes a connector can attach to (anything but lines and paths).
export const isConnectable = (layer: Layer) =>
  !isLineLayer(layer) && layer.type !== LayerType.Path;

export function getLineEndpoints(layer: LineLayer) {
  const { x, y, width, height, flipX, flipY } = layer;
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

// Point on the outline of `layer` along the ray from its center to `toward`.
export function edgePoint(layer: Layer, toward: Point): Point {
  const c = center(layer);
  const dx = toward.x - c.x;
  const dy = toward.y - c.y;
  const hw = Math.max(layer.width / 2, 1);
  const hh = Math.max(layer.height / 2, 1);
  if (dx === 0 && dy === 0) return c;

  let scale: number;
  if (layer.type === LayerType.Ellipse) {
    scale = 1 / Math.sqrt((dx / hw) ** 2 + (dy / hh) ** 2);
  } else if (layer.type === LayerType.Diamond) {
    scale = 1 / (Math.abs(dx) / hw + Math.abs(dy) / hh);
  } else {
    scale = Math.min(
      dx === 0 ? Infinity : hw / Math.abs(dx),
      dy === 0 ? Infinity : hh / Math.abs(dy)
    );
  }
  const length = Math.hypot(dx, dy);
  const gap = Math.min(EDGE_GAP / length, 1 - scale);
  const t = Math.max(scale + Math.max(gap, 0), 0);
  return { x: c.x + dx * t, y: c.y + dy * t };
}

// Endpoints for a connector between optional start/end shapes; free ends
// keep their given positions.
export function routeConnector(
  start: Point,
  end: Point,
  startLayer?: Layer,
  endLayer?: Layer
) {
  const startTarget = endLayer ? center(endLayer) : end;
  const endTarget = startLayer ? center(startLayer) : start;
  return {
    start: startLayer ? edgePoint(startLayer, startTarget) : start,
    end: endLayer ? edgePoint(endLayer, endTarget) : end,
  };
}

// Re-routes connectors attached to any of `changedIds` (all connectors when
// omitted), and detaches ends whose shape no longer exists.
export function updateConnectors(
  liveLayers: LiveLayers,
  changedIds?: ReadonlySet<string>
) {
  liveLayers.forEach((liveLayer) => {
    const layer = liveLayer.toImmutable();
    if (!isLineLayer(layer) || (!layer.startId && !layer.endId)) return;
    const touches =
      !changedIds ||
      (layer.startId != null && changedIds.has(layer.startId)) ||
      (layer.endId != null && changedIds.has(layer.endId));
    if (!touches) return;

    const startLayer = layer.startId
      ? liveLayers.get(layer.startId)?.toImmutable()
      : undefined;
    const endLayer = layer.endId
      ? liveLayers.get(layer.endId)?.toImmutable()
      : undefined;
    // Safe: isLineLayer above confirmed this is a line/arrow.
    const liveLine = liveLayer as unknown as LiveObject<LineLayer>;
    if (layer.startId && !startLayer) liveLine.delete("startId");
    if (layer.endId && !endLayer) liveLine.delete("endId");

    const { start, end } = getLineEndpoints(layer);
    const routed = routeConnector(start, end, startLayer, endLayer);
    liveLayer.update(lineBoundsFromEndpoints(routed.start, routed.end));
  });
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
