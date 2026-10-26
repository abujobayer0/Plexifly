import React from "react";
import {
  colorToCss,
  focusLayerLabel,
  getContrastingTextColor,
} from "@/lib/utils";
import { LayerType, PolygonLayer } from "@/types/canvas";
import { ShapeLabel } from "./shape-label";

interface PolygonShapeProps {
  id: string;
  layer: PolygonLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

// Outline points for each polygon type, scaled to the layer's box.
function getPoints(type: PolygonLayer["type"], w: number, h: number) {
  switch (type) {
    case LayerType.Triangle:
      return [[w / 2, 0], [w, h], [0, h]];
    case LayerType.Hexagon:
      return [
        [w * 0.25, 0],
        [w * 0.75, 0],
        [w, h / 2],
        [w * 0.75, h],
        [w * 0.25, h],
        [0, h / 2],
      ];
    case LayerType.Parallelogram:
      return [[w * 0.2, 0], [w, 0], [w * 0.8, h], [0, h]];
    case LayerType.Diamond:
    default:
      return [[w / 2, 0], [w, h / 2], [w / 2, h], [0, h / 2]];
  }
}

// How far the label stays inside the box so text fits the visible shape.
const LABEL_INSETS: Record<PolygonLayer["type"], { x: number; y: number }> = {
  [LayerType.Diamond]: { x: 0.22, y: 0.22 },
  [LayerType.Triangle]: { x: 0.22, y: 0.35 },
  [LayerType.Hexagon]: { x: 0.18, y: 0.08 },
  [LayerType.Parallelogram]: { x: 0.2, y: 0.05 },
  [LayerType.Cylinder]: { x: 0.05, y: 0.2 },
};

export const PolygonShape = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: PolygonShapeProps) => {
  const { x, y, width, height, fill, type, value } = layer;
  const color = fill ? colorToCss(fill) : "#ccc";
  const stroke = selectionColor || "transparent";
  const inset = LABEL_INSETS[type];

  let shape: React.ReactNode;
  if (type === LayerType.Cylinder) {
    const ry = Math.min(height * 0.15, 24);
    shape = (
      <>
        <path
          d={`M0,${ry} A${width / 2},${ry} 0 0 1 ${width},${ry} L${width},${height - ry} A${width / 2},${ry} 0 0 1 0,${height - ry} Z`}
          fill={color}
          stroke={stroke}
          strokeWidth={1}
        />
        <ellipse
          cx={width / 2}
          cy={ry}
          rx={width / 2}
          ry={ry}
          fill={color}
          stroke="rgba(0,0,0,0.2)"
          strokeWidth={1.5}
        />
      </>
    );
  } else {
    shape = (
      <polygon
        points={getPoints(type, width, height)
          .map(([px, py]) => `${px},${py}`)
          .join(" ")}
        fill={color}
        stroke={stroke}
        strokeWidth={1}
        strokeLinejoin="round"
      />
    );
  }

  return (
    <g
      onPointerDown={(e) => onPointerDown(e, id)}
      onDoubleClick={() => focusLayerLabel(id)}
    >
      <g
        className="drop-shadow-md"
        style={{ transform: `translate(${x}px, ${y}px)` }}
      >
        {shape}
      </g>
      <ShapeLabel
        id={id}
        x={x}
        y={y}
        width={width}
        height={height}
        value={value}
        color={fill ? getContrastingTextColor(fill) : "#000"}
        inset={{ x: width * inset.x, y: height * inset.y }}
      />
    </g>
  );
};
