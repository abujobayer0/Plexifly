import React from "react";
import {
  colorToCss,
  focusLayerLabel,
  getContrastingTextColor,
} from "@/lib/utils";
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

  return (
    <g
      onPointerDown={(e) => onPointerDown(e, id)}
      onDoubleClick={() => focusLayerLabel(id)}
    >
      <rect
        className="drop-shadow-md"
        style={{
          transform: `translate(${x}px, ${y}px)`,
        }}
        x={0}
        y={0}
        width={width}
        height={height}
        strokeWidth={1}
        stroke={selectionColor || "transparent"}
        fill={fill ? colorToCss(fill) : "#ccc"}
        rx={8}
        ry={8}
        shapeRendering="geometricPrecision"
      />
      <ShapeLabel
        id={id}
        x={x}
        y={y}
        width={width}
        height={height}
        value={value}
        color={fill ? getContrastingTextColor(fill) : "#000"}
      />
    </g>
  );
};
