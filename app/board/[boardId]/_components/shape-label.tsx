"use client";
import React, { useState } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { useMutation } from "@liveblocks/react";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

interface ShapeLabelProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  value?: string;
  color: string;
  // Inset from the shape's edges, e.g. to stay inside a diamond.
  inset?: { x: number; y: number };
  placeholder?: string;
}

// Text inside a shape. It ignores the pointer (so clicks select and drag
// the shape) until it's focused by double-clicking the shape.
export const ShapeLabel = ({
  id,
  x,
  y,
  width,
  height,
  value,
  color,
  inset = { x: 0, y: 0 },
  placeholder = "Label",
}: ShapeLabelProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const updateValue = useMutation(({ storage }, newValue: string) => {
    storage.get("layers").get(id)?.set("value", newValue);
  }, []);

  // Size from the inner text area so labels look consistent across shapes.
  const innerSize = Math.min(width - inset.x * 2, height - inset.y * 2);
  const fontSize = Math.max(13, Math.min(28, innerSize * 0.2));

  return (
    <foreignObject
      x={x + inset.x}
      y={y + inset.y}
      width={Math.max(width - inset.x * 2, 0)}
      height={Math.max(height - inset.y * 2, 0)}
      style={{ pointerEvents: isEditing ? "auto" : "none" }}
      onPointerDown={(e) => isEditing && e.stopPropagation()}
    >
      <ContentEditable
        data-label-for={id}
        html={value || ""}
        onChange={(e: ContentEditableEvent) => updateValue(e.target.value)}
        onFocus={() => setIsEditing(true)}
        onBlur={() => setIsEditing(false)}
        className={cn(
          "h-full w-full flex items-center justify-center text-center outline-none select-text",
          "break-words leading-tight px-2 overflow-hidden",
          isEditing &&
            "empty:before:content-[attr(data-placeholder)] empty:before:opacity-40",
          font.className
        )}
        style={{ color, fontSize, fontWeight: 500 }}
        data-placeholder={placeholder}
      />
    </foreignObject>
  );
};
