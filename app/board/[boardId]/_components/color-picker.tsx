"use client";
import { colorToCss } from "@/lib/utils";
import { Color } from "@/types/canvas";
import React, { useState } from "react";
import { HexColorPicker } from "react-colorful";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  onChange: (color: Color) => void;
}

export const ColorPicker = ({ onChange }: ColorPickerProps) => {
  const [selectedColor, setSelectedColor] = useState<Color>({
    r: 0,
    g: 0,
    b: 0,
  });
  const [colorHistory, setColorHistory] = useState<Color[]>([]);

  const presetColors = [
    { r: 0, g: 0, b: 0 },
    { r: 87, g: 87, b: 87 },
    { r: 243, g: 83, b: 255 },
    { r: 255, g: 0, b: 0 },
    { r: 0, g: 0, b: 255 },
    { r: 255, g: 235, b: 59 },
    { r: 255, g: 152, b: 0 },
    { r: 156, g: 39, b: 176 },
    { r: 0, g: 188, b: 212 },
    { r: 76, g: 175, b: 80 },
  ];

  const handleColorChange = (color: Color) => {
    onChange(color);
    setSelectedColor(color);

    if (
      !colorHistory.some(
        (c) => c.r === color.r && c.g === color.g && c.b === color.b
      )
    ) {
      setColorHistory((prev) => [color, ...prev].slice(0, 5));
    }
  };

  return (
    <div className="flex flex-col gap-3 p-4 ">
      <div className="flex flex-wrap gap-2 items-center">
        {presetColors.map((color, index) => (
          <ColorButton key={index} color={color} onClick={handleColorChange} />
        ))}

        <Popover>
          <PopoverTrigger asChild>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50 transition">
              <span className="text-neutral-500 text-xl">+</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3 rounded-xl border border-neutral-200 shadow-xl">
            <div className="space-y-3">
              <HexColorPicker
                color={`rgb(${selectedColor.r},${selectedColor.g},${selectedColor.b})`}
                onChange={(color) => {
                  const result =
                    /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
                  if (result) {
                    const newColor = {
                      r: parseInt(result[1], 16),
                      g: parseInt(result[2], 16),
                      b: parseInt(result[3], 16),
                    };
                    handleColorChange(newColor);
                  }
                }}
              />
              {colorHistory.length > 0 && (
                <div className="pt-3 border-t border-neutral-200">
                  <p className="text-xs text-neutral-500 mb-2">Recent Colors</p>
                  <div className="flex gap-2">
                    {colorHistory.map((color, index) => (
                      <ColorButton
                        key={`history-${index}`}
                        color={color}
                        onClick={handleColorChange}
                        isSelected={
                          color.r === selectedColor.r &&
                          color.g === selectedColor.g &&
                          color.b === selectedColor.b
                        }
                        size="sm"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
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
  size?: "sm" | "default";
}

const ColorButton = ({
  onClick,
  color,
  size = "default",
}: ColorButtonProps) => {
  const sizeClasses = size === "sm" ? "w-6 h-6" : "w-8 h-8";

  return (
    <button
      className={`relative ${sizeClasses} items-center flex justify-center hover:opacity-75 transition`}
      onClick={() => onClick(color)}
    >
      <div
        className={cn(`${sizeClasses} rounded-lg border border-neutral-200`)}
        style={{
          background: colorToCss(color),
        }}
      />
    </button>
  );
};
