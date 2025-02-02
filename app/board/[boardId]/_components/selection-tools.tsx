"use client";

import React, { memo } from "react";
import { useSelectionBounds } from "@/hooks/use-selection-bounds";
import { Camera, Color } from "@/types/canvas";
import { useMutation, useSelf } from "@liveblocks/react";
import { ColorPicker } from "./color-picker";
import { useDeleteLayers } from "@/hooks/use-delete-layers";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { BringToFront, SendToBack, Trash2 } from "lucide-react";

interface SelectionToolsProps {
  camera: Camera;
  setLastUsedColor: (color: Color) => void;
}

export const SelectionTools = memo(
  ({ camera, setLastUsedColor }: SelectionToolsProps) => {
    const selection = useSelf((me) => me.presence.selection);

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

    const deleteLayers = useDeleteLayers();

    const selectionBounds = useSelectionBounds();
    if (!selectionBounds) {
      return null;
    }

    const x = selectionBounds.width / 2 + selectionBounds.x;
    const y = selectionBounds.y - 100;

    return (
      <div
        className="absolute p-2 rounded-lg bg-white shadow-sm border border-neutral-100 flex select-none gap-2"
        style={{
          transform: `translate(
            calc(${x * camera.zoom + camera.x}px - 50%),
            calc(${y * camera.zoom + camera.y}px)
          )`,
        }}
      >
        <ColorPicker onChange={setFill} />

        <div className="flex flex-col gap-1">
          <Hint lablel="Bring to front">
            <Button
              variant="board"
              onClick={bringToFront}
              size="icon"
              className="h-7 w-7 text-neutral-600 hover:text-neutral-800"
            >
              <BringToFront className="h-4 w-4" />
            </Button>
          </Hint>

          <Hint lablel="Bring to back">
            <Button
              variant="board"
              onClick={moveToBack}
              size="icon"
              className="h-7 w-7 text-neutral-600 hover:text-neutral-800"
            >
              <SendToBack className="h-4 w-4" />
            </Button>
          </Hint>
        </div>
        <div className="flex items-center pl-2 border-l border-neutral-100">
          <Hint lablel="Delete">
            <Button
              variant="board"
              size="icon"
              onClick={deleteLayers}
              className="h-7 w-7 text-neutral-600 hover:text-neutral-800 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </Hint>
        </div>
      </div>
    );
  }
);

SelectionTools.displayName = "SelectionTools";
