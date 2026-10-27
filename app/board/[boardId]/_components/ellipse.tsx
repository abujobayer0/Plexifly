import React from "react";
import {
  SOFT_SHADOW,
  colorToCss,
  focusLayerLabel,
  shadeColor,
  tintColor,
} from "@/lib/utils";
import { EllipseLayer } from "@/types/canvas";
import { ShapeLabel } from "./shape-label";

interface EllipseProps {
  id: string;
  layer: EllipseLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

export const Ellipse = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: EllipseProps) => {
  const { x, y, width, height, fill, value } = layer;
  const base = fill ?? { r: 30, g: 30, b: 30 };

  // The layer color reads as the outline; the body is a soft tint of it.
  return (
    <g
      onPointerDown={(e) => onPointerDown(e, id)}
      onDoubleClick={() => focusLayerLabel(id)}
    >
      <ellipse
        style={{
          transform: `translate(${x}px, ${y}px)`,
          filter: SOFT_SHADOW,
        }}
        cx={width / 2}
        cy={height / 2}
        rx={Math.max(width / 2 - 1, 0)}
        ry={Math.max(height / 2 - 1, 0)}
        strokeWidth={selectionColor ? 2.5 : 1.75}
        stroke={selectionColor || colorToCss(base)}
        fill={colorToCss(tintColor(base, 0.88))}
      />
      <ShapeLabel
        id={id}
        x={x}
        y={y}
        width={width}
        height={height}
        value={value}
        color={colorToCss(shadeColor(base, 0.35))}
        inset={{ x: width * 0.15, y: height * 0.15 }}
      />
    </g>
  );
};
