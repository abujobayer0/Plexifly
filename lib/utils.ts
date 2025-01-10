import { Camera, Color } from "@/types/canvas";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
const COLORS = [
  "#FF5733", // Red Orange
  "#5733FF", // Electric Violet
  "#FF8C00", // Dark Orange
  "#FFD700", // Gold
  "#228B22", // Forest Green
  "#8B008B", // Dark Magenta
  "#FF3366", // Strawberry Red
  "#FF00FF", // Magenta
  "#FF9F00", // Amber
  "#DA70D6", // Orchid
  "#48C9B0", // Turquoise
  "#1F618D", // Deep Blue
  "#2E8B57", // Sea Green
  "#7D3C98", // Purple
  "#F4A300", // Vivid Amber
  "#D9534F", // Scarlet Red
];

export function connectionIdToColor(connectionId: number): string {
  return COLORS[connectionId % COLORS.length];
}

export function pointerEventToCanvasPoint(
  e: React.PointerEvent,
  camera: Camera
) {
  return {
    x: Math.round(e.clientX) - camera.x,
    y: Math.round(e.clientY) - camera.y,
  };
}

export function colorToCss(color: Color) {
  return `#${color.r.toString(16).padStart(2, "0")}${color.g.toString(16).padStart(2, "0")}${color.b.toString(16).padStart(2, "0")}`;
}
