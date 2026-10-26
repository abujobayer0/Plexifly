"use client";
import React from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { useMutation } from "@liveblocks/react";
import { Inter } from "next/font/google";
import { LayerType, TableLayer } from "@/types/canvas";
import { cn, colorToCss, tintColor } from "@/lib/utils";

const font = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
});

interface TableProps {
  id: string;
  layer: TableLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

export const Table = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: TableProps) => {
  const { x, y, width, height, fill, cells } = layer;
  const rows = cells.length;
  const cols = cells[0]?.length ?? 0;
  const fontSize = Math.max(11, Math.min(16, (height / Math.max(rows, 1)) * 0.38));

  const updateCell = useMutation(
    ({ storage }, row: number, col: number, value: string) => {
      const liveLayer = storage.get("layers").get(id);
      if (!liveLayer) return;
      const current = liveLayer.toImmutable();
      if (current.type !== LayerType.Table) return;
      if (current.cells[row]?.[col] === undefined) return;
      const next = current.cells.map((r) => [...r]);
      next[row][col] = value;
      liveLayer.update({ cells: next });
    },
    [id]
  );

  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      onPointerDown={(e) => onPointerDown(e, id)}
    >
      <div
        className={cn(
          "h-full w-full grid rounded-xl overflow-hidden bg-white",
          "shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_-8px_rgba(0,0,0,0.18)]",
          font.className
        )}
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          outline: `${selectionColor ? 2 : 1}px solid ${selectionColor ?? "rgba(0,0,0,0.1)"}`,
          outlineOffset: -1,
        }}
      >
        {cells.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isHeader = rowIndex === 0;
            return (
              <ContentEditable
                key={`${rowIndex}-${colIndex}`}
                html={cell}
                onChange={(e: ContentEditableEvent) =>
                  updateCell(rowIndex, colIndex, e.target.value)
                }
                // While a cell is being edited, let the pointer select text
                // instead of dragging the whole table.
                onPointerDown={(e: React.PointerEvent) => {
                  if (e.currentTarget === document.activeElement) {
                    e.stopPropagation();
                  }
                }}
                className={cn(
                  "px-2.5 flex items-center outline-none select-text overflow-hidden break-words leading-tight",
                  "focus:bg-indigo-50/60",
                  colIndex < cols - 1 && "border-r border-black/[0.08]",
                  rowIndex < rows - 1 && "border-b border-black/[0.08]"
                )}
                style={{
                  fontSize,
                  fontWeight: isHeader ? 600 : 400,
                  color: isHeader ? "#111827" : "#374151",
                  background: isHeader
                    ? colorToCss(tintColor(fill, 0.82))
                    : undefined,
                }}
              />
            );
          })
        )}
      </div>
    </foreignObject>
  );
};
