"use client";
import React from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { useMutation } from "@liveblocks/react";
import { Inter } from "next/font/google";
import { LayerType, TableLayer } from "@/types/canvas";
import {
  SOFT_SHADOW,
  cn,
  colorToCss,
  shadeColor,
  tintColor,
} from "@/lib/utils";

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

  // Size columns by their longest text (dampened so short columns still
  // get room), instead of splitting the width equally.
  const columnWeights = Array.from({ length: cols }, (_, c) => {
    const longest = Math.max(
      ...cells.map((row) => (row[c] ?? "").replace(/<[^>]*>/g, "").length)
    );
    return Math.pow(Math.min(Math.max(longest, 4), 48), 0.85);
  });
  // Font follows row height, and also the narrowest column's width so
  // short headers like "Column 2" don't wrap in narrow tables.
  const totalWeight = columnWeights.reduce((sum, w) => sum + w, 0) || 1;
  const narrowest = (Math.min(...columnWeights) / totalWeight) * width;
  const fontSize = Math.max(
    10,
    Math.min(16, (height / Math.max(rows, 1)) * 0.38, narrowest * 0.15)
  );

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
          font.className
        )}
        style={{
          gridTemplateColumns: columnWeights
            .map((weight) => `minmax(0, ${weight.toFixed(2)}fr)`)
            .join(" "),
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          outline: `${selectionColor ? 2 : 1}px solid ${selectionColor ?? colorToCss(tintColor(fill, 0.55))}`,
          outlineOffset: -1,
          filter: SOFT_SHADOW,
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
                  colIndex < cols - 1 && "border-r",
                  rowIndex < rows - 1 && "border-b"
                )}
                style={{
                  fontSize: isHeader ? fontSize : fontSize * 0.95,
                  fontWeight: isHeader ? 600 : colIndex === 0 ? 500 : 400,
                  color: isHeader
                    ? colorToCss(shadeColor(fill, 0.55))
                    : colIndex === 0
                      ? "#1f2937"
                      : "#6b7280",
                  background: isHeader
                    ? colorToCss(tintColor(fill, 0.86))
                    : undefined,
                  borderColor: isHeader
                    ? colorToCss(tintColor(fill, 0.7))
                    : "rgba(15,23,42,0.06)",
                }}
              />
            );
          })
        )}
      </div>
    </foreignObject>
  );
};
