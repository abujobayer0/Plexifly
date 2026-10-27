import type { ReactNode } from "react";

// Static product shot of a Plexifly board for the landing page. Drawn as one
// SVG so it scales cleanly at every viewport width.

const NOTE_SHADOW = "drop-shadow(0 6px 10px rgba(15,23,42,0.10))";

const Note = ({
  x,
  y,
  w = 140,
  h = 96,
  paper,
  accent,
  lines,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  paper: string;
  accent: string;
  lines: string[];
}) => (
  <g style={{ filter: NOTE_SHADOW }}>
    <path
      d={`M${x + 6},${y} H${x + w} V${y + h - 16} L${x + w - 16},${y + h} H${x + 6} Q${x},${y + h} ${x},${y + h - 6} V${y + 6} Q${x},${y} ${x + 6},${y} Z`}
      fill={paper}
    />
    <rect x={x} y={y} width={w} height={5} rx={2.5} fill={accent} opacity={0.7} />
    <path
      d={`M${x + w},${y + h - 16} L${x + w - 16},${y + h} L${x + w - 16},${y + h - 16} Z`}
      fill={accent}
      opacity={0.55}
    />
    <text x={x + 12} y={y + 28} fontSize={12.5} fill="#1f2937" fontWeight={500}>
      {lines.map((line, i) => (
        <tspan key={line} x={x + 12} dy={i === 0 ? 0 : 17}>
          {line}
        </tspan>
      ))}
    </text>
  </g>
);

const Arrow = ({ d, head }: { d: string; head: string }) => (
  <g stroke="#64748b" strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
    <polyline points={head} />
  </g>
);

const Cursor = ({
  x,
  y,
  name,
  color,
}: {
  x: number;
  y: number;
  name: string;
  color: string;
}) => (
  <g transform={`translate(${x} ${y})`}>
    <path
      d="M0,0 L0,17 L4.5,13 L8,21 L11,19.8 L7.6,12 L13.5,12 Z"
      fill={color}
      stroke="#fff"
      strokeWidth={1.4}
      strokeLinejoin="round"
    />
    <rect x={14} y={16} rx={9} width={name.length * 7.4 + 18} height={20} fill={color} />
    <text x={23} y={30} fontSize={11.5} fill="#fff" fontWeight={600}>
      {name}
    </text>
  </g>
);

const DockIcon = ({ x, children, active }: { x: number; children: ReactNode; active?: boolean }) => (
  <g transform={`translate(${x} 0)`}>
    {active && <rect x={-15} y={-15} width={30} height={30} rx={8} fill="#6366f1" />}
    <g stroke={active ? "#fff" : "#52525b"} strokeWidth={1.7} fill="none" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </g>
  </g>
);

