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
    const y = selectionBounds.y - 10;

    return (
      <div
        className="w-fit px-1.5 py-2 bottom-2 rounded-xl shadow-lg backdrop-blur-[12px] bg-white/70 border border-white/20  flex justify-center items-center h-12 select-none gap-3"
        style={{
          transform: `translate(
                calc(${x * camera.zoom + camera.x}px - 50%),
                calc(${y * camera.zoom + camera.y}px)
              )`,
        }}
      >
        <ColorPicker onChange={setFill} />

        <div className="flex gap-1.5">
          <Hint lablel="Bring to front">
            <Button
              variant="board"
              onClick={bringToFront}
              size="icon"
              className="h-8 w-8 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 transition"
            >
              <BringToFront className="h-4 w-4" />
            </Button>
          </Hint>

          <Hint lablel="Send to back">
            <Button
              variant="board"
              onClick={moveToBack}
              size="icon"
              className="h-8 w-8 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 transition"
            >
              <SendToBack className="h-4 w-4" />
            </Button>
          </Hint>
        </div>

        <div className="flex items-center pl-3 border-l border-neutral-200">
          <Hint lablel="Delete">
            <Button
              variant="board"
              size="icon"
              onClick={deleteLayers}
              className="h-8 w-8 text-neutral-600 hover:text-neutral-800 hover:bg-red-50 transition"
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
