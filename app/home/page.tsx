import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Github,
  Pencil,
  Shapes,
  StickyNote,
  Type,
  Users,
  Layers,
  Undo2,
  Star,
  KeyRound,
  Database,
  Plus,
  Minus,
  Search,
  CheckCircle2,
  Circle,
  Code2,
  Rocket,
  Clock,
  MousePointer2,
  Square,
} from "lucide-react";

const features = [
  {
    title: "Advanced Drawing Tools",
    description:
      "Complete toolkit with Text, Shapes, Sticky Notes & Pencil tools for all your creative needs.",
    icon: Pencil,
  },
  {
    title: "Smart Layering",
    description:
      "Organize your work with professional layering system. Move elements front to back with ease.",
    icon: Layers,
  },
  {
    title: "Real-time Collaboration",
    description:
      "Work together seamlessly with your team. See changes instantly as they happen.",
    icon: Users,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-purple-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full border-b bg-white/50 backdrop-blur-sm z-50">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-x-2">
            <img src="/logo.png" alt="Plexifly Logo" className="h-8 w-8" />
            <span className="font-semibold text-xl">Plexifly</span>
          </Link>
          <div className="flex items-center gap-x-2">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm" className="bg-[#8c52ff] hover:bg-[#7c4dff]">
                Get Plexifly free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 pt-24 relative overflow-hidden">
        {/* Enhanced floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-tr from-[#8c52ff]/20 to-purple-300/20 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-bl from-purple-200/30 to-blue-300/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-gradient-to-r from-blue-200/30 to-purple-300/20 rounded-full blur-3xl animate-float-fast" />
        </div>

        <div className="container mx-auto px-4 relative">
          {/* Hero Content */}
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-6xl sm:text-7xl font-bold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8c52ff] to-[#5e17eb] animate-gradient">
                The Ultimate
              </span>
              <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-[#5e17eb] to-[#8c52ff] animate-gradient-reverse">
                Whiteboard Platform
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Create, collaborate, and bring your ideas to life with our
              powerful digital whiteboard. Built for modern teams.
            </p>

            {/* Enhanced Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              {[
                { text: "Next.js 14", icon: "⚡" },
                { text: "Real-time Sync", icon: "🔄" },
                { text: "TailwindCSS", icon: "🎨" },
                { text: "Authentication", icon: "🔒" },
              ].map((pill) => (
                <span
                  key={pill.text}
                  className="px-4 py-2 rounded-full bg-white/80 text-purple-800 font-medium border border-purple-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-1.5"
                >
                  <span className="text-base">{pill.icon}</span>
                  {pill.text}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center justify-center gap-x-4">
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#8c52ff] to-[#7c4dff] hover:opacity-90 transition-all duration-200 shadow-lg shadow-purple-500/25"
                >
                  Start Whiteboarding
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link
                href="https://github.com/yourusername/plexifly"
                target="_blank"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="backdrop-blur-sm bg-white/50 hover:bg-white/80 transition-all duration-200"
                >
                  <Github className="mr-2 h-4 w-4" />
                  Star on GitHub
                </Button>
              </Link>
            </div>
          </div>

          {/* Interactive Demo Preview */}
          <div className="mt-20 relative mx-auto max-w-5xl">
            <div className="rounded-xl border bg-white/50 backdrop-blur-sm shadow-2xl shadow-purple-500/10 overflow-hidden">
              {/* Window Controls */}
              <div className="bg-gray-50/80 border-b px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="text-sm text-gray-500 ml-2 flex items-center gap-1">
                    <Code2 className="w-4 h-4" /> Untitled Board
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>Auto-saved</span>
                  </div>
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-purple-400 flex items-center justify-center text-white text-xs">
                      A
                    </div>
                    <div className="w-6 h-6 rounded-full bg-blue-400 flex items-center justify-center text-white text-xs">
                      B
                    </div>
                    <div className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center text-white text-xs">
                      +2
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Canvas Area */}
              <div className="aspect-video bg-white relative">
                {/* Animated Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:24px_24px]">
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-50/50 to-transparent" />
                </div>

                {/* Toolbar */}
                <div className="absolute top-[50%] -translate-y-[50%] left-4 flex flex-col gap-2">
                  <div className="bg-white rounded-xl shadow-lg p-2 flex flex-col gap-1">
                    {[
                      { icon: MousePointer2, active: true, color: "violet" },
                      { icon: Square, color: "blue" },
                      { icon: Circle, color: "green" },
                      { icon: Type, color: "orange" },
                      { icon: Pencil, color: "red" },
                    ].map((tool, i) => (
                      <div
                        key={i}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:bg-gray-50 ${
                          tool.active
                            ? "bg-violet-50 text-violet-600"
                            : "text-gray-600"
                        }`}
                      >
                        <tool.icon className="w-5 h-5" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Demo Elements */}
                <div className="absolute inset-0 p-8">
                  {/* Animated Elements */}
                  <svg
                    className="absolute w-full h-full"
                    style={{ pointerEvents: "none" }}
                  >
                    <path
                      d="M100,100 C150,50 200,150 250,100"
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="2"
                      className="animate-draw"
                    />
                  </svg>

                  {/* Rectangle with Gradient */}
                  <div
                    className="absolute left-[20%] top-[30%] w-64 h-40 rounded-lg shadow-lg overflow-hidden group hover:-translate-y-0.5 transition-all duration-200"
                    style={{ transform: "rotate(-2deg)" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-100/40 to-blue-50/40" />
                    <div className="absolute inset-0 border-2 border-purple-200/50 rounded-lg" />
                  </div>

                  {/* Modern Sticky Note */}
                  <div
                    className="absolute right-[25%] top-[25%] w-56 bg-yellow-50/90 p-4 rounded-xl shadow-xl border border-yellow-100"
                    style={{ transform: "rotate(1deg)" }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-yellow-400" />
                      <span className="text-sm font-medium text-yellow-700">
                        Quick Task
                      </span>
                    </div>
                    <p className="text-sm text-yellow-800 font-kalam leading-relaxed">
                      Design system updates needed for the new components 🎨
                    </p>
                  </div>

                  {/* Text Element */}
                  <div className="absolute left-[35%] top-[20%] transform -rotate-1">
                    <div className="text-4xl font-kalam bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
                      Project Vision
                    </div>
                  </div>

                  {/* Modern Selection Box */}
                  <div className="absolute left-[20%] top-[30%] w-64 h-40 border-2 border-blue-400/50 rounded-lg pointer-events-none">
                    <div className="absolute inset-0 bg-blue-50/20 rounded-lg" />
                    {/* Corner Handles */}
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

                  {/* Cursor Presence */}
                  {[
                    {
                      color: "#22c55e",
                      x: "75%",
                      y: "40%",
                      name: "Emma",
                      action: "typing...",
                    },
                    { color: "#3b82f6", x: "45%", y: "65%", name: "Alex" },
                  ].map((cursor, i) => (
                    <div
                      key={i}
                      className="absolute transition-all duration-300 ease-out"
                      style={{
                        left: cursor.x,
                        top: cursor.y,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <MousePointer2
                          className="w-5 h-5"
                          style={{ color: cursor.color }}
                        />
                        <div
                          className="px-2 py-1 rounded-full text-xs text-white shadow-md flex items-center gap-1.5"
                          style={{ backgroundColor: cursor.color }}
                        >
                          {cursor.name}
                          {cursor.action && (
                            <span className="text-[10px] opacity-75">
                              {cursor.action}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-gradient-to-tr from-purple-200/30 to-blue-200/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -left-8 -top-8 w-64 h-64 bg-gradient-to-bl from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse" />
          </div>

          {/* Feature Grid */}
          <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-8 rounded-2xl border bg-white/50 backdrop-blur-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-[#8c52ff]/10 to-[#7c4dff]/10 flex items-center justify-center mb-6 ring-1 ring-purple-500/20">
                  <feature.icon className="h-7 w-7 text-[#8c52ff]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Feature List Section */}
          <div className="mt-32 text-center space-y-12">
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#8c52ff] to-[#7c4dff]">
              Everything you need to collaborate
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: Pencil, text: "Drawing Tools" },
                { icon: Shapes, text: "Shape Library" },
                { icon: StickyNote, text: "Sticky Notes" },
                { icon: Type, text: "Text Editor" },
                { icon: Layers, text: "Layer Control" },
                { icon: Undo2, text: "Undo/Redo" },
                { icon: Star, text: "Favorites" },
                { icon: Users, text: "Team Sharing" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-3 p-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                    <item.icon className="h-6 w-6 text-purple-600" />
                  </div>
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-24 text-center space-y-4">
            <h2 className="text-3xl font-bold">Trusted by teams worldwide</h2>
            <div className="flex flex-wrap justify-center gap-8 opacity-70">
              {/* Add your client logos here */}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-24 mb-16 text-center space-y-4">
            <h2 className="text-3xl font-bold">Ready to get started?</h2>
            <p className="text-muted-foreground">
              Join thousands of teams already using Plexifly
            </p>
            <Link href="/sign-up">
              <Button size="lg" className="bg-[#8c52ff] hover:bg-[#7c4dff]">
                Try Plexifly for free
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-8 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-x-2">
              <img src="/logo.svg" alt="Plexifly Logo" className="h-6 w-6" />
              <span className="font-semibold">Plexifly</span>
            </div>
            <div className="flex items-center gap-x-4 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-foreground">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
