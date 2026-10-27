"use client";
import React, { memo } from "react";
import { LayerType, Side, XYWH } from "@/types/canvas";
import { useSelf, useStorage } from "@liveblocks/react";
import { useSelectionBounds } from "@/hooks/use-selection-bounds";

interface SelectionBoxProps {
  onResizeHandlePointerDown: (corner: Side, initialBounds: XYWH) => void;
  onConnectStart: (
    layerId: string,
    row: number | undefined,
    e: React.PointerEvent
  ) => void;
  isConnecting: boolean;
}

const CONNECT_HANDLE_RADIUS = 7;
const CONNECT_HANDLE_OFFSET = 22;

// A round "+" handle that starts an arrow when dragged.
const ConnectHandle = ({
  cx,
  cy,
  onPointerDown,
}: {
  cx: number;
  cy: number;
  onPointerDown: (e: React.PointerEvent) => void;
}) => (
  <g
    className="group/connect cursor-crosshair"
    onPointerDown={onPointerDown}
    style={{ transform: `translate(${cx}px, ${cy}px)` }}
  >
    {/* Larger invisible hit area. */}
    <circle r={CONNECT_HANDLE_RADIUS + 6} fill="transparent" />
    <circle
      r={CONNECT_HANDLE_RADIUS}
      className="fill-white stroke-indigo-500 transition-colors group-hover/connect:fill-indigo-500"
      strokeWidth={1.5}
    />
    <path
      d="M-3,0 H3 M0,-3 V3"
      className="stroke-indigo-500 group-hover/connect:stroke-white"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </g>
);

const HANDLE_WIDTH = 8;

export const SelectionBox = memo(
  ({ onResizeHandlePointerDown, onConnectStart, isConnecting }: SelectionBoxProps) => {
    const soleLayerId = useSelf((me) =>
      me.presence.selection.length === 1 ? me.presence.selection[0] : null
    );

    const isShowingHandles = useStorage(
      (root) =>
        soleLayerId && root.layers.get(soleLayerId)?.type !== LayerType.Path
    );

    const bounds = useSelectionBounds();

    // Where arrows can start from the sole selected item: none for lines and
    // strokes, one per row on each side of a table, the four sides otherwise.
    const connectInfo = useStorage((root) => {
      if (!soleLayerId) return null;
      const layer = root.layers.get(soleLayerId);
      if (
        !layer ||
        layer.type === LayerType.Path ||
        layer.type === LayerType.Line ||
        layer.type === LayerType.Arrow
      ) {
        return null;
      }
      return {
        rows: layer.type === LayerType.Table ? layer.cells.length : 0,
      };
    }, (a, b) => a?.rows === b?.rows);

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
        {connectInfo && soleLayerId && !isConnecting && (
          <>
            {(connectInfo.rows > 0
              ? Array.from({ length: connectInfo.rows }, (_, row) => ({
                  row,
                  y: bounds.y + (bounds.height / connectInfo.rows) * (row + 0.5),
                })).flatMap(({ row, y }) => [
                  { row, cx: bounds.x - CONNECT_HANDLE_OFFSET, cy: y },
                  { row, cx: bounds.x + bounds.width + CONNECT_HANDLE_OFFSET, cy: y },
                ])
              : [
                  { row: undefined, cx: bounds.x - CONNECT_HANDLE_OFFSET, cy: bounds.y + bounds.height / 2 },
                  { row: undefined, cx: bounds.x + bounds.width + CONNECT_HANDLE_OFFSET, cy: bounds.y + bounds.height / 2 },
                ]
            )
              .concat([
                { row: undefined, cx: bounds.x + bounds.width / 2, cy: bounds.y - CONNECT_HANDLE_OFFSET },
                { row: undefined, cx: bounds.x + bounds.width / 2, cy: bounds.y + bounds.height + CONNECT_HANDLE_OFFSET },
              ])
              .map(({ row, cx, cy }) => (
                <ConnectHandle
                  key={`${row ?? "side"}-${cx}-${cy}`}
                  cx={cx}
                  cy={cy}
                  onPointerDown={(e) => onConnectStart(soleLayerId, row, e)}
                />
              ))}
          </>
        )}
      </>
    );
  }
);

SelectionBox.displayName = "SelectionBox";
