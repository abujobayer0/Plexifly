"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  ArrowRight,
  Check,
  Github,
  History,
  ImagePlus,
  Keyboard,
  Menu,
  MousePointer2,
  Sparkles,
  StickyNote,
  Table2,
  Users,
  Workflow,
  X,
} from "lucide-react";
import BoardMockup from "@/components/home/board-mockup";
import { cn } from "@/lib/utils";

const GITHUB_URL = "https://github.com/abujobayer0/Plexifly";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Templates", href: "#templates" },
  { label: "How it works", href: "#how-it-works" },
];

const STACK = ["Next.js", "Liveblocks", "Convex", "Clerk", "Tailwind CSS"];

const FEATURES = [
  {
    icon: MousePointer2,
    title: "Real-time, together",
    description:
      "See every collaborator's cursor, selection and edit the moment it happens — no refresh, no merge conflicts.",
    className: "lg:col-span-2",
    visual: "presence",
  },
  {
    icon: Workflow,
    title: "Diagrams that stay connected",
    description:
      "Flowchart shapes with labels and connectors that follow when you move things around.",
  },
  {
    icon: StickyNote,
    title: "Sticky notes & sections",
    description:
      "Capture ideas fast, then group them into titled sections that move as one.",
  },
  {
    icon: Table2,
    title: "Tables on the canvas",
    description:
      "Track owners, status and dates right next to the work — add rows and columns in a click.",
  },
  {
    icon: ImagePlus,
    title: "Drop in images",
    description:
      "Drag files onto the board or paste screenshots straight from your clipboard.",
  },
  {
    icon: Keyboard,
    title: "Keyboard-first",
    description:
      "Single-key tools, copy, paste, duplicate, nudge and zoom — stay in flow.",
    className: "lg:col-span-2",
    visual: "shortcuts",
  },
  {
    icon: History,
    title: "Undo anything",
    description:
      "Full undo and redo history on an infinite canvas with smooth pan and zoom.",
  },
];

const TEMPLATES = [
  {
    name: "Kanban board",
    description: "To do, in progress and done columns with task cards.",
    preview: "kanban",
  },
  {
    name: "Flowchart",
    description: "Start, process, decision and outcome steps.",
    preview: "flowchart",
  },
  {
    name: "Roadmap",
    description: "A quarterly timeline with milestones and goals.",
    preview: "roadmap",
  },
  {
    name: "Project plan",
    description: "A task table with owners, status and due dates.",
    preview: "table",
  },
  {
    name: "SWOT analysis",
    description: "Strengths, weaknesses, opportunities and threats.",
    preview: "swot",
  },
] as const;

const STEPS = [
  {
    title: "Create a board",
    description:
      "Start blank or from a template — Kanban, flowchart, roadmap and more.",
  },
  {
    title: "Invite your team",
    description:
      "Boards live in your organization, so everyone you invite can jump in.",
  },
  {
    title: "Plan in real time",
    description:
      "Brainstorm, diagram and decide together while every change syncs live.",
  },
];

