"use client";

import React, { memo } from "react";
import { useSelectionBounds } from "@/hooks/use-selection-bounds";
import { Camera, Color, LayerType } from "@/types/canvas";
import { useMutation, useSelf, useStorage } from "@liveblocks/react";
import { ColorPicker } from "./color-picker";
import { useDeleteLayers } from "@/hooks/use-delete-layers";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import {
  BringToFront,
  Copy,
  Group,
  SendToBack,
  Trash2,
  Ungroup,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { colorToCss } from "@/lib/utils";

interface SelectionToolsProps {
  camera: Camera;
  setLastUsedColor: (color: Color) => void;
  onDuplicate: () => void;
  onGroup: () => void;
  onUngroup: () => void;
}

const buttonClassName =
  "h-8 w-8 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition";

export const SelectionTools = memo(
  ({
    camera,
    setLastUsedColor,
    onDuplicate,
    onGroup,
    onUngroup,
  }: SelectionToolsProps) => {
    const selection = useSelf((me) => me.presence.selection);
    const selectedFill = useStorage((root) =>
      selection?.[0] ? root.layers.get(selection[0])?.fill : undefined
    );

    const bringToFront = useMutation(
      ({ storage }) => {
        const liveLayerIds = storage.get("layerIds");
        const indices: number[] = [];
        const arr = liveLayerIds.toImmutable();
        for (let i = 0; i < arr.length; i++) {
          if (selection?.includes(arr[i])) {
            indices.push(i);
          }
        }

        for (let i = indices.length - 1; i >= 0; i--) {
          liveLayerIds.move(
            indices[i],
            arr.length - 1 - (indices.length - 1 - i)
          );
        }
      },

      [selection]
    );

    const moveToBack = useMutation(
      ({ storage }) => {
        const liveLayerIds = storage.get("layerIds");
        const indices: number[] = [];
        const arr = liveLayerIds.toImmutable();
        for (let i = 0; i < arr.length; i++) {
          if (selection?.includes(arr[i])) {
            indices.push(i);
          }
        }
        for (let i = 0; i < indices.length; i++) {
          liveLayerIds.move(indices[i], i);
        }
      },
      [selection]
    );

    const setFill = useMutation(
      ({ storage }, fill: Color) => {
        const liveLayers = storage.get("layers");
        setLastUsedColor(fill);

        selection?.forEach((id) => {
          liveLayers.get(id)?.set("fill", fill);
        });
      },
      [selection, setLastUsedColor]
    );

    // Row/column count of the selection when it is a single table.
    const tableSize = useStorage((root) => {
      if (selection?.length !== 1) return null;
      const layer = root.layers.get(selection[0]);
      if (layer?.type !== LayerType.Table) return null;
      return { rows: layer.cells.length, cols: layer.cells[0]?.length ?? 0 };
    }, (a, b) => a?.rows === b?.rows && a?.cols === b?.cols);

    const resizeTable = useMutation(
      ({ storage }, rowDelta: number, colDelta: number) => {
        const liveLayer = storage.get("layers").get(selection?.[0] ?? "");
        const layer = liveLayer?.toImmutable();
        if (!liveLayer || layer?.type !== LayerType.Table) return;

        const rows = layer.cells.length;
        const cols = layer.cells[0]?.length ?? 0;
        const nextRows = Math.max(1, rows + rowDelta);
        const nextCols = Math.max(1, cols + colDelta);
        if (nextRows === rows && nextCols === cols) return;

        const cells = Array.from({ length: nextRows }, (_, r) =>
          Array.from({ length: nextCols }, (_, c) => {
            const existing = layer.cells[r]?.[c];
            if (existing !== undefined) return existing;
            return r === 0 ? `Column ${c + 1}` : "";
          })
        );
        // Grow or shrink the table so rows/columns keep their size.
        liveLayer.update({
          cells,
          width: (layer.width / cols) * nextCols,
          height: (layer.height / rows) * nextRows,
        });
      },
      [selection]
    );

    const hasSection = useStorage((root) =>
      (selection ?? []).some(
        (id) => root.layers.get(id)?.type === LayerType.Frame
      )
    );

    const deleteLayers = useDeleteLayers();

    const selectionBounds = useSelectionBounds();
    if (!selectionBounds) {
      return null;
    }

    const x = selectionBounds.width / 2 + selectionBounds.x;
    // Clear the top connect handle (22 units out, 7 radius) plus a margin.
    const y = selectionBounds.y - 30 - 10 / camera.zoom;

    return (
      <div
        className="absolute top-0 left-0 z-10 p-1 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] bg-white/95 backdrop-blur-xl border border-neutral-200/70 flex items-center gap-0.5 select-none"
        // Clamp inside the viewport, clear of the top bar.
        style={{
          transform: `translate(
                clamp(8px, calc(${x * camera.zoom + camera.x}px - 50%), calc(100vw - 100% - 8px)),
                max(64px, calc(${y * camera.zoom + camera.y}px - 100%))
              )`,
        }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <Popover>
          <Hint lablel="Color">
            <PopoverTrigger asChild>
              <Button variant="board" size="icon" className={buttonClassName}>
                <span
                  className="h-5 w-5 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.15)]"
                  style={{
                    background: selectedFill
                      ? colorToCss(selectedFill)
                      : "#000",
                  }}
                />
              </Button>
            </PopoverTrigger>
          </Hint>
          <PopoverContent
            side="top"
            sideOffset={10}
            className="w-auto p-2 rounded-xl border border-neutral-200 shadow-xl"
          >
            <ColorPicker value={selectedFill ?? undefined} onChange={setFill} />
          </PopoverContent>
        </Popover>

        <div className="w-px h-5 bg-neutral-200 mx-1" />

        <Hint lablel="Bring to front">
          <Button
            variant="board"
            onClick={bringToFront}
            size="icon"
            className={buttonClassName}
          >
            <BringToFront className="h-4 w-4" />
          </Button>
        </Hint>
        <Hint lablel="Send to back">
          <Button
            variant="board"
            onClick={moveToBack}
            size="icon"
            className={buttonClassName}
          >
            <SendToBack className="h-4 w-4" />
          </Button>
        </Hint>
        <Hint lablel="Group into section (⌘G)">
          <Button
            variant="board"
            onClick={onGroup}
            size="icon"
            className={buttonClassName}
          >
            <Group className="h-4 w-4" />
          </Button>
        </Hint>
        {hasSection && (
          <Hint lablel="Ungroup section (⌘⇧G)">
            <Button
              variant="board"
              onClick={onUngroup}
              size="icon"
              className={buttonClassName}
            >
              <Ungroup className="h-4 w-4" />
            </Button>
          </Hint>
        )}
        <Hint lablel="Duplicate (⌘D)">
          <Button
            variant="board"
            onClick={onDuplicate}
            size="icon"
            className={buttonClassName}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </Hint>

        {tableSize && (
          <>
            <div className="w-px h-5 bg-neutral-200 mx-1" />
            {[
              { label: "+ Row", hint: "Add row", rows: 1, cols: 0 },
              { label: "− Row", hint: "Remove last row", rows: -1, cols: 0 },
              { label: "+ Col", hint: "Add column", rows: 0, cols: 1 },
              { label: "− Col", hint: "Remove last column", rows: 0, cols: -1 },
            ].map((action) => (
              <Hint key={action.label} lablel={action.hint}>
                <Button
                  variant="board"
                  size="sm"
                  onClick={() => resizeTable(action.rows, action.cols)}
                  disabled={
                    (action.rows < 0 && tableSize.rows <= 1) ||
                    (action.cols < 0 && tableSize.cols <= 1)
                  }
                  className="h-8 px-2 rounded-lg text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                >
                  {action.label}
                </Button>
              </Hint>
            ))}
          </>
        )}

        <div className="w-px h-5 bg-neutral-200 mx-1" />

        <Hint lablel="Delete (Del)">
          <Button
            variant="board"
            size="icon"
            onClick={deleteLayers}
            className="h-8 w-8 rounded-lg text-neutral-600 hover:text-red-600 hover:bg-red-50 transition"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </Hint>
      </div>
    );
  }
);

SelectionTools.displayName = "SelectionTools";
