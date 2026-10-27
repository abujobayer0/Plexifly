"use client";
import React, { useState } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { useMutation } from "@liveblocks/react";
import { Inter } from "next/font/google";
import { GripHorizontal } from "lucide-react";
import { FrameLayer } from "@/types/canvas";
import {
  cn,
  colorToCss,
  focusLayerLabel,
  shadeColor,
  tintColor,
} from "@/lib/utils";

const font = Inter({
  subsets: ["latin"],
  weight: ["600"],
});

export const FRAME_HEADER_HEIGHT = 44;
const RADIUS = 14;

interface FrameProps {
  id: string;
  layer: FrameLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

// A titled section. Its body ignores the pointer so you can draw and
// box-select inside it; drag it by its header bar or border.
export const Frame = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: FrameProps) => {
  const { x, y, width, height, fill, value } = layer;
  // The title only takes the pointer while editing (after double-click),
  // so dragging the header never puts it in edit mode.
  const [isEditing, setIsEditing] = useState(false);

  const updateTitle = useMutation(({ storage }, newValue: string) => {
    storage.get("layers").get(id)?.set("value", newValue);
  }, []);

  const border = selectionColor ?? colorToCss(tintColor(fill, 0.62));
  const titleColor = colorToCss(shadeColor(fill, 0.45));
  const headerHeight = Math.min(FRAME_HEADER_HEIGHT, height);

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={RADIUS}
        fill={colorToCss(tintColor(fill, 0.965))}
        stroke={border}
        strokeWidth={selectionColor ? 2 : 1}
        pointerEvents="none"
      />
      {/* Wide invisible border to grab the frame by its edge. */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={RADIUS}
        fill="none"
        stroke="transparent"
        strokeWidth={14}
        pointerEvents="stroke"
        onPointerDown={(e) => onPointerDown(e, id)}
      />
      <foreignObject
        x={x}
        y={y}
        width={width}
        height={headerHeight}
        onPointerDown={(e) => onPointerDown(e, id)}
        onDoubleClick={() => focusLayerLabel(id)}
      >
        <div
          className={cn(
            "group/header h-full w-full flex items-center gap-2 pl-3.5 pr-3 cursor-grab active:cursor-grabbing",
            font.className
          )}
        >
          <span
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md"
            style={{ background: colorToCss(tintColor(fill, 0.78)) }}
          >
            <span
              className="h-2 w-2 rounded-[3px]"
              style={{ background: colorToCss(fill) }}
            />
          </span>
          <ContentEditable
            data-label-for={id}
            html={value || "Section"}
            onChange={(e: ContentEditableEvent) => updateTitle(e.target.value)}
            onFocus={() => setIsEditing(true)}
            onBlur={() => setIsEditing(false)}
            onPointerDown={(e: React.PointerEvent) => {
              if (isEditing) e.stopPropagation();
            }}
            className={cn(
              "min-w-0 flex-1 truncate text-sm font-semibold tracking-tight outline-none select-text rounded-md px-1 -mx-1",
              "focus:cursor-text focus:bg-white/70 focus:ring-2 focus:ring-indigo-400"
            )}
            style={{
              color: titleColor,
              pointerEvents: isEditing ? "auto" : "none",
            }}
          />
          <GripHorizontal
            className="h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover/header:opacity-50"
            style={{ color: titleColor }}
          />
        </div>
      </foreignObject>
    </g>
  );
};
