"use client";
import { LayerType } from "@/types/canvas";
import { useStorage } from "@liveblocks/react";
import React, { memo } from "react";
import { Rectangle } from "./rectangle";

interface LayerPreviewProps {
  id: string;
  onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
}

export const LayerPreview = memo(
  ({ selectionColor, onLayerPointerDown, id }: LayerPreviewProps) => {
    const layer = useStorage((root) => root.layers.get(id));
    if (!layer) return null;

    switch (layer.type) {
      case LayerType.Rectangle:
        return (
          <Rectangle
            id={id}
            onPointerDown={onLayerPointerDown}
            layer={layer}
            selectionColor="#000"
          />
        );
      case LayerType.Ellipse:
        return <div>Ellipse</div>;
      case LayerType.Note:
        return <div>Note</div>;
      case LayerType.Text:
        return <div>Text</div>;
      case LayerType.Path:
        return <div>Path</div>;

      default: {
        console.warn("Unknown layer type");
        return null;
      }
    }
  }
);
LayerPreview.displayName = "LayerPreview";
