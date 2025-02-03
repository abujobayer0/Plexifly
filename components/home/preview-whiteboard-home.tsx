import {
  Circle,
  MousePointer2,
  Pencil,
  Square,
  StickyNote,
  Type,
} from "lucide-react";
import React from "react";

const PreviewWhiteboardHome = () => {
  return (
    <div className="mt-20 relative mx-auto max-w-5xl">
      <div className="rounded-xl border bg-white/50 backdrop-blur-sm shadow-2xl shadow-purple-500/10 overflow-hidden">
        {/* Window Controls */}
        <div className="px-4 py-3 border-b bg-white/50 backdrop-blur-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="text-sm text-gray-500 ml-3">
              Plexifly Whiteboard
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs px-2 py-1 rounded-md bg-gray-100/50 text-gray-500">
              100%
            </div>
            <div className="h-5 w-[1px] bg-gray-200" />
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs">
                A
              </div>
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                B
              </div>
            </div>
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="aspect-video bg-white relative">
          {/* Grid Background - modernized */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:40px_40px]">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-50/30 via-transparent to-blue-50/30" />
          </div>

          {/* Content Container */}
          <div className="absolute inset-0 p-20">
            {/* Project Title Area - adjusted position and styling */}
            <div className="absolute left-[10%] top-[10%] space-y-3 text-[#7c4dff]">
              <div className="text-5xl font-kalam  ">Q4 Roadmap</div>
              <div className="flex gap-2">
                {["#Product", "#Design", "#Engineering"].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 font-medium border border-purple-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Animated SVG Decorations */}
            <svg className="absolute inset-0 pointer-events-none">
              <path
                d="M100,200 C150,150 200,250 250,200"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2"
                className="animate-draw"
                strokeDasharray="5,5"
              />
              <circle
                cx="300"
                cy="250"
                r="4"
                className="fill-purple-400 animate-pulse"
              />
              <circle
                cx="400"
                cy="150"
                r="4"
                className="fill-blue-400 animate-ping"
              />
            </svg>

            {/* Demo Cursors */}
            <div
              style={{
                transform: `translateX(350px) translateY(180px)`,
              }}
              className="relative drop-shadow-md transition-transform duration-200 ease-in-out"
            >
              <MousePointer2
                className="h-5 w-5 animate-pulse-subtle"
                style={{
                  fill: "#8b5cf633",
                  color: "#8b5cf6",
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                }}
              />
              <div
                className="absolute left-5 px-2.5 py-1 rounded-full text-xs font-medium 
                backdrop-blur-sm shadow-sm"
                style={{
                  backgroundColor: "#8b5cf6CC",
                  transform: "translateY(-50%)",
                }}
              >
                John Doe
              </div>
            </div>

            <div
              style={{
                transform: `translateX(200px) translateY(300px)`,
              }}
              className="relative z-10 drop-shadow-md transition-transform duration-200 ease-in-out"
            >
              <MousePointer2
                className="h-5 w-5 animate-pulse-subtle"
                style={{
                  fill: "#3b82f633",
                  color: "#3b82f6",
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                }}
              />
              <div
                className="absolute left-5 px-2.5 py-1 rounded-full text-xs font-medium 
                backdrop-blur-sm shadow-sm"
                style={{
                  backgroundColor: "#3b82f6CC",
                  transform: "translateY(-50%)",
                }}
              >
                Jane Smith
              </div>
            </div>

            {/* Modern Floating Elements */}
            <div className="absolute right-[25%] top-[40%]">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-purple-500/5 to-blue-500/5 border border-white/20 backdrop-blur-sm rotate-12 animate-float" />
            </div>
            <div className="absolute left-[30%] bottom-[20%]">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-500/5 to-pink-500/5 border border-white/20 backdrop-blur-sm animate-float-delayed" />
            </div>

            {/* Flowchart Elements - adjusted position and size */}
            <div className="absolute left-[15%] top-[30%]">
              <svg
                className="w-[500px] h-[250px]"
                style={{ pointerEvents: "none" }}
              >
                {/* Connector Lines */}
                <path
                  d="M50,50 L150,50 M150,50 L250,50 M250,50 L350,50"
                  stroke="#8b5cf6"
                  strokeWidth="2"
                  className="animate-draw"
                  strokeDasharray="6 4"
                />
                <path
                  d="M150,50 L150,100 M250,50 L250,100"
                  stroke="#8b5cf6"
                  strokeWidth="2"
                  className="animate-draw-delayed"
                  strokeDasharray="6 4"
                />
              </svg>

              {/* Process Boxes - updated styling */}
              {[
                { x: "0px", text: "Research" },
                { x: "125px", text: "Design" },
                { x: "250px", text: "Develop" },
                { x: "375px", text: "Launch" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="absolute top-[30px] bg-white rounded-xl border-2 border-purple-100 px-5 py-2.5 shadow-sm hover:shadow-md transition-shadow"
                  style={{ left: item.x, transform: "translateX(-50%)" }}
                >
                  <span className="text-sm font-medium text-purple-700">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Modern Sticky Notes Group - adjusted position and styling */}
            <div className="absolute right-[5%] top-[10%] flex gap-6">
              {[
                {
                  color: "yellow",
                  title: "Design Tasks",
                  text: "Update component library 🎨",
                  rotate: "-2deg",
                },
                {
                  color: "green",
                  title: "In Progress",
                  text: "User testing sessions 🔍",
                  rotate: "2deg",
                },
                {
                  color: "blue",
                  title: "Done",
                  text: "API documentation ✅",
                  rotate: "-1deg",
                },
              ].map((note, i) => (
                <div
                  key={i}
                  className={`w-40 p-4 rounded-lg shadow-lg transform hover:-translate-y-1 transition-transform duration-200`}
                  style={{
                    transform: `rotate(${note.rotate})`,
                    backgroundColor: `var(--${note.color}-note-bg, ${note.color === "yellow" ? "#fef9c3" : note.color === "green" ? "#dcfce7" : "#dbeafe"})`,
                    borderColor: `var(--${note.color}-note-border, ${note.color === "yellow" ? "#fde047" : note.color === "green" ? "#86efac" : "#93c5fd"})`,
                    borderWidth: "1px",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-2 h-2 rounded-full bg-${note.color === "yellow" ? "yellow-400" : note.color === "green" ? "green-400" : "blue-400"}`}
                    />
                    <span className="text-sm font-medium">{note.title}</span>
                  </div>
                  <p className="text-sm font-kalam">{note.text}</p>
                </div>
              ))}
            </div>

            {/* Comments Section - adjusted position */}
            <div className="absolute bottom-[15%] right-[5%] space-y-4">
              {[
                {
                  user: "Alex",
                  color: "#3b82f6",
                  text: "Let's review this tomorrow",
                },
                {
                  user: "Emma",
                  color: "#22c55e",
                  text: "Added new components ✨",
                },
              ].map((comment, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 max-w-xs animate-fade-in"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                    style={{ backgroundColor: comment.color }}
                  >
                    {comment.user[0]}
                  </div>
                  <div className="bg-white rounded-lg p-2 shadow-sm border text-sm">
                    <p className="font-medium text-xs text-gray-500 mb-1">
                      {comment.user}
                    </p>
                    {comment.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Drawing Elements - adjusted curves */}
            <svg className="absolute inset-0 pointer-events-none">
              <path
                d="M150,350 Q200,300 250,350 T350,350"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2.5"
                className="animate-draw"
                strokeLinecap="round"
              />
              <path
                d="M200,400 Q250,350 300,400 T400,400"
                fill="none"
                stroke="#7c4dff"
                strokeWidth="2.5"
                className="animate-draw-delayed"
                strokeLinecap="round"
              />
            </svg>

            {/* Selection Area - adjusted position and styling */}
            <div className="absolute left-[20%] bottom-[20%] w-56 h-40">
              <div className="absolute inset-0 border-2 border-blue-400/40 rounded-xl bg-blue-50/10 backdrop-blur-sm">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                  Selection Area
                </div>
                {[
                  "-top -left",
                  "-top -right",
                  "-bottom -left",
                  "-bottom -right",
                ].map((position) => (
                  <div
                    key={position}
                    className={`absolute ${position} w-3 h-3 bg-white border-2 border-blue-400 rounded-full`}
                  />
                ))}
              </div>
            </div>

            {/* Modern Shape - repositioned */}
            <div className="absolute right-[30%] bottom-[30%] w-32 h-32">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-2xl transform rotate-12 border-2 border-purple-100">
                <div className="absolute inset-0 bg-white/30 backdrop-blur-sm rounded-2xl" />
              </div>
            </div>
          </div>

          {/* Enhanced Toolbar - adjusted styling */}
          <div className="absolute top-[50%] -translate-y-[50%] left-6">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-2.5 space-y-2.5 border border-gray-100">
              {[
                { icon: MousePointer2, active: true, tooltip: "Select" },
                { icon: Square, tooltip: "Rectangle" },
                { icon: Circle, tooltip: "Circle" },
                { icon: Type, tooltip: "Text" },
                { icon: Pencil, tooltip: "Draw" },
                { icon: StickyNote, tooltip: "Note" },
              ].map((tool, i) => (
                <div key={i} className="relative group">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:bg-gray-50 ${
                      tool.active
                        ? "bg-violet-50 text-violet-600"
                        : "text-gray-600"
                    }`}
                  >
                    <tool.icon className="w-5 h-5" />
                  </div>
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {tool.tooltip}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewWhiteboardHome;
