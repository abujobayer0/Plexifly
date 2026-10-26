import React from "react";
import { colorToCss } from "@/lib/utils";
import { LayerType, LineLayer } from "@/types/canvas";

interface LineProps {
  id: string;
  layer: LineLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

const STROKE_WIDTH = 3;
const HEAD_LENGTH = 16;

export const Line = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: LineProps) => {
  const { x, y, width, height, fill, flipX, flipY, type } = layer;

  const x1 = flipX ? width : 0;
  const y1 = flipY ? height : 0;
  const x2 = flipX ? 0 : width;
  const y2 = flipY ? 0 : height;

  const color = fill ? colorToCss(fill) : "#000";
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const head = (offset: number) =>
    `${x2 - HEAD_LENGTH * Math.cos(angle + offset)},${y2 - HEAD_LENGTH * Math.sin(angle + offset)}`;

  return (
    <g
      onPointerDown={(e) => onPointerDown(e, id)}
      style={{ transform: `translate(${x}px, ${y}px)` }}
    >
      {/* Wide invisible stroke so thin lines are easy to grab. */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="transparent"
        strokeWidth={16}
        strokeLinecap="round"
      />
      {selectionColor && (
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={selectionColor}
          strokeWidth={STROKE_WIDTH + 4}
          strokeLinecap="round"
          opacity={0.4}
        />
      )}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
      />
      {type === LayerType.Arrow && (
        <polyline
          points={`${head(-Math.PI / 6)} ${x2},${y2} ${head(Math.PI / 6)}`}
          fill="none"
          stroke={color}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </g>
  );
};
