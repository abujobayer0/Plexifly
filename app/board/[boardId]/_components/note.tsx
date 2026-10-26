import { Inter } from "next/font/google";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { NoteLayer } from "@/types/canvas";
import { cn, colorToCss, tintColor } from "@/lib/utils";
import { useMutation } from "@liveblocks/react";

const font = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
});

const FOLD_SIZE = 22;

const calculateFontSize = (width: number, height: number) => {
  const maxFontSize = 40;
  const scaleFactor = 0.085;
  return Math.max(
    12,
    Math.min(width * scaleFactor, height * scaleFactor, maxFontSize)
  );
};

interface NoteProps {
  id: string;
  layer: NoteLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

export const Note = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: NoteProps) => {
  const { x, y, width, height, fill, value } = layer;

  const updateValue = useMutation(({ storage }, newValue: string) => {
    const liveLayers = storage.get("layers");
    liveLayers.get(id)?.set("value", newValue);
  }, []);

  const handleContentChange = (e: ContentEditableEvent) => {
    updateValue(e.target.value);
  };

  // Notes render as soft pastel paper derived from the chosen color.
  const paper = colorToCss(tintColor(fill, 0.55));
  const fold = colorToCss(tintColor(fill, 0.3));
  const accent = colorToCss(tintColor(fill, 0.2));

  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      onPointerDown={(e) => onPointerDown(e, id)}
      className="overflow-visible"
    >
      <div
        className="relative h-full w-full"
        style={{
          filter:
            "drop-shadow(0 1px 1px rgba(0,0,0,0.05)) drop-shadow(0 8px 16px rgba(0,0,0,0.14))",
        }}
      >
        <div
          className="h-full w-full flex flex-col rounded-md"
          style={{
            background: paper,
            outline: selectionColor ? `2px solid ${selectionColor}` : "none",
            // Cut the bottom-right corner for the folded-paper look.
            clipPath: `polygon(0 0, 100% 0, 100% calc(100% - ${FOLD_SIZE}px), calc(100% - ${FOLD_SIZE}px) 100%, 0 100%)`,
          }}
        >
          <div
            className="h-1.5 w-full shrink-0 rounded-t-md opacity-70"
            style={{ background: accent }}
          />
          <ContentEditable
            html={value || ""}
            onChange={handleContentChange}
            // While editing, let the pointer select text instead of
            // dragging the note.
            onPointerDown={(e: React.PointerEvent) => {
              if (e.currentTarget === document.activeElement) {
                e.stopPropagation();
              }
            }}
            data-placeholder="Type something…"
            className={cn(
              "flex-1 w-full outline-none px-4 py-3 select-text",
              "break-words overflow-hidden leading-snug",
              "empty:before:content-[attr(data-placeholder)] empty:before:text-black/30",
              font.className
            )}
            style={{
              color: "#1f2937",
              fontSize: calculateFontSize(width, height),
              fontWeight: 400,
            }}
          />
        </div>
        <div
          className="absolute bottom-0 right-0 rounded-tl-md"
          style={{
            width: FOLD_SIZE,
            height: FOLD_SIZE,
            background: `linear-gradient(135deg, ${fold} 50%, transparent 50%)`,
          }}
        />
      </div>
    </foreignObject>
  );
};
