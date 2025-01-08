import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
const COLORS = [
  "#FF5733", // Red Orange
  "#33FF57", // Spring Green
  "#3357FF", // Blue
  "#5733FF", // Electric Violet
  "#8D33FF", // Purple
  "#FF33A1", // Deep Pink
  "#FF33FF", // Fuchsia
  "#D033FF", // Vivid Violet
  "#FF3357", // Ruby Red
  "#D2691E", // Chocolate
  "#8B4513", // Saddle Brown
  "#A52A2A", // Brown
  "#FF8C00", // Dark Orange
  "#FFD700", // Gold
  "#FFFF00", // Yellow
  "#ADFF2F", // Green Yellow
  "#228B22", // Forest Green
  "#6B8E23", // Olive Drab
  "#9ACD32", // Yellow Green
  "#F0E68C", // Khaki
  "#FFB6C1", // Light Pink
  "#FF69B4", // Hot Pink
  "#FFC0CB", // Pink
  "#D8BFD8", // Thistle
  "#E6E6FA", // Lavender
  "#B0C4DE", // Light Steel Blue
  "#87CEEB", // Sky Blue
  "#4682B4", // Steel Blue
  "#5F9EA0", // Cadet Blue
  "#00BFFF", // Deep Sky Blue
  "#1E90FF", // Dodger Blue
  "#6495ED", // Cornflower Blue
  "#4169E1", // Royal Blue
  "#0000FF", // Blue
  "#0000CD", // Medium Blue
  "#8A2BE2", // Blue Violet
  "#4B0082", // Indigo
  "#6A5ACD", // Slate Blue
  "#7B68EE", // Medium Slate Blue
  "#8B008B", // Dark Magenta
  "#800080", // Purple
  "#9932CC", // Dark Orchid
  "#FF3366", // Strawberry Red
  "#FF00FF", // Magenta
  "#FF9F00", // Amber
  "#DA70D6", // Orchid
  "#48C9B0", // Turquoise
  "#1F618D", // Deep Blue
  "#DFFF00", // Chartreuse
  "#2E8B57", // Sea Green
  "#7D3C98", // Purple
  "#F4A300", // Vivid Amber
  "#D9534F", // Scarlet Red
  "#5BC0EB", // Powder Blue
  "#7FFF00", // Chartreuse
  "#7CFC00", // Lawn Green
  "#8FBC8F", // Dark Sea Green
  "#00FF7F", // Spring Green
  "#3CB371", // Medium Sea Green
  "#4CAF50", // Emerald Green
  "#F0F8FF", // Alice Blue
];

export function connectionIdToColor(connectionId: number): string {
  return COLORS[connectionId % COLORS.length];
}
