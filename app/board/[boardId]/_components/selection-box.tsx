"use client";
import React, { memo } from "react";
import { LayerType, Side, XYWH } from "@/types/canvas";
import { useSelf, useStorage } from "@liveblocks/react";
import { useSelectionBounds } from "@/hooks/use-selection-bounds";

interface SelectionBoxProps {
  onResizeHandlePointerDown: (corner: Side, initialBounds: XYWH) => void;
}

const HANDLE_WIDTH = 8;

export const SelectionBox = memo(
  ({ onResizeHandlePointerDown }: SelectionBoxProps) => {
    const soleLayerId = useSelf((me) =>
      me.presence.selection.length === 1 ? me.presence.selection[0] : null
    );

    const isShowingHandles = useStorage(
      (root) =>
        soleLayerId && root.layers.get(soleLayerId)?.type !== LayerType.Path
    );

    const bounds = useSelectionBounds();

    if (!bounds) {
      return null;
    }

    const handleStyles = {
      width: `${HANDLE_WIDTH}px`,
      height: `${HANDLE_WIDTH}px`,
      borderRadius: "2px",
      transition: "background-color 0.2s",
    };

    return (
      <>
        <rect
          className="fill-transparent stroke-indigo-500 stroke-[1.5] pointer-events-none"
          style={{
            transform: `translate(${bounds.x}px, ${bounds.y}px)`,
            strokeDasharray: "4 4",
            opacity: 0.8,
          }}
          x={0}
          y={0}
          width={bounds.width}
          height={bounds.height}
        />
        {isShowingHandles && (
          <>
            <rect
              className="fill-white stroke-1 stroke-indigo-500 shadow-sm"
              x={0}
              y={0}
              style={{
                ...handleStyles,
                cursor: "nw-resize",
                transform: `translate(
                ${bounds.x - HANDLE_WIDTH / 2}px, 
                ${bounds.y - HANDLE_WIDTH / 2}px)`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizeHandlePointerDown(Side.Top + Side.Left, bounds);
              }}
              onPointerOver={(e) => {
                e.currentTarget.classList.add("fill-indigo-100");
              }}
              onPointerOut={(e) => {
                e.currentTarget.classList.remove("fill-indigo-100");
              }}
            />
            <rect
              className="fill-white stroke-1 stroke-indigo-500 shadow-sm"
              x={0}
              y={0}
              style={{
                ...handleStyles,
                cursor: "ns-resize",
                transform: `translate(
                ${bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2}px, 
                ${bounds.y - HANDLE_WIDTH / 2}px)`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizeHandlePointerDown(Side.Top, bounds);
              }}
              onPointerOver={(e) => {
                e.currentTarget.classList.add("fill-indigo-100");
              }}
              onPointerOut={(e) => {
                e.currentTarget.classList.remove("fill-indigo-100");
              }}
            />
            <rect
              className="fill-white stroke-1 stroke-indigo-500 shadow-sm"
              x={0}
              y={0}
              style={{
                ...handleStyles,
                cursor: "nesw-resize",
                transform: `translate(
                ${bounds.x - HANDLE_WIDTH / 2 + bounds.width}px, 
                ${bounds.y - HANDLE_WIDTH / 2}px)`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizeHandlePointerDown(Side.Top + Side.Right, bounds);
              }}
              onPointerOver={(e) => {
                e.currentTarget.classList.add("fill-indigo-100");
              }}
              onPointerOut={(e) => {
                e.currentTarget.classList.remove("fill-indigo-100");
              }}
            />
            <rect
              className="fill-white stroke-1 stroke-indigo-500 shadow-sm"
              x={0}
              y={0}
              style={{
                ...handleStyles,
                cursor: "ew-resize",
                transform: `translate(
                ${bounds.x - HANDLE_WIDTH / 2 + bounds.width}px, 
                ${bounds.y + bounds.height / 2 - HANDLE_WIDTH / 2}px)`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizeHandlePointerDown(Side.Right, bounds);
              }}
              onPointerOver={(e) => {
                e.currentTarget.classList.add("fill-indigo-100");
              }}
              onPointerOut={(e) => {
                e.currentTarget.classList.remove("fill-indigo-100");
              }}
            />
            <rect
              className="fill-white stroke-1 stroke-indigo-500 shadow-sm"
              x={0}
              y={0}
              style={{
                ...handleStyles,
                cursor: "nwse-resize",
                transform: `translate(
                ${bounds.x - HANDLE_WIDTH / 2 + bounds.width}px, 
                ${bounds.y - HANDLE_WIDTH / 2 + bounds.height}px)`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizeHandlePointerDown(Side.Bottom + Side.Right, bounds);
              }}
              onPointerOver={(e) => {
                e.currentTarget.classList.add("fill-indigo-100");
              }}
              onPointerOut={(e) => {
                e.currentTarget.classList.remove("fill-indigo-100");
              }}
            />
            <rect
              className="fill-white stroke-1 stroke-indigo-500 shadow-sm"
              x={0}
              y={0}
              style={{
                ...handleStyles,
                cursor: "ns-resize",
                transform: `translate(
                ${bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2}px, 
                ${bounds.y - HANDLE_WIDTH / 2 + bounds.height}px)`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizeHandlePointerDown(Side.Bottom, bounds);
              }}
              onPointerOver={(e) => {
                e.currentTarget.classList.add("fill-indigo-100");
              }}
              onPointerOut={(e) => {
                e.currentTarget.classList.remove("fill-indigo-100");
              }}
            />
            <rect
              className="fill-white stroke-1 stroke-indigo-500 shadow-sm"
              x={0}
              y={0}
              style={{
                ...handleStyles,
                cursor: "nesw-resize",
                transform: `translate(
                ${bounds.x - HANDLE_WIDTH / 2}px, 
                ${bounds.y - HANDLE_WIDTH / 2 + bounds.height}px)`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizeHandlePointerDown(Side.Bottom + Side.Left, bounds);
              }}
              onPointerOver={(e) => {
                e.currentTarget.classList.add("fill-indigo-100");
              }}
              onPointerOut={(e) => {
                e.currentTarget.classList.remove("fill-indigo-100");
              }}
            />
            <rect
              className="fill-white stroke-1 stroke-indigo-500 shadow-sm"
              x={0}
              y={0}
              style={{
                ...handleStyles,
                cursor: "ew-resize",
                transform: `translate(
                ${bounds.x - HANDLE_WIDTH / 2}px, 
                ${bounds.y - HANDLE_WIDTH / 2 + bounds.height / 2}px)`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizeHandlePointerDown(Side.Left, bounds);
              }}
              onPointerOver={(e) => {
                e.currentTarget.classList.add("fill-indigo-100");
              }}
              onPointerOut={(e) => {
                e.currentTarget.classList.remove("fill-indigo-100");
              }}
            />
          </>
        )}
      </>
    );
  }
);

SelectionBox.displayName = "SelectionBox";
