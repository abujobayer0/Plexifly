import React from "react";
import { ToolButton } from "./tool-button";

import {
  ArrowUpRight,
  Circle,
  Diamond,
  Eraser,
  Frame,
  Hand,
  LayoutTemplate,
  Minus,
  MousePointer2,
  Pencil,
  Redo2,
  Shapes,
  Square,
  StickyNote,
  Table2,
  Type,
  Undo2,
} from "lucide-react";

import {
  CanvasMode,
  CanvasState,
  Color,
  InsertableLayerType,
  LayerType,
} from "@/types/canvas";
import { cn, colorToCss } from "@/lib/utils";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ColorPicker } from "./color-picker";
import { BOARD_TEMPLATES } from "./templates";

interface ToolbarProps {
  canvasState: CanvasState;
  setCanvasState: (newState: CanvasState) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  color: Color;
  setColor: (color: Color) => void;
  onInsertTemplate: (templateId: string) => void;
}

const SHAPE_TOOLS: {
  label: string;
  icon: typeof Square;
  shortcut: string;
  layerType: InsertableLayerType;
}[] = [
  { label: "Rectangle", icon: Square, shortcut: "R", layerType: LayerType.Rectangle },
  { label: "Ellipse", icon: Circle, shortcut: "O", layerType: LayerType.Ellipse },
  { label: "Diamond", icon: Diamond, shortcut: "D", layerType: LayerType.Diamond },
];

const LINE_TOOLS: typeof SHAPE_TOOLS = [
  { label: "Line", icon: Minus, shortcut: "L", layerType: LayerType.Line },
  { label: "Arrow", icon: ArrowUpRight, shortcut: "A", layerType: LayerType.Arrow },
];

// Diagram shapes in the "More shapes" menu, drawn as small outlines.
const MORE_SHAPES: {
  label: string;
  hint: string;
  layerType: InsertableLayerType;
  path: string;
}[] = [
  { label: "Triangle", hint: "Merge", layerType: LayerType.Triangle, path: "M10 3 L17 16 L3 16 Z" },
  { label: "Hexagon", hint: "Preparation", layerType: LayerType.Hexagon, path: "M6 4 L14 4 L18 10 L14 16 L6 16 L2 10 Z" },
  { label: "Parallelogram", hint: "Input / output", layerType: LayerType.Parallelogram, path: "M6 5 L18 5 L14 15 L2 15 Z" },
  { label: "Cylinder", hint: "Database", layerType: LayerType.Cylinder, path: "M4 5 A6 2 0 0 1 16 5 L16 15 A6 2 0 0 1 4 15 Z M4 5 A6 2 0 0 0 16 5" },
];



const Divider = () => <div className="w-px h-6 bg-neutral-200 mx-1" />;

const panelClassName =
  "bg-white/90 backdrop-blur-xl rounded-2xl p-1.5 flex items-center gap-0.5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-neutral-200/70";

