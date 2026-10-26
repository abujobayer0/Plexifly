import React from "react";
import { ImageLayer } from "@/types/canvas";

interface ImageProps {
  id: string;
  layer: ImageLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

export const BoardImage = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: ImageProps) => {
  const { x, y, width, height, src } = layer;

  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      onPointerDown={(e) => onPointerDown(e, id)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- user-uploaded, arbitrary size, rendered inside SVG */}
      <img
        src={src}
        alt=""
        draggable={false}
        className="h-full w-full object-cover rounded-xl select-none bg-neutral-100 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_-8px_rgba(0,0,0,0.2)]"
        style={{
          outline: selectionColor ? `2px solid ${selectionColor}` : "none",
        }}
      />
    </foreignObject>
  );
};
