"use client";

import { LayerType } from "@/types/canvas";
import { useStorage } from "@liveblocks/react";
import React, { memo } from "react";
import { Rectangle } from "./rectangle";
import { Ellipse } from "./ellipse";
import { Text } from "./text";
import { Note } from "./note";
import Path from "./path";
import { PolygonShape } from "./polygon-shape";
import { Table } from "./table";
import { Frame } from "./frame";
import { Line } from "./line";
import { colorToCss } from "@/lib/utils";

interface LayerPreviewProps {
  id: string;
  onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
}

export const LayerPreview = memo(
  ({ selectionColor, onLayerPointerDown, id }: LayerPreviewProps) => {
    const layer = useStorage((root) => root.layers.get(id));
    if (!layer) return null;

    // data-layer-id lets the eraser find layers under the pointer.
    return <g data-layer-id={id}>{renderLayer()}</g>;

    function renderLayer() {
      if (!layer) return null;
      switch (layer.type) {
        case LayerType.Rectangle:
          return (
            <Rectangle
              id={id}
              onPointerDown={onLayerPointerDown}
              layer={layer}
              selectionColor={selectionColor}
            />
          );
        case LayerType.Ellipse:
          return (
            <Ellipse
              id={id}
              onPointerDown={onLayerPointerDown}
              layer={layer}
              selectionColor={selectionColor}
            />
          );
        case LayerType.Note:
          return (
            <Note
              id={id}
              onPointerDown={onLayerPointerDown}
              layer={layer}
              selectionColor={selectionColor}
            />
          );
        case LayerType.Text:
          return (
            <Text
              id={id}
              onPointerDown={onLayerPointerDown}
              layer={layer}
              selectionColor={selectionColor}
            />
          );
        case LayerType.Diamond:
        case LayerType.Triangle:
        case LayerType.Hexagon:
        case LayerType.Parallelogram:
        case LayerType.Cylinder:
          return (
            <PolygonShape
              id={id}
              onPointerDown={onLayerPointerDown}
              layer={layer}
              selectionColor={selectionColor}
            />
          );
        case LayerType.Table:
          return (
            <Table
              id={id}
              onPointerDown={onLayerPointerDown}
              layer={layer}
              selectionColor={selectionColor}
            />
          );
        case LayerType.Frame:
          return (
            <Frame
              id={id}
              onPointerDown={onLayerPointerDown}
              layer={layer}
              selectionColor={selectionColor}
            />
          );
        case LayerType.Line:
        case LayerType.Arrow:
          return (
            <Line
              id={id}
              onPointerDown={onLayerPointerDown}
              layer={layer}
              selectionColor={selectionColor}
            />
          );
        case LayerType.Path:
          return (
            <Path
              key={id}
              onPointerDown={(e) => onLayerPointerDown(e, id)}
              points={layer.points}
              stroke={selectionColor}
              x={layer.x}
              y={layer.y}
              fill={layer.fill ? colorToCss(layer.fill) : "#000"}
            />
          );

        default: {
          console.warn("Unknown layer type");
          return null;
        }
      }
    }
  }
);
LayerPreview.displayName = "LayerPreview";
