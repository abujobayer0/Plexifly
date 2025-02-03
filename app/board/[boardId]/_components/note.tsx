import { Inter } from "next/font/google";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { NoteLayer } from "@/types/canvas";
import { cn, colorToCss, getContrastingTextColor } from "@/lib/utils";
import { useMutation } from "@liveblocks/react";

const font = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
});

const calculateFontSize = (width: number, height: number) => {
  const maxFontSize = 72;
  const scaleFactor = 0.12;
  const fontSizeBasedOnHeight = height * scaleFactor;
  const fontSizeBasedOnWidth = width * scaleFactor;

  return Math.min(fontSizeBasedOnHeight, fontSizeBasedOnWidth, maxFontSize);
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

  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      onPointerDown={(e) => onPointerDown(e, id)}
      style={{
        outline: selectionColor ? `2px solid ${selectionColor}` : "none",
        backgroundColor: "transparent",
      }}
      className="group"
    >
      <div
        className={cn(
          "w-full h-full rounded-xl overflow-hidden flex flex-col",
          "shadow-lg",
          "transition-all duration-300",
          "backdrop-blur-sm",
          "relative"
        )}
        style={{
          backgroundColor: fill
            ? `${colorToCss(fill)}95`
            : "rgba(255, 255, 255, 0.95)",
          border: `1px solid ${fill ? `${colorToCss(fill)}` : "rgba(0,0,0,0.12)"}`,
        }}
      >
        {/* Note Header */}
        <div
          className="px-3 py-2 flex items-center gap-2"
          style={{
            borderBottom: `1px solid ${fill ? `${colorToCss(fill)}` : "rgba(0,0,0,0.12)"}`,
            backgroundColor: fill
              ? `${colorToCss(fill)}90`
              : "rgba(255,255,255,0.9)",
          }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: fill ? colorToCss(fill) : "#4a4a4a",
              border: `1px solid ${fill ? getContrastingTextColor(fill) : "rgba(0,0,0,0.2)"}`,
            }}
          />
          <span
            className={cn("text-xs font-medium tracking-tight", font.className)}
            style={{
              color: fill ? getContrastingTextColor(fill) : "rgba(0,0,0,0.8)",
            }}
          >
            Note
          </span>
        </div>

        {/* Note Content */}
        <ContentEditable
          html={value || "Type your note..."}
          onChange={handleContentChange}
          className={cn(
            "flex-1 w-full outline-none px-4 py-3",
            "break-words overflow-auto",
            "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent",
            font.className,
            "relative z-10"
          )}
          style={{
            color: fill ? getContrastingTextColor(fill) : "rgba(0,0,0,0.9)",
            fontSize: calculateFontSize(width, height) * 0.75,
            fontWeight: 400,
            letterSpacing: "-0.01em",
          }}
        />

        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background: `
              linear-gradient(
                135deg,
                ${fill ? `${colorToCss(fill)}` : "rgba(255,255,255,0.8)"} 0%,
                transparent 100%
              )
            `,
          }}
        />
      </div>
    </foreignObject>
  );
};
