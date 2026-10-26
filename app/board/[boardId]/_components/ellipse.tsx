import React from "react";
import { colorToCss, focusLayerLabel } from "@/lib/utils";
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
  const color = fill ? colorToCss(fill) : "#000";

  return (
    <g
      onPointerDown={(e) => onPointerDown(e, id)}
      onDoubleClick={() => focusLayerLabel(id)}
    >
      <ellipse
        className="hover:opacity-90"
        style={{
          transform: `translate(${x}px, ${y}px)`,
        }}
        cx={width / 2}
        cy={height / 2}
        rx={width / 2}
        ry={height / 2}
        strokeWidth={3}
        stroke={selectionColor || color}
        fill="transparent"
        strokeLinecap="round"
      />
      <ShapeLabel
        id={id}
        x={x}
        y={y}
        width={width}
        height={height}
        value={value}
        color={color}
        inset={{ x: width * 0.15, y: height * 0.15 }}
      />
    </g>
  );
};
