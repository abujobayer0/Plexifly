"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Info from "./info";
import Participants from "./participants";
import Toolbar from "./toolbar";
import { nanoid } from "nanoid";

import {
  useCanRedo,
  useCanUndo,
  useHistory,
  useMutation,
  useOthersMapped,
  useSelf,
  useStatus,
  useStorage,
} from "@liveblocks/react";

import {
  Camera,
  CanvasMode,
  CanvasState,
  Color,
  InsertableLayerType,
  Layer,
  LayerType,
  LineLayer,
  Point,
  Side,
  XYWH,
} from "@/types/canvas";

import { CursorsPresence } from "./cursors-presence";
import {
  colorToCss,
  connectionIdToColor,
  findIntersectingLayersWithRectangle,
  penPointToPathLayer,
  pointerEventToCanvasPoint,
  resizeBounds,
} from "@/lib/utils";
import { LiveMap, LiveObject } from "@liveblocks/client";
import { LayerPreview } from "./layer-preview";
import Loading from "./loading";
import { SelectionBox } from "./selection-box";
import { SelectionTools } from "./selection-tools";
import Path from "./path";
import { ZoomControls } from "./zoom-controls";
import { BOARD_TEMPLATES, TEMPLATE_COLORS } from "./templates";
import { FRAME_HEADER_HEIGHT } from "./frame";
import { useDisableScrollBounce } from "@/hooks/use-disable-scroll-bounce";
import { useDeleteLayers } from "@/hooks/use-delete-layers";
import {
  expandWithSectionContents,
  getLineEndpoints,
  isConnectable,
  isLineLayer,
  lineBoundsFromEndpoints,
  routeConnector,
  updateConnectors,
} from "@/lib/connectors";
import { shallow } from "@liveblocks/client";

const MAX_LAYERS = 1000;
const GRID_SIZE = 24;
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 5;
// Drags shorter than this (in canvas units) count as a click.
const DRAG_THRESHOLD = 5;
const PASTE_OFFSET = 20;

// Size used when a shape tool is clicked instead of dragged.
const DEFAULT_SIZES: Record<InsertableLayerType, { w: number; h: number }> = {
  [LayerType.Rectangle]: { w: 120, h: 120 },
  [LayerType.Ellipse]: { w: 120, h: 120 },
  [LayerType.Diamond]: { w: 120, h: 120 },
  [LayerType.Text]: { w: 200, h: 60 },
  [LayerType.Note]: { w: 200, h: 200 },
  [LayerType.Line]: { w: 160, h: 0 },
  [LayerType.Arrow]: { w: 160, h: 0 },
  [LayerType.Triangle]: { w: 140, h: 120 },
  [LayerType.Hexagon]: { w: 150, h: 120 },
  [LayerType.Parallelogram]: { w: 180, h: 100 },
  [LayerType.Cylinder]: { w: 120, h: 140 },
  [LayerType.Table]: { w: 480, h: 200 },
  [LayerType.Frame]: { w: 480, h: 360 },
};

const TABLE_DEFAULT_CELLS = [
  ["Column 1", "Column 2", "Column 3"],
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

const isGrayscale = (color: Color) => color.r === color.g && color.g === color.b;

// Builds a new layer of the given type filling `bounds`.
function createLayer(
  layerType: InsertableLayerType,
  bounds: XYWH,
  fill: Color,
  flip: { flipX: boolean; flipY: boolean }
): Layer {
  switch (layerType) {
    case LayerType.Line:
    case LayerType.Arrow:
      return { type: layerType, ...bounds, fill, ...flip };
    case LayerType.Table:
      return {
        type: layerType,
        ...bounds,
        fill: isGrayscale(fill) ? TEMPLATE_COLORS.indigo : fill,
        cells: TABLE_DEFAULT_CELLS.map((row) => [...row]),
      };
    case LayerType.Note:
      // Dark/gray notes look dull; default them to classic yellow.
      return {
        type: layerType,
        ...bounds,
        fill: isGrayscale(fill) ? TEMPLATE_COLORS.yellow : fill,
      };
    case LayerType.Frame:
      return {
        type: layerType,
        ...bounds,
        fill: isGrayscale(fill) ? TEMPLATE_COLORS.gray : fill,
        value: "Section",
      };
    default:
      return { type: layerType, ...bounds, fill };
  }
}

// Single-key shortcuts for switching tools.
const TOOL_SHORTCUTS: Record<string, CanvasState> = {
  v: { mode: CanvasMode.None },
  h: { mode: CanvasMode.Hand },
  p: { mode: CanvasMode.Pencil },
  e: { mode: CanvasMode.Eraser },
  r: { mode: CanvasMode.Inserting, layerType: LayerType.Rectangle },
  o: { mode: CanvasMode.Inserting, layerType: LayerType.Ellipse },
  d: { mode: CanvasMode.Inserting, layerType: LayerType.Diamond },
  l: { mode: CanvasMode.Inserting, layerType: LayerType.Line },
  a: { mode: CanvasMode.Inserting, layerType: LayerType.Arrow },
  t: { mode: CanvasMode.Inserting, layerType: LayerType.Text },
  n: { mode: CanvasMode.Inserting, layerType: LayerType.Note },
  g: { mode: CanvasMode.Inserting, layerType: LayerType.Table },
  f: { mode: CanvasMode.Inserting, layerType: LayerType.Frame },
};

const isLineType = (type: InsertableLayerType) =>
  type === LayerType.Line || type === LayerType.Arrow;

// Id of the top layer under a screen point, if any.
const layerIdAtPoint = (clientX: number, clientY: number) =>
  document
    .elementFromPoint(clientX, clientY)
    ?.closest("[data-layer-id]")
    ?.getAttribute("data-layer-id") ?? null;

const withoutAttachments = (layer: Layer): Layer => {
  if (!isLineLayer(layer)) return layer;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { startId, endId, ...rest } = layer;
  return rest;
};

const detachConnector = (layer: LiveObject<Layer>) => {
  // Only called for line layers, which carry startId/endId.
  const line = layer as unknown as LiveObject<LineLayer>;
  line.delete("startId");
  line.delete("endId");
};

// Moves layers by offset, re-routes connectors attached to them, and
// detaches moved connectors from shapes that stayed put.
function moveLayers(
  liveLayers: LiveMap<string, LiveObject<Layer>>,
  ids: readonly string[],
  offset: Point
) {
  const moved = new Set(ids);
  for (const id of ids) {
    const layer = liveLayers.get(id);
    if (!layer) continue;
    layer.update({
      x: layer.get("x") + offset.x,
      y: layer.get("y") + offset.y,
    });
    const value = layer.toImmutable();
    if (isLineLayer(value)) {
      const line = layer as unknown as LiveObject<LineLayer>;
      if (value.startId && !moved.has(value.startId)) line.delete("startId");
      if (value.endId && !moved.has(value.endId)) line.delete("endId");
    }
  }
  updateConnectors(liveLayers, moved);
}

const clampZoom = (zoom: number) =>
  Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));