export default function Toolbar({
  canRedo,
  canUndo,
  canvasState,
  setCanvasState,
  undo,
  redo,
  color,
  setColor,
  onInsertTemplate,
}: ToolbarProps) {
  const isInserting = (layerType: InsertableLayerType) =>
    canvasState.mode === CanvasMode.Inserting &&
    canvasState.layerType === layerType;

  return (
    <>
      <div
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-10 ${panelClassName}`}
      >
        <ToolButton
          label="Select"
          icon={MousePointer2}
          shortcut="V"
          isActive={
            canvasState.mode === CanvasMode.None ||
            canvasState.mode === CanvasMode.Translating ||
            canvasState.mode === CanvasMode.SelectionNet ||
            canvasState.mode === CanvasMode.Pressing ||
            canvasState.mode === CanvasMode.Resizing
          }
          onClick={() => setCanvasState({ mode: CanvasMode.None })}
        />
        <ToolButton
          label="Hand"
          icon={Hand}
          shortcut="H"
          isActive={canvasState.mode === CanvasMode.Hand}
          onClick={() => setCanvasState({ mode: CanvasMode.Hand })}
        />
        <Divider />
        <ToolButton
          label="Pen"
          icon={Pencil}
          shortcut="P"
          isActive={canvasState.mode === CanvasMode.Pencil}
          onClick={() => setCanvasState({ mode: CanvasMode.Pencil })}
        />
        <ToolButton
          label="Eraser"
          icon={Eraser}
          shortcut="E"
          isActive={canvasState.mode === CanvasMode.Eraser}
          onClick={() => setCanvasState({ mode: CanvasMode.Eraser })}
        />
        <Divider />
        {SHAPE_TOOLS.map(({ label, icon, shortcut, layerType }) => (
          <ToolButton
            key={label}
            label={label}
            icon={icon}
            shortcut={shortcut}
            isActive={isInserting(layerType)}
            onClick={() =>
              setCanvasState({ mode: CanvasMode.Inserting, layerType })
            }
          />
        ))}
        <Popover>
          <PopoverTrigger asChild>
            <ToolButton
              label="More shapes"
              icon={Shapes}
              isActive={MORE_SHAPES.some((shape) =>
                isInserting(shape.layerType)
              )}
            />
          </PopoverTrigger>
          <PopoverContent
            side="top"
            sideOffset={12}
            className="w-56 p-1.5 rounded-xl border border-neutral-200 shadow-xl"
          >
            {MORE_SHAPES.map(({ label, hint, layerType, path }) => (
              <button
                key={label}
                type="button"
                onClick={() =>
                  setCanvasState({ mode: CanvasMode.Inserting, layerType })
                }
                className={cn(
                  "w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-left transition-colors",
                  isInserting(layerType)
                    ? "bg-indigo-50 text-indigo-700"
                    : "hover:bg-neutral-100 text-neutral-700"
                )}
              >
                <svg
                  viewBox="0 0 20 20"
                  className="h-5 w-5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinejoin="round"
                >
                  <path d={path} />
                </svg>
                <span className="flex flex-col">
                  <span className="text-sm font-medium">{label}</span>
                  <span className="text-xs text-neutral-500">{hint}</span>
                </span>
              </button>
            ))}
          </PopoverContent>
        </Popover>
        {LINE_TOOLS.map(({ label, icon, shortcut, layerType }) => (
          <ToolButton
            key={label}
            label={label}
            icon={icon}
            shortcut={shortcut}
            isActive={isInserting(layerType)}
            onClick={() =>
              setCanvasState({ mode: CanvasMode.Inserting, layerType })
            }
          />
        ))}
        <Divider />
        <ToolButton
          label="Text"
          icon={Type}
          shortcut="T"
          isActive={isInserting(LayerType.Text)}
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Text,
            })
          }
        />
        <ToolButton
          label="Sticky note"
          icon={StickyNote}
          shortcut="N"
          isActive={isInserting(LayerType.Note)}
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Note,
            })
          }
        />
        <ToolButton
          label="Table"
          icon={Table2}
          shortcut="G"
          isActive={isInserting(LayerType.Table)}
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Table,
            })
          }
        />
        <ToolButton
          label="Section"
          icon={Frame}
          shortcut="F"
          isActive={isInserting(LayerType.Frame)}
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Frame,
            })
          }
        />
        <Divider />
        <Popover>
          <PopoverTrigger asChild>
            <ToolButton label="Templates" icon={LayoutTemplate} />
          </PopoverTrigger>
          <PopoverContent
            side="top"
            sideOffset={12}
            className="w-72 p-1.5 rounded-xl border border-neutral-200 shadow-xl"
          >
            <p className="px-2.5 pt-1.5 pb-2 text-xs font-medium uppercase tracking-wide text-neutral-400">
              Project templates
            </p>
            {BOARD_TEMPLATES.map((template) => (
              <PopoverClose asChild key={template.id}>
                <button
                  type="button"
                  onClick={() => onInsertTemplate(template.id)}
                  className="w-full flex flex-col px-2.5 py-2 rounded-lg text-left hover:bg-neutral-100 transition-colors"
                >
                  <span className="text-sm font-medium text-neutral-800">
                    {template.name}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {template.description}
                  </span>
                </button>
              </PopoverClose>
            ))}
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label="Color"
              className="h-9 w-9 rounded-lg flex items-center justify-center hover:bg-neutral-100 transition-colors"
            >
              <span
                className="h-5 w-5 rounded-full ring-2 ring-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]"
                style={{ background: colorToCss(color) }}
              />
            </button>
          </PopoverTrigger>
          <PopoverContent
            side="top"
            sideOffset={12}
            className="w-auto p-2 rounded-xl border border-neutral-200 shadow-xl"
          >
            <ColorPicker value={color} onChange={setColor} />
          </PopoverContent>
        </Popover>
      </div>

      <div
        className={`absolute top-[68px] left-2 min-[1080px]:top-auto min-[1080px]:bottom-4 min-[1080px]:left-4 z-10 ${panelClassName}`}
      >
        <ToolButton
          label="Undo"
          icon={Undo2}
          shortcut="⌘Z"
          isDisabled={!canUndo}
          onClick={undo}
        />
        <ToolButton
          label="Redo"
          icon={Redo2}
          shortcut="⌘⇧Z"
          onClick={redo}
          isDisabled={!canRedo}
        />
      </div>
    </>
  );
}

export function ToolbarSkeleton() {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.08)] rounded-2xl border border-neutral-200/70 h-[50px] w-[560px] max-w-[calc(100vw-32px)]" />
  );
}
