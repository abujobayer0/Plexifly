import React from "react";
import getStroke from "perfect-freehand";
import { getSvgPathFromStroke } from "@/lib/utils";

interface PathProps {
  x: number;
  y: number;

  points: number[][];
  onPointerDown?: (e: React.PointerEvent) => void;
  fill?: string;
  stroke?: string;
}
export default function Path({
  x,
  y,

  points,
  onPointerDown,
  fill,
  stroke,
}: PathProps) {
  return (
    <path
      className="drop-shadow-lg hover:opacity-90 transition-opacity"
      onPointerDown={onPointerDown}
      d={getSvgPathFromStroke(
        getStroke(points, {
          size: 12,
          thinning: 0.4,
          smoothing: 0.7,
          streamline: 0.6,
          easing: (t) => t * t,
          simulatePressure: true,
        })
      )}
      style={{
        transform: `translate(${x}px,${y}px)`,
        mixBlendMode: "multiply",
      }}
      x={0}
      y={0}
      fill={fill}
      stroke={stroke}
      strokeWidth={1.5}
    />
  );
}