interface CanvasProps {
  boardId: string;
}
export default function Canvas({ boardId }: CanvasProps) {
  const status = useStatus();

  const layerIds = useStorage((root) => root.layerIds)!;
  const pencilDraft = useSelf((me) => me.presence.pencilDraft);

  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });

  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0, zoom: 1 });
  // Matches the first color picker swatch.
  const [lastUsedColor, setLastUsedColor] = useState<Color>({
    r: 30,
    g: 30,
    b: 30,
  });
  const svgRef = useRef<SVGSVGElement>(null);
  // Last pointer position while translating; a ref avoids stale offsets
  // when several pointermove events fire before a re-render.
  const translateLastPointRef = useRef<Point | null>(null);
  // Screen-space pointer position while panning (hand tool, space or
  // middle mouse button).
  const panLastPointRef = useRef<Point | null>(null);
  const lastErasePointRef = useRef<Point | null>(null);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const clipboardRef = useRef<Layer[]>([]);
  // Layers moved by the current drag: the selection plus contents of any
  // selected sections.
  const translateIdsRef = useRef<string[]>([]);
  // Shape under the pointer where a line/arrow drag started.
  const connectorStartIdRef = useRef<string | null>(null);
  const [connectorHoverId, setConnectorHoverId] = useState<string | null>(
    null
  );
  const pasteCountRef = useRef(0);

  useDisableScrollBounce();
  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  const insertLayer = useMutation(
    (
      { storage, setMyPresence },
      layerType: InsertableLayerType,
      origin: Point,
      current: Point,
      connector?: { startId: string | null; endId: string | null }
    ) => {
      const liveLayers = storage.get("layers");
      if (liveLayers.size >= MAX_LAYERS) {
        return;
      }

      const isDrag =
        Math.abs(current.x - origin.x) > DRAG_THRESHOLD ||
        Math.abs(current.y - origin.y) > DRAG_THRESHOLD;
      const defaults = DEFAULT_SIZES[layerType];
      const end = isDrag
        ? current
        : { x: origin.x + defaults.w, y: origin.y + defaults.h };

      const bounds = {
        x: Math.min(origin.x, end.x),
        y: Math.min(origin.y, end.y),
        width: Math.abs(end.x - origin.x),
        height: Math.abs(end.y - origin.y),
      };

      let layer = createLayer(layerType, bounds, lastUsedColor, {
        flipX: end.x < origin.x,
        flipY: end.y < origin.y,
      });

      // Attach line/arrow ends to the shapes they were drawn from/to.
      if (isLineLayer(layer) && connector) {
        const findShape = (id: string | null) => {
          const shape = id ? liveLayers.get(id)?.toImmutable() : undefined;
          return shape && isConnectable(shape) ? shape : undefined;
        };
        const startLayer = findShape(connector.startId);
        const endLayer =
          connector.endId !== connector.startId
            ? findShape(connector.endId)
            : undefined;
        if (startLayer || endLayer) {
          const { start, end } = getLineEndpoints(layer);
          const routed = routeConnector(start, end, startLayer, endLayer);
          layer = {
            ...layer,
            ...lineBoundsFromEndpoints(routed.start, routed.end),
            ...(startLayer && { startId: connector.startId! }),
            ...(endLayer && { endId: connector.endId! }),
          };
        }
      }

      const layerId = nanoid();
      liveLayers.set(layerId, new LiveObject(layer));
      // Frames go to the bottom so they sit behind the content they group.
      if (layerType === LayerType.Frame) {
        storage.get("layerIds").insert(layerId, 0);
      } else {
        storage.get("layerIds").push(layerId);
      }
      setMyPresence({ selection: [layerId] }, { addToHistory: true });
      setCanvasState({ mode: CanvasMode.None });
    },
    [lastUsedColor]
  );

  const translateSelectedLayers = useMutation(
    ({ storage }, point: Point) => {
      const last = translateLastPointRef.current;
      if (canvasState.mode !== CanvasMode.Translating || last == null) {
        return;
      }

      const offset = {
        x: point.x - last.x,
        y: point.y - last.y,
      };
      moveLayers(storage.get("layers"), translateIdsRef.current, offset);
      translateLastPointRef.current = point;
    },
    [canvasState.mode]
  );

  const nudgeSelectedLayers = useMutation(
    ({ storage, self }, dx: number, dy: number) => {
      const liveLayers = storage.get("layers");
      moveLayers(
        liveLayers,
        expandWithSectionContents(liveLayers, self.presence.selection),
        { x: dx, y: dy }
      );
    },
    []
  );

  // Wraps the selection in a new section placed behind it.
  const groupIntoSection = useMutation(
    ({ storage, self, setMyPresence }) => {
      const liveLayers = storage.get("layers");
      const layers = self.presence.selection
        .map((id) => liveLayers.get(id)?.toImmutable())
        .filter((layer): layer is Layer => layer != null);
      if (layers.length === 0 || liveLayers.size >= MAX_LAYERS) return;

      const padding = 40;
      const left = Math.min(...layers.map((l) => l.x)) - padding;
      // Extra room on top for the section's header bar.
      const top =
        Math.min(...layers.map((l) => l.y)) - padding - FRAME_HEADER_HEIGHT;
      const right = Math.max(...layers.map((l) => l.x + l.width)) + padding;
      const bottom = Math.max(...layers.map((l) => l.y + l.height)) + padding;

      const id = nanoid();
      liveLayers.set(
        id,
        new LiveObject<Layer>({
          type: LayerType.Frame,
          x: left,
          y: top,
          width: right - left,
          height: bottom - top,
          fill: TEMPLATE_COLORS.indigo,
          value: "Section",
        })
      );
      // Directly beneath the lowest selected layer.
      const liveLayerIds = storage.get("layerIds");
      const indices = self.presence.selection
        .map((selectedId) => liveLayerIds.indexOf(selectedId))
        .filter((index) => index !== -1);
      liveLayerIds.insert(id, indices.length ? Math.min(...indices) : 0);
      setMyPresence({ selection: [id] }, { addToHistory: true });
    },
    []
  );

  // Removes selected sections but keeps their contents.
  const ungroupSections = useMutation(
    ({ storage, self, setMyPresence }) => {
      const liveLayers = storage.get("layers");
      const liveLayerIds = storage.get("layerIds");
      const frameIds = self.presence.selection.filter(
        (id) => liveLayers.get(id)?.get("type") === LayerType.Frame
      );
      if (frameIds.length === 0) return;
      const contents = expandWithSectionContents(liveLayers, frameIds).filter(
        (id) => !frameIds.includes(id)
      );
      for (const id of frameIds) {
        liveLayers.delete(id);
        const index = liveLayerIds.indexOf(id);
        if (index !== -1) liveLayerIds.delete(index);
      }
      setMyPresence({ selection: contents }, { addToHistory: true });
    },
    []
  );

  const unselectLayers = useMutation(({ self, setMyPresence }) => {
    if (self.presence.selection.length > 0) {
      setMyPresence({ selection: [] }, { addToHistory: true });
    }
  }, []);

  const selectAllLayers = useMutation(({ storage, setMyPresence }) => {
    setMyPresence(
      { selection: storage.get("layerIds").toImmutable().slice() },
      { addToHistory: true }
    );
  }, []);

  const copySelectedLayers = useMutation(({ storage, self }) => {
    const liveLayers = storage.get("layers");
    clipboardRef.current = self.presence.selection
      .map((id) => liveLayers.get(id)?.toImmutable())
      .filter((layer): layer is Layer => layer != null);
    pasteCountRef.current = 0;
  }, []);

  // Inserts copies of the given layers shifted by offset and selects them.
  const insertLayerCopies = useMutation(
    ({ storage, setMyPresence }, layers: Layer[], offset: number) => {
      const liveLayers = storage.get("layers");
      const liveLayerIds = storage.get("layerIds");
      const newIds: string[] = [];
      for (const layer of layers) {
        if (liveLayers.size >= MAX_LAYERS) break;
        const id = nanoid();
        liveLayers.set(
          id,
          new LiveObject(
            structuredClone(withoutAttachments({
              ...layer,
              x: layer.x + offset,
              y: layer.y + offset,
            }))
          )
        );
        liveLayerIds.push(id);
        newIds.push(id);
      }
      if (newIds.length > 0) {
        setMyPresence({ selection: newIds }, { addToHistory: true });
      }
    },
    []
  );

  const duplicateSelectedLayers = useMutation(
    ({ storage, self }) => {
      const liveLayers = storage.get("layers");
      const layers = self.presence.selection
        .map((id) => liveLayers.get(id)?.toImmutable())
        .filter((layer): layer is Layer => layer != null);
      insertLayerCopies(layers, PASTE_OFFSET);
    },
    [insertLayerCopies]
  );

  const pasteLayers = useCallback(() => {
    if (clipboardRef.current.length === 0) return;
    pasteCountRef.current += 1;
    insertLayerCopies(clipboardRef.current, PASTE_OFFSET * pasteCountRef.current);
  }, [insertLayerCopies]);

  // Adds a template's layers centered in the current viewport.
  const insertTemplate = useMutation(
    ({ storage, setMyPresence }, templateId: string) => {
      const template = BOARD_TEMPLATES.find((t) => t.id === templateId);
      if (!template) return;
      const layers = template.build();
      const liveLayers = storage.get("layers");
      if (liveLayers.size + layers.length > MAX_LAYERS) return;

      const left = Math.min(...layers.map((l) => l.x));
      const top = Math.min(...layers.map((l) => l.y));
      const right = Math.max(...layers.map((l) => l.x + l.width));
      const bottom = Math.max(...layers.map((l) => l.y + l.height));
      const center = {
        x: (window.innerWidth / 2 - camera.x) / camera.zoom,
        y: (window.innerHeight / 2 - camera.y) / camera.zoom,
      };
      const dx = center.x - (left + right) / 2;
      const dy = center.y - (top + bottom) / 2;

      const liveLayerIds = storage.get("layerIds");
      const ids: string[] = [];
      let frameIndex = 0;
      for (const layer of layers) {
        const id = nanoid();
        liveLayers.set(
          id,
          new LiveObject({ ...layer, x: layer.x + dx, y: layer.y + dy })
        );
        if (layer.type === LayerType.Frame) {
          liveLayerIds.insert(id, frameIndex++);
        } else {
          liveLayerIds.push(id);
        }
        ids.push(id);
      }
      setMyPresence({ selection: ids }, { addToHistory: true });
      setCanvasState({ mode: CanvasMode.None });
    },
    [camera]
  );

  const eraseLayers = useMutation(
    ({ storage, self, setMyPresence }, ids: string[]) => {
      const liveLayers = storage.get("layers");
      const liveLayerIds = storage.get("layerIds");
      for (const id of ids) {
        liveLayers.delete(id);
        const index = liveLayerIds.indexOf(id);
        if (index !== -1) liveLayerIds.delete(index);
      }
      updateConnectors(liveLayers, new Set(ids));
      const selection = self.presence.selection.filter(
        (id) => !ids.includes(id)
      );
      if (selection.length !== self.presence.selection.length) {
        setMyPresence({ selection });
      }
    },
    []
  );

  // Erases every layer under the screen-space segment from the previous
  // erase point to this one, so fast strokes don't skip shapes.
  const eraseAlong = useCallback(
    (to: Point) => {
      const from = lastErasePointRef.current ?? to;
      lastErasePointRef.current = to;
      const distance = Math.hypot(to.x - from.x, to.y - from.y);
      const steps = Math.max(1, Math.ceil(distance / 6));
      const ids = new Set<string>();
      for (let i = 0; i <= steps; i++) {
        const x = from.x + ((to.x - from.x) * i) / steps;
        const y = from.y + ((to.y - from.y) * i) / steps;
        const id = document
          .elementFromPoint(x, y)
          ?.closest("[data-layer-id]")
          ?.getAttribute("data-layer-id");
        if (id) ids.add(id);
      }
      if (ids.size > 0) eraseLayers([...ids]);
    },
    [eraseLayers]
  );

  const updateSelectionNet = useMutation(
    ({ storage, setMyPresence }, current: Point, origin: Point) => {
      const layers = storage.get("layers").toImmutable();
      setCanvasState({ mode: CanvasMode.SelectionNet, origin, current });
      const ids = findIntersectingLayersWithRectangle(
        layerIds,
        layers,
        origin,
        current
      );
      setMyPresence({ selection: ids });
    },
    [layerIds]
  );

  const startMultiSelection = useCallback((current: Point, origin: Point) => {
    if (Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > 5) {
      setCanvasState({
        mode: CanvasMode.SelectionNet,
        origin,
        current,
      });
    }
  }, []);

  const startDrawing = useMutation(
    ({ setMyPresence }, point: Point, pressure: number) => {
      setMyPresence({
        pencilDraft: [[point.x, point.y, pressure]],
        penColor: lastUsedColor,
      });
    },
    [lastUsedColor]
  );

  const insertPath = useMutation(
    ({ storage, self, setMyPresence }) => {
      const liveLayers = storage.get("layers");
      const { pencilDraft } = self.presence;
      if (
        pencilDraft == null ||
        pencilDraft.length < 2 ||
        liveLayers.size >= MAX_LAYERS
      ) {
        setMyPresence({ pencilDraft: null });
        return;
      }
      const id = nanoid();

      liveLayers.set(
        id,
        new LiveObject(penPointToPathLayer(pencilDraft, lastUsedColor))
      );

      const liveLayerIds = storage.get("layerIds");
      liveLayerIds.push(id);

      setMyPresence({
        pencilDraft: null,
      });

      setCanvasState({ mode: CanvasMode.Pencil });
    },
    [lastUsedColor]
  );

  const continueDrawing = useMutation(
    ({ self, setMyPresence }, point: Point, e: React.PointerEvent) => {
      const { pencilDraft } = self.presence;

      if (
        canvasState.mode !== CanvasMode.Pencil ||
        e.buttons !== 1 ||
        pencilDraft == null
      ) {
        return;
      }
      setMyPresence({
        cursor: point,
        pencilDraft:
          pencilDraft.length === 1 &&
          pencilDraft[0][0] === point.x &&
          pencilDraft[0][1] === point.y
            ? pencilDraft
            : [...pencilDraft, [point.x, point.y, e.pressure]],
      });
    },
    [canvasState.mode]
  );

  const resizeSelectedLayer = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Resizing) {
        return;
      }

      const bounds = resizeBounds(
        canvasState.initialBounds,
        canvasState.corner,
        point
      );

      const liveLayers = storage.get("layers");
      const id = self.presence.selection[0];
      const layer = liveLayers.get(id);

      if (layer) {
        layer.update(bounds);
        const updated = layer.toImmutable();
        if (isLineLayer(updated)) {
          // A manually reshaped connector no longer follows its shapes.
          detachConnector(layer);
        } else {
          updateConnectors(liveLayers, new Set([id]));
        }
      }
    },

    [canvasState]
  );

  const onResizeHandlePointerDown = useCallback(
    (corner: Side, initialBounds: XYWH) => {
      history.pause();
      setCanvasState({
        mode: CanvasMode.Resizing,
        initialBounds,
        corner,
      });
    },
    [history]
  );

  // Zooms to the given level, keeping the screen point `anchor` fixed.
  const zoomTo = useCallback((zoom: number, anchor?: Point) => {
    setCamera((camera) => {
      const nextZoom = clampZoom(zoom);
      const { x: ax, y: ay } = anchor ?? {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      };
      const ratio = nextZoom / camera.zoom;
      return {
        zoom: nextZoom,
        x: ax - (ax - camera.x) * ratio,
        y: ay - (ay - camera.y) * ratio,
      };
    });
  }, []);

  const zoomBy = useCallback(
    (factor: number) => zoomTo(camera.zoom * factor),
    [camera.zoom, zoomTo]
  );

  const zoomToFit = useMutation(({ storage }) => {
    const layers = [...storage.get("layers").toImmutable().values()];
    if (layers.length === 0) {
      setCamera({ x: 0, y: 0, zoom: 1 });
      return;
    }
    const left = Math.min(...layers.map((l) => l.x));
    const top = Math.min(...layers.map((l) => l.y));
    const right = Math.max(...layers.map((l) => l.x + l.width));
    const bottom = Math.max(...layers.map((l) => l.y + l.height));

    const padding = 80;
    const zoom = clampZoom(
      Math.min(
        (window.innerWidth - padding * 2) / Math.max(right - left, 1),
        (window.innerHeight - padding * 2) / Math.max(bottom - top, 1),
        1
      )
    );
    setCamera({
      zoom,
      x: window.innerWidth / 2 - ((left + right) / 2) * zoom,
      y: window.innerHeight / 2 - ((top + bottom) / 2) * zoom,
    });
  }, []);

  // React registers wheel listeners as passive, so preventDefault() there
  // can't stop the browser from zooming the page. Attach natively instead.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    function onWheel(e: WheelEvent) {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        setCamera((camera) => {
          const zoom = clampZoom(camera.zoom * (1 - e.deltaY / 500));
          // Keep the canvas point under the cursor fixed while zooming.
          const ratio = zoom / camera.zoom;
          return {
            zoom,
            x: e.clientX - (e.clientX - camera.x) * ratio,
            y: e.clientY - (e.clientY - camera.y) * ratio,
          };
        });
      } else {
        setCamera((camera) => ({
          ...camera,
          x: camera.x - e.deltaX,
          y: camera.y - e.deltaY,
        }));
      }
    }

    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, [status]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const shouldPan =
        e.button === 1 ||
        (e.button === 0 &&
          (isSpacePressed || canvasState.mode === CanvasMode.Hand));
      if (e.button !== 0 && !shouldPan) return;

      // Keep receiving move/up events even if the pointer leaves the canvas.
      e.currentTarget.setPointerCapture(e.pointerId);

      if (shouldPan) {
        e.preventDefault();
        panLastPointRef.current = { x: e.clientX, y: e.clientY };
        setIsPanning(true);
        return;
      }

      const point = pointerEventToCanvasPoint(e, camera);

      if (canvasState.mode === CanvasMode.Inserting) {
        connectorStartIdRef.current = isLineType(canvasState.layerType)
          ? layerIdAtPoint(e.clientX, e.clientY)
          : null;
        setCanvasState({ ...canvasState, origin: point, current: point });
        return;
      }

      if (canvasState.mode === CanvasMode.Eraser) {
        history.pause();
        lastErasePointRef.current = null;
        setCanvasState({ mode: CanvasMode.Eraser, isErasing: true });
        eraseAlong({ x: e.clientX, y: e.clientY });
        return;
      }

      if (canvasState.mode === CanvasMode.Pencil) {
        startDrawing(point, e.pressure);
        return;
      }
      setCanvasState({ origin: point, mode: CanvasMode.Pressing });
    },
    [canvasState, camera, startDrawing, isSpacePressed, history, eraseAlong]
  );

  const onPointerMove = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      e.preventDefault();

      const panLast = panLastPointRef.current;
      if (panLast != null) {
        if (e.buttons === 0) {
          panLastPointRef.current = null;
          setIsPanning(false);
        } else {
          const dx = e.clientX - panLast.x;
          const dy = e.clientY - panLast.y;
          panLastPointRef.current = { x: e.clientX, y: e.clientY };
          setCamera((camera) => ({
            ...camera,
            x: camera.x + dx,
            y: camera.y + dy,
          }));
          return;
        }
      }

      const current = pointerEventToCanvasPoint(e, camera);

      // The button was released somewhere we didn't see (e.g. outside the
      // window): end the interaction instead of leaving it stuck.
      if (
        e.buttons === 0 &&
        (canvasState.mode === CanvasMode.Pressing ||
          canvasState.mode === CanvasMode.SelectionNet ||
          canvasState.mode === CanvasMode.Translating ||
          canvasState.mode === CanvasMode.Resizing)
      ) {
        translateLastPointRef.current = null;
        setCanvasState({ mode: CanvasMode.None });
        history.resume();
        setMyPresence({ cursor: current });
        return;
      }
      if (
        e.buttons === 0 &&
        canvasState.mode === CanvasMode.Pencil &&
        pencilDraft != null
      ) {
        insertPath();
        setMyPresence({ cursor: current });
        return;
      }

      if (canvasState.mode === CanvasMode.Pressing) {
        startMultiSelection(current, canvasState.origin);
      } else if (canvasState.mode === CanvasMode.SelectionNet) {
        updateSelectionNet(current, canvasState.origin);
      } else if (canvasState.mode === CanvasMode.Translating) {
        translateSelectedLayers(current);
      } else if (canvasState.mode === CanvasMode.Resizing) {
        resizeSelectedLayer(current);
      } else if (canvasState.mode === CanvasMode.Pencil) {
        continueDrawing(current, e);
      } else if (canvasState.mode === CanvasMode.Inserting) {
        if (canvasState.origin != null) {
          setCanvasState({ ...canvasState, current });
        }
        if (isLineType(canvasState.layerType)) {
          const hoverId = layerIdAtPoint(e.clientX, e.clientY);
          if (hoverId !== connectorHoverId) setConnectorHoverId(hoverId);
        }
      } else if (
        canvasState.mode === CanvasMode.Eraser &&
        canvasState.isErasing
      ) {
        if (e.buttons === 0) {
          setCanvasState({ mode: CanvasMode.Eraser });
          history.resume();
        } else {
          eraseAlong({ x: e.clientX, y: e.clientY });
        }
      }

      setMyPresence({ cursor: current });
    },
    [
      canvasState,
      resizeSelectedLayer,
      camera,
      translateSelectedLayers,
      continueDrawing,
      startMultiSelection,
      updateSelectionNet,
      insertPath,
      pencilDraft,
      history,
      eraseAlong,
      connectorHoverId,
    ]
  );

  const onPointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({ cursor: null });
  }, []);

  const onLayerPointerDown = useMutation(
    (
      { self, setMyPresence, storage },
      e: React.PointerEvent,
      layerId: string
    ) => {
      if (
        canvasState.mode === CanvasMode.Inserting ||
        canvasState.mode === CanvasMode.Pencil ||
        canvasState.mode === CanvasMode.Hand ||
        canvasState.mode === CanvasMode.Eraser ||
        isSpacePressed ||
        e.button !== 0
      ) {
        return;
      }
      history.pause();
      e.stopPropagation();

      const point = pointerEventToCanvasPoint(e, camera);
      let selection = self.presence.selection;
      if (e.shiftKey) {
        selection = selection.includes(layerId)
          ? selection.filter((id) => id !== layerId)
          : [...selection, layerId];
        setMyPresence({ selection }, { addToHistory: true });
      } else if (!selection.includes(layerId)) {
        selection = [layerId];
        setMyPresence({ selection }, { addToHistory: true });
      }
      translateIdsRef.current = expandWithSectionContents(
        storage.get("layers"),
        selection
      );
      translateLastPointRef.current = point;
      setCanvasState({ mode: CanvasMode.Translating, current: point });
    },
    [setCanvasState, camera, history, canvasState.mode, isSpacePressed]
  );

  const onPointerUp = useMutation(
    (_, e: React.PointerEvent) => {
      const point = pointerEventToCanvasPoint(e, camera);
      translateLastPointRef.current = null;

      if (panLastPointRef.current != null) {
        panLastPointRef.current = null;
        setIsPanning(false);
        return;
      }

      if (
        canvasState.mode === CanvasMode.None ||
        canvasState.mode === CanvasMode.Pressing
      ) {
        unselectLayers();
        setCanvasState({ mode: CanvasMode.None });
      } else if (canvasState.mode === CanvasMode.Pencil) {
        insertPath();
      } else if (canvasState.mode === CanvasMode.Inserting) {
        if (canvasState.origin != null) {
          insertLayer(
            canvasState.layerType,
            canvasState.origin,
            point,
            isLineType(canvasState.layerType)
              ? {
                  startId: connectorStartIdRef.current,
                  endId: layerIdAtPoint(e.clientX, e.clientY),
                }
              : undefined
          );
        }
        connectorStartIdRef.current = null;
        setConnectorHoverId(null);
      } else if (canvasState.mode === CanvasMode.Eraser) {
        lastErasePointRef.current = null;
        setCanvasState({ mode: CanvasMode.Eraser });
      } else if (canvasState.mode === CanvasMode.Hand) {
        // Stay in hand mode.
      } else {
        setCanvasState({
          mode: CanvasMode.None,
        });
      }
      history.resume();
    },
    [
      camera,
      canvasState,
      history,
      setCanvasState,
      insertLayer,
      unselectLayers,
      insertPath,
    ]
  );

  const selections = useOthersMapped((other) => other.presence.selection);

  const layerIdsToColorSelection = useMemo(() => {
    const layerIdsToColorSelection: Record<string, string> = {};
    for (const user of selections) {
      const [connectionId, selection] = user;

      for (const layerId of selection) {
        layerIdsToColorSelection[layerId] = connectionIdToColor(connectionId);
      }
    }
    return layerIdsToColorSelection;
  }, [selections]);

  const deleteLayers = useDeleteLayers();

  // Outline for the shape a connector would attach to.
  const connectorHoverBounds = useStorage((root) => {
    if (!connectorHoverId) return null;
    const layer = root.layers.get(connectorHoverId);
    if (!layer || !isConnectable(layer)) return null;
    return { x: layer.x, y: layer.y, width: layer.width, height: layer.height };
  }, shallow);

  // Switching to a drawing/insert tool drops the current selection so its
  // toolbar doesn't linger over the canvas.
  const onToolChange = useCallback(
    (newState: CanvasState) => {
      if (
        newState.mode !== CanvasMode.None &&
        newState.mode !== CanvasMode.Hand
      ) {
        unselectLayers();
      }
      setCanvasState(newState);
    },
    [unselectLayers]
  );

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const isEditing =
        target?.isContentEditable ||
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA";
      if (isEditing) {
        if (e.key === "Escape") target?.blur();
        return;
      }

      const key = e.key.toLowerCase();
      const mod = e.ctrlKey || e.metaKey;

      if (key === " ") {
        e.preventDefault();
        setIsSpacePressed(true);
        return;
      }

      if (mod) {
        switch (key) {
          case "z":
            e.preventDefault();
            if (e.shiftKey || e.altKey) history.redo();
            else history.undo();
            break;
          case "y":
            e.preventDefault();
            history.redo();
            break;
          case "a":
            e.preventDefault();
            selectAllLayers();
            break;
          case "c":
            copySelectedLayers();
            break;
          case "v":
            e.preventDefault();
            pasteLayers();
            break;
          case "d":
            e.preventDefault();
            duplicateSelectedLayers();
            break;
          case "g":
            e.preventDefault();
            if (e.shiftKey) ungroupSections();
            else groupIntoSection();
            break;
          case "=":
          case "+":
            e.preventDefault();
            zoomBy(1.2);
            break;
          case "-":
            e.preventDefault();
            zoomBy(1 / 1.2);
            break;
          case "0":
            e.preventDefault();
            zoomTo(1);
            break;
        }
        return;
      }

      if (e.altKey) return;

      switch (key) {
        case "delete":
        case "backspace":
          e.preventDefault();
          deleteLayers();
          return;
        case "escape":
          unselectLayers();
          setCanvasState({ mode: CanvasMode.None });
          return;
        case "arrowup":
        case "arrowdown":
        case "arrowleft":
        case "arrowright": {
          e.preventDefault();
          const step = e.shiftKey ? 10 : 1;
          nudgeSelectedLayers(
            key === "arrowleft" ? -step : key === "arrowright" ? step : 0,
            key === "arrowup" ? -step : key === "arrowdown" ? step : 0
          );
          return;
        }
      }

      if (e.shiftKey && key === "1") {
        zoomToFit();
        return;
      }

      const tool = TOOL_SHORTCUTS[key];
      if (tool && !e.shiftKey) {
        onToolChange(tool);
      }
    }

    function onKeyUp(e: KeyboardEvent) {
      if (e.key === " ") setIsSpacePressed(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [
    deleteLayers,
    history,
    unselectLayers,
    selectAllLayers,
    copySelectedLayers,
    pasteLayers,
    duplicateSelectedLayers,
    nudgeSelectedLayers,
    zoomBy,
    zoomTo,
    zoomToFit,
    onToolChange,
    groupIntoSection,
    ungroupSections,
  ]);

  if (status === "connecting" || status === "reconnecting") {
    return <Loading />;
  }

  const cursor =
    isPanning
      ? "grabbing"
      : isSpacePressed || canvasState.mode === CanvasMode.Hand
        ? "grab"
        : canvasState.mode === CanvasMode.Pencil ||
            canvasState.mode === CanvasMode.Inserting
          ? "crosshair"
          : canvasState.mode === CanvasMode.Eraser
            ? "cell"
            : "default";

  const insertPreview =
    canvasState.mode === CanvasMode.Inserting &&
    canvasState.origin != null &&
    canvasState.current != null
      ? {
          origin: canvasState.origin,
          current: canvasState.current,
          isLine: isLineType(canvasState.layerType),
        }
      : null;

  return (
    <main className="h-full w-full relative bg-[#f8f9fb] touch-none overflow-hidden">
      <Info boardId={boardId} />
      <Participants />
      <Toolbar
        canvasState={canvasState}
        setCanvasState={onToolChange}
        canRedo={canRedo}
        canUndo={canUndo}
        undo={history.undo}
        redo={history.redo}
        color={lastUsedColor}
        setColor={setLastUsedColor}
        onInsertTemplate={insertTemplate}
      />
      <ZoomControls
        zoom={camera.zoom}
        onZoomIn={() => zoomBy(1.2)}
        onZoomOut={() => zoomBy(1 / 1.2)}
        onResetZoom={() => zoomTo(1)}
        onZoomToFit={zoomToFit}
      />

      <SelectionTools
        camera={camera}
        setLastUsedColor={setLastUsedColor}
        onDuplicate={duplicateSelectedLayers}
        onGroup={groupIntoSection}
        onUngroup={ungroupSections}
      />

      <svg
        ref={svgRef}
        className="h-[100vh] w-[100vw] select-none"
        style={{ cursor }}
        onPointerUp={onPointerUp}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        <defs>
          {/* The dot grid follows the camera via patternTransform so it
              covers the whole viewport at any pan/zoom. */}
          <pattern
            id="grid"
            width={GRID_SIZE}
            height={GRID_SIZE}
            patternUnits="userSpaceOnUse"
            patternTransform={`translate(${camera.x} ${camera.y}) scale(${camera.zoom})`}
          >
            <circle
              cx={1}
              cy={1}
              r={1 / Math.max(camera.zoom, 0.5)}
              fill="rgba(0,0,0,0.18)"
            />
          </pattern>
        </defs>
        {camera.zoom >= 0.3 && (
          <rect width="100%" height="100%" fill="url(#grid)" />
        )}
        <g
          style={{
            transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.zoom})`,
            transformOrigin: "0 0",
          }}
        >
          {layerIds?.map((layerId) => (
            <LayerPreview
              key={layerId}
              id={layerId}
              onLayerPointerDown={onLayerPointerDown}
              selectionColor={layerIdsToColorSelection[layerId]}
            />
          ))}
          <SelectionBox onResizeHandlePointerDown={onResizeHandlePointerDown} />
          {canvasState.mode === CanvasMode.SelectionNet &&
            canvasState.current != null && (
              <rect
                className="fill-indigo-500/5 stroke-indigo-500"
                strokeWidth={1 / camera.zoom}
                x={Math.min(canvasState.origin.x, canvasState.current.x)}
                y={Math.min(canvasState.origin.y, canvasState.current.y)}
                width={Math.abs(canvasState.origin.x - canvasState.current.x)}
                height={Math.abs(canvasState.origin.y - canvasState.current.y)}
              />
            )}
          {insertPreview &&
            (insertPreview.isLine ? (
              <line
                className="pointer-events-none"
                x1={insertPreview.origin.x}
                y1={insertPreview.origin.y}
                x2={insertPreview.current.x}
                y2={insertPreview.current.y}
                stroke={colorToCss(lastUsedColor)}
                strokeWidth={3}
                strokeLinecap="round"
                opacity={0.5}
              />
            ) : (
              <rect
                className="pointer-events-none fill-indigo-500/5 stroke-indigo-500"
                strokeWidth={1.5 / camera.zoom}
                strokeDasharray="6 4"
                rx={4}
                x={Math.min(insertPreview.origin.x, insertPreview.current.x)}
                y={Math.min(insertPreview.origin.y, insertPreview.current.y)}
                width={Math.abs(insertPreview.origin.x - insertPreview.current.x)}
                height={Math.abs(
                  insertPreview.origin.y - insertPreview.current.y
                )}
              />
            ))}
          {connectorHoverBounds && (
            <rect
              className="pointer-events-none fill-indigo-500/5 stroke-indigo-500"
              strokeWidth={2 / camera.zoom}
              x={connectorHoverBounds.x - 4}
              y={connectorHoverBounds.y - 4}
              width={connectorHoverBounds.width + 8}
              height={connectorHoverBounds.height + 8}
              rx={8}
            />
          )}
          <CursorsPresence />
          {pencilDraft != null && pencilDraft.length > 0 && (
            <Path
              points={pencilDraft}
              x={0}
              y={0}
              fill={colorToCss(lastUsedColor)}
              isComplete={false}
            />
          )}
        </g>
      </svg>
    </main>
  );
}