export default function BoardMockup() {
  return (
    <div className="relative rounded-2xl border border-zinc-200/80 bg-white shadow-[0_30px_80px_-20px_rgba(15,23,42,0.25),0_0_0_1px_rgba(15,23,42,0.02)] overflow-hidden">
      {/* Browser chrome */}
      <div className="flex items-center gap-3 border-b border-zinc-200/80 bg-zinc-50/80 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="mx-auto hidden sm:flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          plexifly · Sprint 24 planning
        </div>
        <div className="ml-auto sm:ml-0 flex -space-x-1.5">
          {[
            ["M", "#ec4899"],
            ["L", "#3b82f6"],
            ["A", "#f59e0b"],
          ].map(([initial, color]) => (
            <span
              key={initial}
              className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-white ring-2 ring-white"
              style={{ background: color }}
            >
              {initial}
            </span>
          ))}
        </div>
      </div>

      <svg
        viewBox="0 0 1200 660"
        className="block w-full h-auto"
        role="img"
        aria-label="A Plexifly board with a sprint planning section, a flowchart, a task table and live collaborator cursors"
      >
        <defs>
          <pattern id="mock-dots" width={24} height={24} patternUnits="userSpaceOnUse">
            <circle cx={1} cy={1} r={1} fill="rgba(0,0,0,0.13)" />
          </pattern>
          <linearGradient id="mock-image" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#818cf8" />
            <stop offset="1" stopColor="#f472b6" />
          </linearGradient>
          <filter id="mock-shadow" x="-10%" y="-10%" width="120%" height="140%">
            <feDropShadow dx={0} dy={6} stdDeviation={10} floodColor="#0f172a" floodOpacity={0.1} />
          </filter>
        </defs>

        <rect width={1200} height={660} fill="#f8f9fb" />
        <rect width={1200} height={660} fill="url(#mock-dots)" />

        {/* Section with sticky notes */}
        <rect x={50} y={50} width={540} height={318} rx={16} fill="#f5f5ff" stroke="#c7c8f7" strokeWidth={1.5} />
        <path d="M66,50 H574 Q590,50 590,66 V94 H50 V66 Q50,50 66,50 Z" fill="#e3e4fc" />
        <line x1={50} y1={94} x2={590} y2={94} stroke="#c7c8f7" />
        <circle cx={72} cy={72} r={5} fill="#6366f1" />
        <circle cx={72} cy={72} r={8} fill="none" stroke="#a5a8f5" strokeWidth={3} opacity={0.6} />
        <text x={88} y={77} fontSize={14} fontWeight={700} fill="#111827">
          Sprint 24 · Planning
        </text>
        <g fill="#111827" opacity={0.3}>
          {[0, 6, 12].map((dx) => (
            <g key={dx}>
              <circle cx={560 + dx} cy={69} r={1.4} />
              <circle cx={560 + dx} cy={75} r={1.4} />
            </g>
          ))}
        </g>

        <Note x={78} y={118} paper="#fdeba6" accent="#eab308" lines={["Redesign", "onboarding flow"]} />
        <Note x={240} y={118} paper="#c9dbfd" accent="#3b82f6" lines={["Rate limits for", "public API"]} />
        <Note x={402} y={118} paper="#bff0cf" accent="#22c55e" lines={["Ship v2 editor", "to beta ✓"]} />
        <Note x={78} y={244} paper="#fbc7e2" accent="#ec4899" lines={["User interviews", "× 5"]} />
        <Note x={240} y={244} paper="#e2cbfd" accent="#a855f7" lines={["Pricing page", "copy review"]} />

        {/* Flowchart */}
        <ellipse cx={790} cy={92} rx={72} ry={30} fill="none" stroke="#22c55e" strokeWidth={3} />
        <text x={790} y={97} fontSize={14} fontWeight={600} fill="#16a34a" textAnchor="middle">
          New request
        </text>
        <Arrow d="M790,126 V164" head="783,156 790,165 797,156" />
        <g filter="url(#mock-shadow)">
          <rect x={712} y={170} width={156} height={58} rx={10} fill="#3b82f6" />
        </g>
        <text x={790} y={204} fontSize={14} fontWeight={600} fill="#fff" textAnchor="middle">
          Triage &amp; scope
        </text>
        <Arrow d="M790,232 V268" head="783,260 790,269 797,260" />
        <g filter="url(#mock-shadow)">
          <polygon points="790,274 870,326 790,378 710,326" fill="#facc15" />
        </g>
        <text x={790} y={331} fontSize={14} fontWeight={700} fill="#422006" textAnchor="middle">
          Approved?
        </text>
        <Arrow d="M876,326 H948" head="940,319 949,326 940,333" />
        <text x={900} y={316} fontSize={12} fill="#64748b" fontWeight={500}>
          Yes
        </text>
        <g filter="url(#mock-shadow)">
          <rect x={954} y={297} width={150} height={58} rx={10} fill="#6366f1" />
        </g>
        <text x={1029} y={331} fontSize={14} fontWeight={600} fill="#fff" textAnchor="middle">
          Build it
        </text>
        <Arrow d="M790,382 V418" head="783,410 790,419 797,410" />
        <text x={800} y={404} fontSize={12} fill="#64748b" fontWeight={500}>
          No
        </text>
        <g filter="url(#mock-shadow)">
          <rect x={712} y={424} width={156} height={58} rx={10} fill="#ef4444" />
        </g>
        <text x={790} y={458} fontSize={14} fontWeight={600} fill="#fff" textAnchor="middle">
          Back to backlog
        </text>

        {/* Task table */}
        <g filter="url(#mock-shadow)">
          <rect x={50} y={402} width={540} height={170} rx={12} fill="#fff" stroke="#e5e7eb" />
        </g>
        <path d="M62,402 H578 Q590,402 590,414 V444 H50 V414 Q50,402 62,402 Z" fill="#e3e4fc" />
        {[
          ["Task", 66],
          ["Owner", 290],
          ["Status", 430],
        ].map(([label, x]) => (
          <text key={label} x={x} y={428} fontSize={13} fontWeight={700} fill="#111827">
            {label}
          </text>
        ))}
        {[
          ["Kickoff & goals", "Maya", "Done", "#dcfce7", "#15803d"],
          ["API design review", "Leo", "In progress", "#fef3c7", "#b45309"],
          ["Beta launch", "Aria", "Planned", "#e0e7ff", "#4338ca"],
        ].map(([task, owner, status, bg, fg], i) => {
          const y = 444 + i * 42.6;
          return (
            <g key={task}>
              <line x1={50} y1={y} x2={590} y2={y} stroke="#eef0f3" />
              <text x={66} y={y + 27} fontSize={13} fill="#374151">
                {task}
              </text>
              <text x={290} y={y + 27} fontSize={13} fill="#374151">
                {owner}
              </text>
              <rect x={430} y={y + 11} width={status.length * 7 + 20} height={22} rx={11} fill={bg} />
              <text x={440} y={y + 26.5} fontSize={11.5} fontWeight={600} fill={fg}>
                {status}
              </text>
            </g>
          );
        })}
        <line x1={276} y1={402} x2={276} y2={572} stroke="#eef0f3" />
        <line x1={416} y1={402} x2={416} y2={572} stroke="#eef0f3" />

        {/* Image + pen stroke */}
        <g filter="url(#mock-shadow)">
          <rect x={930} y={420} width={210} height={132} rx={12} fill="url(#mock-image)" />
        </g>
        <circle cx={1090} cy={458} r={16} fill="#fff" opacity={0.35} />
        <path d="M930,532 L990,478 L1030,512 L1070,470 L1140,532 V540 Q1140,552 1128,552 H942 Q930,552 930,540 Z" fill="#fff" opacity={0.28} />
        <path
          d="M948,90 C980,60 1030,70 1050,100 S1110,140 1140,110"
          fill="none"
          stroke="#ec4899"
          strokeWidth={5}
          strokeLinecap="round"
        />
        <text x={968} y={150} fontSize={22} fill="#be185d" fontWeight={700} style={{ fontStyle: "italic" }}>
          ship it! 🚀
        </text>

        {/* Live cursors */}
        <Cursor x={856} y={350} name="Maya" color="#ec4899" />
        <Cursor x={360} y={200} name="Leo" color="#3b82f6" />
        <Cursor x={1040} y={392} name="Aria" color="#f59e0b" />

        {/* Tool dock */}
        <g transform="translate(600 618)">
          <rect x={-206} y={-24} width={412} height={48} rx={14} fill="#fff" stroke="#e4e4e7" filter="url(#mock-shadow)" />
          <DockIcon x={-180} active>
            <path d="M-5,-7 L-5,7 L-1.5,3.6 L1.5,9 L3.6,8 L0.8,2.6 L5.5,2.6 Z" />
          </DockIcon>
          <DockIcon x={-144}>
            <path d="M-4,7 V-2 M-1,7 V-5 M2,7 V-3 M5,7 V-1 M-6,2 Q-6,9 0,9 Q6,9 6,3" />
          </DockIcon>
          <line x1={-122} y1={-12} x2={-122} y2={12} stroke="#e4e4e7" />
          <DockIcon x={-100}>
            <path d="M-6,6 L4,-4 L6,-2 L-4,8 L-7,8 Z" />
          </DockIcon>
          <DockIcon x={-64}>
            <rect x={-6.5} y={-6.5} width={13} height={13} rx={2} />
          </DockIcon>
          <DockIcon x={-28}>
            <circle r={7} />
          </DockIcon>
          <DockIcon x={8}>
            <polygon points="0,-7.5 7.5,0 0,7.5 -7.5,0" />
          </DockIcon>
          <DockIcon x={44}>
            <path d="M-6,6 L6,-6 M0,-6 H6 V0" />
          </DockIcon>
          <line x1={66} y1={-12} x2={66} y2={12} stroke="#e4e4e7" />
          <DockIcon x={88}>
            <path d="M-6,-6 H6 M0,-6 V7" />
          </DockIcon>
          <DockIcon x={124}>
            <path d="M-6,-6 H6 V2 L2,6 H-6 Z M2,6 V2 H6" />
          </DockIcon>
          <DockIcon x={160}>
            <rect x={-7} y={-6} width={14} height={12} rx={1.5} />
            <path d="M-7,-1.5 H7 M-2,-6 V6" />
          </DockIcon>
          <circle cx={190} cy={0} r={8} fill="#1e1e1e" />
        </g>
      </svg>
    </div>
  );
}
