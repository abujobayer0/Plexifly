import React from "react";
import { SOFT_SHADOW, focusLayerLabel, shapePalette } from "@/lib/utils";
import { RectangleLayer } from "@/types/canvas";
import { ShapeLabel } from "./shape-label";

interface RectangleProps {
  id: string;
  layer: RectangleLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

export const Rectangle = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: RectangleProps) => {
  const { x, y, width, height, fill, value } = layer;
  const palette = shapePalette(fill ?? { r: 204, g: 204, b: 204 });

  return (
    <g
      onPointerDown={(e) => onPointerDown(e, id)}
      onDoubleClick={() => focusLayerLabel(id)}
    >
      <rect
        style={{
          transform: `translate(${x}px, ${y}px)`,
          filter: SOFT_SHADOW,
        }}
        x={0}
        y={0}
        width={width}
        height={height}
        strokeWidth={selectionColor ? 2 : 1.25}
        stroke={selectionColor || palette.stroke}
        fill={palette.fill}
        rx={10}
        ry={10}
        shapeRendering="geometricPrecision"
      />
      <ShapeLabel
        id={id}
        x={x}
        y={y}
        width={width}
        height={height}
        value={value}
        color={palette.text}
      />
    </g>
  );
};
