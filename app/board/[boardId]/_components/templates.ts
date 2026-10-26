import { Color, Layer, LayerType } from "@/types/canvas";

// Ready-made boards for project planning. Each template lays out layers
// relative to (0, 0); the canvas centers them in the viewport on insert.

export const TEMPLATE_COLORS = {
  yellow: { r: 250, g: 204, b: 21 },
  blue: { r: 59, g: 130, b: 246 },
  green: { r: 34, g: 197, b: 94 },
  red: { r: 239, g: 68, b: 68 },
  orange: { r: 249, g: 115, b: 22 },
  purple: { r: 168, g: 85, b: 247 },
  indigo: { r: 99, g: 102, b: 241 },
  pink: { r: 236, g: 72, b: 153 },
  gray: { r: 115, g: 115, b: 115 },
  dark: { r: 30, g: 30, b: 30 },
} satisfies Record<string, Color>;

const C = TEMPLATE_COLORS;

export interface BoardTemplate {
  id: string;
  name: string;
  description: string;
  build: () => Layer[];
}

const note = (
  x: number,
  y: number,
  value: string,
  fill: Color,
  width = 220,
  height = 110
): Layer => ({ type: LayerType.Note, x, y, width, height, fill, value });

const frame = (
  x: number,
  y: number,
  width: number,
  height: number,
  value: string,
  fill: Color
): Layer => ({ type: LayerType.Frame, x, y, width, height, fill, value });

const text = (
  x: number,
  y: number,
  width: number,
  height: number,
  value: string,
  fill: Color = C.dark
): Layer => ({ type: LayerType.Text, x, y, width, height, fill, value });

// Arrow from (x1, y1) to (x2, y2).
const arrow = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  fill: Color = C.gray
): Layer => ({
  type: LayerType.Arrow,
  x: Math.min(x1, x2),
  y: Math.min(y1, y2),
  width: Math.abs(x2 - x1),
  height: Math.abs(y2 - y1),
  fill,
  flipX: x2 < x1,
  flipY: y2 < y1,
});

const kanban: BoardTemplate = {
  id: "kanban",
  name: "Kanban board",
  description: "To do, in progress and done columns with task cards",
  build: () => {
    const columns: { title: string; fill: Color; tasks: string[] }[] = [
      {
        title: "To do",
        fill: C.blue,
        tasks: ["Define project scope", "Research competitors", "Draft requirements"],
      },
      {
        title: "In progress",
        fill: C.orange,
        tasks: ["Design wireframes", "Set up repo & CI"],
      },
      { title: "Done", fill: C.green, tasks: ["Kickoff meeting"] },
    ];
    return columns.flatMap((column, i) => {
      const x = i * 320;
      return [
        frame(x, 0, 280, 500, column.title, column.fill),
        ...column.tasks.map((task, j) =>
          note(x + 20, 64 + j * 140, task, column.fill, 240, 116)
        ),
      ];
    });
  },
};

const flowchart: BoardTemplate = {
  id: "flowchart",
  name: "Flowchart",
  description: "Start, process, decision and outcome steps",
  build: () => [
    {
      type: LayerType.Ellipse,
      x: 100,
      y: 0,
      width: 160,
      height: 70,
      fill: C.green,
      value: "Start",
    },
    arrow(180, 74, 180, 126),
    {
      type: LayerType.Rectangle,
      x: 90,
      y: 130,
      width: 180,
      height: 80,
      fill: C.blue,
      value: "Gather requirements",
    },
    arrow(180, 214, 180, 266),
    {
      type: LayerType.Diamond,
      x: 80,
      y: 270,
      width: 200,
      height: 130,
      fill: C.yellow,
      value: "Approved?",
    },
    arrow(284, 335, 396, 335),
    text(305, 295, 60, 30, "Yes", C.gray),
    {
      type: LayerType.Rectangle,
      x: 400,
      y: 295,
      width: 180,
      height: 80,
      fill: C.indigo,
      value: "Build & test",
    },
    arrow(180, 404, 180, 466),
    text(190, 418, 50, 30, "No", C.gray),
    {
      type: LayerType.Rectangle,
      x: 90,
      y: 470,
      width: 180,
      height: 80,
      fill: C.red,
      value: "Revise plan",
    },
    arrow(490, 379, 490, 466),
    {
      type: LayerType.Ellipse,
      x: 410,
      y: 470,
      width: 160,
      height: 80,
      fill: C.purple,
      value: "Launch",
    },
  ],
};

const roadmap: BoardTemplate = {
  id: "roadmap",
  name: "Roadmap",
  description: "Quarterly timeline with milestones and goals",
  build: () => {
    const milestones: { title: string; goal: string; fill: Color }[] = [
      { title: "Q1 · Discovery", goal: "User interviews & market research", fill: C.blue },
      { title: "Q2 · Design", goal: "Prototype and validate core flows", fill: C.purple },
      { title: "Q3 · Build", goal: "Ship MVP to beta users", fill: C.orange },
      { title: "Q4 · Launch", goal: "Public launch & growth", fill: C.green },
    ];
    return [
      frame(0, 0, 1100, 400, "Product roadmap", C.indigo),
      arrow(40, 170, 1060, 170, C.gray),
      ...milestones.flatMap((m, i) => {
        const cx = 150 + i * 260;
        return [
          text(cx - 100, 100, 200, 44, m.title, C.dark),
          {
            type: LayerType.Diamond,
            x: cx - 18,
            y: 152,
            width: 36,
            height: 36,
            fill: m.fill,
          } as Layer,
          note(cx - 100, 215, m.goal, m.fill, 200, 140),
        ];
      }),
    ];
  },
};

const projectTable: BoardTemplate = {
  id: "project-plan",
  name: "Project plan",
  description: "Task table with owners, status and due dates",
  build: () => [
    text(0, 0, 320, 56, "Project plan", C.dark),
    {
      type: LayerType.Table,
      x: 0,
      y: 70,
      width: 680,
      height: 300,
      fill: C.indigo,
      cells: [
        ["Task", "Owner", "Status", "Due date"],
        ["Project kickoff", "Alex", "Done", "Jan 10"],
        ["Requirements", "Sam", "In progress", "Jan 24"],
        ["Design", "Jordan", "Not started", "Feb 7"],
        ["Development", "Team", "Not started", "Mar 15"],
        ["Launch", "Alex", "Not started", "Apr 1"],
      ],
    },
  ],
};

const swot: BoardTemplate = {
  id: "swot",
  name: "SWOT analysis",
  description: "Strengths, weaknesses, opportunities and threats",
  build: () => {
    const quadrants: { title: string; fill: Color }[] = [
      { title: "Strengths", fill: C.green },
      { title: "Weaknesses", fill: C.red },
      { title: "Opportunities", fill: C.blue },
      { title: "Threats", fill: C.orange },
    ];
    return quadrants.flatMap((q, i) => {
      const x = (i % 2) * 400;
      const y = Math.floor(i / 2) * 330;
      return [
        frame(x, y, 360, 290, q.title, q.fill),
        note(x + 20, y + 64, "", q.fill, 200, 110),
      ];
    });
  },
};

export const BOARD_TEMPLATES: BoardTemplate[] = [
  kanban,
  flowchart,
  roadmap,
  projectTable,
  swot,
];
