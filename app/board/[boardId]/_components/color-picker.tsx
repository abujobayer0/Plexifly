"use client";
import { colorToCss } from "@/lib/utils";
import { Color } from "@/types/canvas";
import React from "react";

interface ColorPickerProps {
  onChange: (color: Color) => void;
}

export const ColorPicker = ({ onChange }: ColorPickerProps) => {
  return (
    <div className="flex flex-wrap gap-2 items-center max-w-[164px] pr-2 mr-2 border-r border-neutral-200">
      <ColorButton onClick={onChange} color={{ r: 243, g: 83, b: 255 }} />
      <ColorButton onClick={onChange} color={{ r: 150, g: 200, b: 255 }} />
      <ColorButton onClick={onChange} color={{ r: 100, g: 50, b: 200 }} />
      <ColorButton onClick={onChange} color={{ r: 34, g: 193, b: 195 }} />
      <ColorButton onClick={onChange} color={{ r: 255, g: 99, b: 71 }} />
      <ColorButton onClick={onChange} color={{ r: 255, g: 223, b: 186 }} />
      <ColorButton onClick={onChange} color={{ r: 255, g: 69, b: 0 }} />
      <ColorButton onClick={onChange} color={{ r: 255, g: 105, b: 180 }} />
    </div>
  );
};

interface ColorButtonProps {
  onClick: (color: Color) => void;
  color: Color;
}

const ColorButton = ({ onClick, color }: ColorButtonProps) => {
  return (
    <button
      className="w-8 h-8 items-center flex justify-center hover:opacity-75 transition"
      onClick={() => onClick(color)}
    >
      <div
        className="w-8 h-8 rounded-md border border-neutral-300"
        style={{ background: colorToCss(color) }}
      ></div>
    </button>
  );
};
