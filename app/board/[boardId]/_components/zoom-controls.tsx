"use client";
import React from "react";
import { Maximize, Minus, Plus } from "lucide-react";
import { ToolButton } from "./tool-button";

interface ZoomControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onZoomToFit: () => void;
}

export const ZoomControls = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onZoomToFit,
}: ZoomControlsProps) => {
  return (
    <div className="absolute top-[68px] right-2 min-[1080px]:top-auto min-[1080px]:bottom-4 min-[1080px]:right-4 z-10 bg-white/90 backdrop-blur-xl rounded-2xl p-1.5 flex items-center gap-0.5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-neutral-200/70">
      <ToolButton label="Zoom out" icon={Minus} shortcut="⌘−" onClick={onZoomOut} />
      <button
        type="button"
        onClick={onResetZoom}
        title="Reset zoom (⌘0)"
        className="h-9 min-w-[52px] px-1.5 rounded-lg text-xs font-medium tabular-nums text-neutral-700 hover:bg-neutral-100 transition-colors"
      >
        {Math.round(zoom * 100)}%
      </button>
      <ToolButton label="Zoom in" icon={Plus} shortcut="⌘+" onClick={onZoomIn} />
      <div className="w-px h-6 bg-neutral-200 mx-1" />
      <ToolButton
        label="Zoom to fit"
        icon={Maximize}
        shortcut="⇧1"
        onClick={onZoomToFit}
      />
    </div>
  );
};
