export type Color = {
  r: number;
  g: number;
  b: number;
};
export type Camera = {
  x: number;
  y: number;
  zoom: number;
};

export enum LayerType {
  Rectangle,
  Ellipse,
  Path,
  Text,
  Note,
  // Appended so existing stored layers keep their numeric type values.
  Diamond,
  Line,
  Arrow,
  Triangle,
  Hexagon,
  Parallelogram,
  Cylinder,
  Table,
  Frame,
}

// Filled outline shapes drawn from a point list (flowchart / diagram shapes).
export type PolygonLayerType =
  | LayerType.Diamond
  | LayerType.Triangle
  | LayerType.Hexagon
  | LayerType.Parallelogram
  | LayerType.Cylinder;

// Layer types created by clicking or dragging a box on the canvas.
export type InsertableLayerType =
  | LayerType.Ellipse
  | LayerType.Rectangle
  | LayerType.Text
  | LayerType.Note
  | LayerType.Diamond
  | LayerType.Line
  | LayerType.Arrow
  | PolygonLayerType
  | LayerType.Table
  | LayerType.Frame;

export type RectangleLayer = {
  type: LayerType.Rectangle;
  x: number;
  y: number;
  height: number;
  width: number;
  fill: Color;
  value?: string;
};

export type EllipseLayer = {
  type: LayerType.Ellipse;
  x: number;
  y: number;
  height: number;
  width: number;
  fill: Color;
  value?: string;
};

export type PathLayer = {
  type: LayerType.Path;
  x: number;
  y: number;
  height: number;
  width: number;
  fill: Color;
  points: number[][];
  value?: string;
};

export type TextLayer = {
  type: LayerType.Text;
  x: number;
  y: number;
  height: number;
  width: number;
  fill: Color;
  value?: string;
};

export type NoteLayer = {
  type: LayerType.Note;
  x: number;
  y: number;
  height: number;
  width: number;
  fill: Color;
  value?: string;
};

export type PolygonLayer = {
  type: PolygonLayerType;
  x: number;
  y: number;
  height: number;
  width: number;
  fill: Color;
  value?: string;
};

// Lines and arrows run corner to corner of their bounding box. The flip
// flags record which diagonal: unflipped goes from top-left to bottom-right.
export type LineLayer = {
  type: LayerType.Line | LayerType.Arrow;
  x: number;
  y: number;
  height: number;
  width: number;
  fill: Color;
  flipX?: boolean;
  flipY?: boolean;
  // Connector attachments: ids of the layers this line starts/ends on.
  startId?: string;
  endId?: string;
  value?: string;
};

export type TableLayer = {
  type: LayerType.Table;
  x: number;
  y: number;
  height: number;
  width: number;
  fill: Color;
  // cells[row][col]; the first row is rendered as the header.
  cells: string[][];
  value?: string;
};

// A titled section that groups content; always kept beneath other layers.
export type FrameLayer = {
  type: LayerType.Frame;
  x: number;
  y: number;
  height: number;
  width: number;
  fill: Color;
  value?: string;
};

export type Point = {
  x: number;
  y: number;
};

export type XYWH = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export enum Side {
  Top = 1,
  Bottom = 2,
  Left = 4,
  Right = 8,
}

export type CanvasState =
  | {
      mode: CanvasMode.None;
    }
  | {
      mode: CanvasMode.SelectionNet;
      origin: Point;
      current?: Point;
    }
  | {
      mode: CanvasMode.Translating;
      current: Point;
    }
  | {
      mode: CanvasMode.Inserting;
      layerType: InsertableLayerType;
      // Set once the pointer is down; current tracks the drag.
      origin?: Point;
      current?: Point;
    }
  | {
      mode: CanvasMode.Resizing;
      initialBounds: XYWH;
      corner: Side;
    }
  | {
      mode: CanvasMode.Pencil;
    }
  | {
      mode: CanvasMode.Pressing;
      origin: Point;
    }
  | {
      mode: CanvasMode.Hand;
    }
  | {
      mode: CanvasMode.Eraser;
      isErasing?: boolean;
    };

export enum CanvasMode {
  None,
  Pressing,
  SelectionNet,
  Translating,
  Inserting,
  Resizing,
  Pencil,
  Hand,
  Eraser,
}

export type Layer =
  | RectangleLayer
  | EllipseLayer
  | TextLayer
  | NoteLayer
  | PathLayer
  | PolygonLayer
  | LineLayer
  | TableLayer
  | FrameLayer;
