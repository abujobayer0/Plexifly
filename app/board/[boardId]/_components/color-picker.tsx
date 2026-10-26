"use client";
import { colorToCss } from "@/lib/utils";
import { Color } from "@/types/canvas";
import React, { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Plus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  onChange: (color: Color) => void;
  // Highlights the matching swatch when provided.
  value?: Color;
}

const PRESET_COLORS: Color[] = [
  { r: 30, g: 30, b: 30 },
  { r: 115, g: 115, b: 115 },
  { r: 239, g: 68, b: 68 },
  { r: 249, g: 115, b: 22 },
  { r: 250, g: 204, b: 21 },
  { r: 34, g: 197, b: 94 },
  { r: 20, g: 184, b: 166 },
  { r: 59, g: 130, b: 246 },
  { r: 99, g: 102, b: 241 },
  { r: 168, g: 85, b: 247 },
  { r: 236, g: 72, b: 153 },
  { r: 255, g: 255, b: 255 },
];

const isSameColor = (a?: Color, b?: Color) =>
  a != null && b != null && a.r === b.r && a.g === b.g && a.b === b.b;

export const ColorPicker = ({ onChange, value }: ColorPickerProps) => {
  const [customColor, setCustomColor] = useState<Color>(
    value ?? { r: 0, g: 0, b: 0 }
  );
  const [colorHistory, setColorHistory] = useState<Color[]>([]);

  const handleColorChange = (color: Color) => {
    onChange(color);
    setCustomColor(color);
  };

  const rememberColor = (color: Color) => {
    if (
      !PRESET_COLORS.some((c) => isSameColor(c, color)) &&
      !colorHistory.some((c) => isSameColor(c, color))
    ) {
      setColorHistory((prev) => [color, ...prev].slice(0, 6));
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-6 gap-1.5">
        {PRESET_COLORS.map((color, index) => (
          <ColorButton
            key={index}
            color={color}
            onClick={handleColorChange}
            isSelected={isSameColor(color, value)}
          />
        ))}
      </div>
      <div className="flex items-center gap-1.5">
        {colorHistory.map((color, index) => (
          <ColorButton
            key={`history-${index}`}
            color={color}
            onClick={handleColorChange}
            isSelected={isSameColor(color, value)}
          />
        ))}
        <Popover onOpenChange={(open) => !open && rememberColor(customColor)}>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label="Custom color"
              className="h-6 w-6 flex items-center justify-center rounded-full border border-dashed border-neutral-300 text-neutral-500 hover:border-neutral-400 hover:text-neutral-700 transition"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3 rounded-xl border border-neutral-200 shadow-xl">
            <HexColorPicker
              color={colorToCss(customColor)}
              onChange={(color) => {
                const result =
                  /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
                if (result) {
                  handleColorChange({
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16),
                  });
                }
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

interface ColorButtonProps {
  onClick: (color: Color) => void;
  color: Color;
  isSelected?: boolean;
}

const ColorButton = ({ onClick, color, isSelected }: ColorButtonProps) => {
  return (
    <button
      type="button"
      aria-label={colorToCss(color)}
      className={cn(
        "h-6 w-6 rounded-full transition-transform hover:scale-110",
        "shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)]",
        isSelected && "ring-2 ring-indigo-500 ring-offset-2"
      )}
      style={{ background: colorToCss(color) }}
      onClick={() => onClick(color)}
    />
  );
};