export default function HomePage() {
  const { isSignedIn } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const primaryLabel = isSignedIn ? "Open dashboard" : "Get started free";

  return (
    <div className="min-h-screen bg-white text-zinc-900 [font-family:var(--font-jakarta)] scroll-smooth">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/80 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.svg" alt="" width={30} height={30} />
            <span className="text-lg font-bold tracking-tight">Plexifly</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Plexifly on GitHub"
              className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
            >
              <Github className="h-[18px] w-[18px]" />
            </a>
            {!isSignedIn && (
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex h-9 items-center rounded-lg px-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
              >
                Log in
              </Link>
            )}
            <Link
              href="/dashboard"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-zinc-900 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800"
            >
              {primaryLabel}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {isMenuOpen && (
          <div className="md:hidden border-t border-zinc-200/70 bg-white px-4 py-3">
            {[...NAV_LINKS, { label: "GitHub", href: GITHUB_URL }].map(
              (link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
                >
                  {link.label}
                </a>
              )
            )}
            {!isSignedIn && (
              <Link
                href="/dashboard"
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
              >
                Log in
              </Link>
            )}
          </div>
        )}
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.09)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_40%,transparent_100%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[-12rem] h-[36rem] w-[64rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.18),transparent)]"
          />

          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-20 sm:pt-28 pb-16 text-center">
            <a
              href="#features"
              className="group inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 py-1 pl-1 pr-3 text-xs sm:text-sm font-medium text-zinc-600 shadow-sm backdrop-blur transition-colors hover:border-zinc-300"
            >
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-indigo-600">
                <Sparkles className="h-3.5 w-3.5" />
                New
              </span>
              Connectors, tables &amp; project templates
              <ArrowRight className="h-3.5 w-3.5 text-zinc-400 transition-transform group-hover:translate-x-0.5" />
            </a>

            <h1 className="mx-auto mt-7 max-w-4xl text-[2.6rem] leading-[1.05] sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.035em]">
              The whiteboard where teams{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                plan together
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-zinc-600">
              Sticky notes, flowcharts, tables and roadmaps on one infinite,
              real-time canvas. Bring your team in and watch every idea take
              shape as it happens.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="group inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 text-[15px] font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/30"
              >
                {primaryLabel}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-6 text-[15px] font-semibold text-zinc-800 shadow-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50"
              >
                <Github className="h-4 w-4" />
                View on GitHub
              </a>
            </div>

            <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-500">
              {["Real-time collaboration", "Open source", "Works in your browser"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-emerald-500" />
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pb-20 sm:pb-28">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-10 top-10 bottom-10 rounded-[2rem] bg-gradient-to-r from-indigo-400/25 via-violet-400/20 to-fuchsia-400/25 blur-3xl"
            />
            <div className="relative">
              <BoardMockup />
            </div>
          </div>
        </section>

        {/* Stack strip */}
        <section className="border-y border-zinc-100 bg-zinc-50/60">
          <div className="mx-auto flex max-w-6xl flex-col lg:flex-row items-center justify-center gap-x-10 gap-y-4 px-4 sm:px-6 py-8">
            <p className="whitespace-nowrap text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">
              Built on a modern real-time stack
            </p>
            <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {STACK.map((name) => (
                <li
                  key={name}
                  className="text-base font-bold tracking-tight text-zinc-400"
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-20 py-24 sm:py-32">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="Features"
              title="Everything your team needs on one canvas"
              description="From a quick brainstorm to a full project plan — Plexifly gives you the building blocks and gets out of your way."
            />

            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </div>
          </div>
        </section>

        {/* Templates */}
        <section
          id="templates"
          className="scroll-mt-20 border-y border-zinc-100 bg-zinc-50/60 py-24 sm:py-32"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="Templates"
              title="Start from a plan, not a blank page"
              description="One click drops a ready-made structure onto your board — then make it yours."
            />

            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {TEMPLATES.map((template) => (
                <div
                  key={template.name}
                  className="group rounded-2xl border border-zinc-200/80 bg-white p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-xl bg-[#f8f9fb] bg-[radial-gradient(rgba(0,0,0,0.08)_1px,transparent_1px)] [background-size:12px_12px]">
                    <TemplatePreview kind={template.preview} />
                  </div>
                  <div className="px-1.5 pt-3 pb-1">
                    <h3 className="text-sm font-bold">{template.name}</h3>
                    <p className="mt-1 text-[13px] leading-snug text-zinc-500">
                      {template.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="scroll-mt-20 py-24 sm:py-32">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="How it works"
              title="From idea to plan in minutes"
            />
            <ol className="mt-14 grid gap-4 md:grid-cols-3">
              {STEPS.map((step, index) => (
                <li
                  key={step.title}
                  className="relative rounded-2xl border border-zinc-200/80 bg-white p-7 shadow-sm"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-600 ring-1 ring-inset ring-indigo-100">
                    {index + 1}
                  </span>
                  <h3 className="mt-5 text-lg font-bold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-zinc-600">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Final call to action */}
        <section className="px-4 sm:px-6 pb-24 sm:pb-32">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-zinc-950 px-6 py-16 sm:px-16 sm:py-20 text-center">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.09)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_80%)]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-indigo-500/30 blur-3xl"
            />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] text-white">
                Bring your next big idea to the board
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-base sm:text-lg text-zinc-400">
                Create a board, invite your team and start planning together in
                seconds.
              </p>
              <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/dashboard"
                  className="group inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-white px-6 text-[15px] font-semibold text-zinc-900 transition-colors hover:bg-zinc-100"
                >
                  {primaryLabel}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-white/15 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-white/10"
                >
                  <Github className="h-4 w-4" />
                  Star on GitHub
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
          <div className="flex flex-col gap-10 md:flex-row md:justify-between">
            <div className="max-w-xs">
              <Link href="/" className="flex items-center gap-2.5">
                <Image src="/logo.svg" alt="" width={28} height={28} />
                <span className="text-lg font-bold tracking-tight">Plexifly</span>
              </Link>
              <p className="mt-4 text-sm leading-relaxed text-zinc-500">
                A real-time collaborative whiteboard for planning, diagramming
                and brainstorming together.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-10 sm:gap-16">
              <FooterColumn
                title="Product"
                links={[...NAV_LINKS, { label: "Dashboard", href: "/dashboard" }]}
              />
              <FooterColumn
                title="Project"
                links={[
                  { label: "GitHub", href: GITHUB_URL },
                  { label: "Report an issue", href: `${GITHUB_URL}/issues` },
                ]}
              />
            </div>
          </div>
          <div className="mt-12 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 border-t border-zinc-100 pt-8 text-sm text-zinc-500">
            <p>© {new Date().getFullYear()} Plexifly. All rights reserved.</p>
            <p className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              Made for teams that think out loud.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-semibold text-indigo-600">{eyebrow}</p>
      <h2 className="mt-3 text-3xl sm:text-[2.6rem] sm:leading-[1.1] font-extrabold tracking-[-0.03em]">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base sm:text-lg leading-relaxed text-zinc-600">
          {description}
        </p>
      )}
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  className,
  visual,
}: (typeof FEATURES)[number]) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-7 shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-inset ring-indigo-100">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-5 text-lg font-bold tracking-tight">{title}</h3>
      <p className="mt-2 max-w-md text-[15px] leading-relaxed text-zinc-600">
        {description}
      </p>

      {visual === "presence" && (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {[
            ["Maya", "#ec4899"],
            ["Leo", "#3b82f6"],
            ["Aria", "#f59e0b"],
            ["Sam", "#10b981"],
          ].map(([name, color]) => (
            <span
              key={name}
              className="inline-flex items-center gap-1.5 rounded-full py-1 pl-1.5 pr-3 text-xs font-semibold text-white shadow-sm"
              style={{ background: color }}
            >
              <MousePointer2 className="h-3.5 w-3.5 fill-white/40" />
              {name}
            </span>
          ))}
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            4 people editing
          </span>
        </div>
      )}

      {visual === "shortcuts" && (
        <div className="mt-6 flex flex-wrap gap-1.5">
          {["V", "P", "R", "N", "G", "⌘D", "⌘G"].map((key) => (
            <kbd
              key={key}
              className="min-w-7 rounded-md border border-zinc-200 border-b-2 bg-zinc-50 px-1.5 py-0.5 text-center text-xs font-semibold text-zinc-600"
            >
              {key}
            </kbd>
          ))}
        </div>
      )}
    </div>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              {...(link.href.startsWith("http")
                ? { target: "_blank", rel: "noreferrer" }
                : {})}
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-900"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Small illustrations of each board template.
function TemplatePreview({
  kind,
}: {
  kind: (typeof TEMPLATES)[number]["preview"];
}) {
  const svgProps = {
    viewBox: "0 0 160 120",
    className: "h-full w-full transition-transform duration-300 group-hover:scale-[1.03]",
    "aria-hidden": true,
  };

  switch (kind) {
    case "kanban":
      return (
        <svg {...svgProps}>
          {[
            ["#eff6ff", "#bfdbfe", "#93c5fd", 3],
            ["#fff7ed", "#fed7aa", "#fdba74", 2],
            ["#f0fdf4", "#bbf7d0", "#86efac", 1],
          ].map(([bg, border, note, count], i) => (
            <g key={i} transform={`translate(${12 + i * 48} 14)`}>
              <rect width={42} height={92} rx={6} fill={bg as string} stroke={border as string} />
              {Array.from({ length: count as number }).map((_, j) => (
                <rect key={j} x={5} y={12 + j * 24} width={32} height={19} rx={2} fill={note as string} />
              ))}
            </g>
          ))}
        </svg>
      );
    case "flowchart":
      return (
        <svg {...svgProps}>
          <g stroke="#94a3b8" strokeWidth={1.5} fill="none">
            <path d="M80,30 V40 M80,58 V66 M101,80 H116 M80,94 V100" />
          </g>
          <ellipse cx={80} cy={20} rx={20} ry={10} fill="none" stroke="#22c55e" strokeWidth={2} />
          <rect x={60} y={40} width={40} height={18} rx={4} fill="#3b82f6" />
          <polygon points="80,66 100,80 80,94 60,80" fill="#facc15" />
          <rect x={116} y={71} width={32} height={18} rx={4} fill="#6366f1" />
          <rect x={62} y={100} width={36} height={14} rx={4} fill="#ef4444" />
        </svg>
      );
    case "roadmap":
      return (
        <svg {...svgProps}>
          <rect x={8} y={12} width={144} height={96} rx={8} fill="#f5f5ff" stroke="#c7c8f7" />
          <line x1={18} y1={54} x2={142} y2={54} stroke="#94a3b8" strokeWidth={1.5} />
          {["#3b82f6", "#a855f7", "#f97316", "#22c55e"].map((color, i) => (
            <g key={color} transform={`translate(${32 + i * 32} 0)`}>
              <rect x={-12} y={30} width={24} height={5} rx={2.5} fill="#cbd5e1" />
              <polygon points="0,48 6,54 0,60 -6,54" fill={color} />
              <rect x={-12} y={68} width={24} height={28} rx={2} fill={color} opacity={0.35} />
            </g>
          ))}
        </svg>
      );
    case "table":
      return (
        <svg {...svgProps}>
          <rect x={12} y={18} width={136} height={84} rx={6} fill="#fff" stroke="#e5e7eb" />
          <path d="M18,18 H142 Q148,18 148,24 V32 H12 V24 Q12,18 18,18 Z" fill="#e0e7ff" />
          {[0, 1, 2, 3].map((row) => (
            <g key={row}>
              <line x1={12} y1={32 + row * 17.5} x2={148} y2={32 + row * 17.5} stroke="#eef0f3" />
              <rect x={20} y={38 + row * 17.5} width={38} height={5} rx={2.5} fill="#d4d4d8" />
              <rect x={74} y={38 + row * 17.5} width={22} height={5} rx={2.5} fill="#e4e4e7" />
              <rect
                x={110}
                y={36 + row * 17.5}
                width={30}
                height={9}
                rx={4.5}
                fill={["#dcfce7", "#fef3c7", "#e0e7ff", "#e0e7ff"][row]}
              />
            </g>
          ))}
          <line x1={66} y1={18} x2={66} y2={102} stroke="#eef0f3" />
          <line x1={104} y1={18} x2={104} y2={102} stroke="#eef0f3" />
        </svg>
      );
    case "swot":
      return (
        <svg {...svgProps}>
          {[
            ["#f0fdf4", "#bbf7d0", "#86efac"],
            ["#fef2f2", "#fecaca", "#fca5a5"],
            ["#eff6ff", "#bfdbfe", "#93c5fd"],
            ["#fff7ed", "#fed7aa", "#fdba74"],
          ].map(([bg, border, note], i) => (
            <g key={i} transform={`translate(${12 + (i % 2) * 70} ${12 + Math.floor(i / 2) * 50})`}>
              <rect width={66} height={46} rx={6} fill={bg} stroke={border} />
              <rect x={6} y={14} width={26} height={20} rx={2} fill={note} />
            </g>
          ))}
        </svg>
      );
  }
}
