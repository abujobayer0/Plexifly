"use client";

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
  Globe,
  Play,
  Shield,
  Zap,
  Clock,
  Twitter,
  Linkedin,
  PenTool,
} from "lucide-react";
import PreviewWhiteboardHome from "@/components/home/preview-whiteboard-home";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { GitStarButton } from "@/components/eu/github-start-button";
import MorphingText from "@/components/eu/morphingtext";

const NAVIGATION_ITEMS = ["Features", "Solutions", "Pricing", "Resources"];

const FEATURE_ITEMS = [
  { icon: Pencil, text: "Drawing Tools", desc: "Precise tools for every need" },
  {
    icon: Shapes,
    text: "Shape Library",
    desc: "Ready-to-use shape collection",
  },
  {
    icon: StickyNote,
    text: "Sticky Notes",
    desc: "Quick thoughts and reminders",
  },
  { icon: Type, text: "Text Editor", desc: "Rich text formatting" },
  { icon: Layers, text: "Layer Control", desc: "Professional organization" },
  { icon: Undo2, text: "Version History", desc: "Track all changes" },
  { icon: Star, text: "Smart Features", desc: "AI-powered assistance" },
  { icon: Users, text: "Team Sharing", desc: "Seamless collaboration" },
];

const TRUST_METRICS = [
  {
    metric: "10,000+",
    label: "Active Teams",
    icon: Users,
    color: "from-blue-500 to-purple-500",
  },
  {
    metric: "99.9%",
    label: "Uptime SLA",
    icon: Star,
    color: "from-green-500 to-emerald-500",
  },
  {
    metric: "2M+",
    label: "Projects Created",
    icon: Layers,
    color: "from-amber-500 to-orange-500",
  },
  {
    metric: "150+",
    label: "Countries",
    icon: Globe,
    color: "from-purple-500 to-pink-500",
  },
];

const FOOTER_SECTIONS = [
  {
    title: "Product",
    links: ["Features", "Integrations", "Pricing", "Changelog"],
  },
  { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
  {
    title: "Resources",
    links: ["Documentation", "Help Center", "API", "Status"],
  },
];

export default function HomePage() {
  const { isSignedIn } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";

    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  const renderNavLink = (item: string) => (
    <Link
      key={item}
      href="/dashboard"
      className="relative px-4 py-2 text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors duration-200 group"
    >
      {item}
      <span className="absolute inset-x-2 -bottom-px h-px bg-gradient-to-r from-purple-500/0 via-purple-500/70 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </Link>
  );

  const renderFeatureCard = ({
    icon: Icon,
    text,
    desc,
  }: (typeof FEATURE_ITEMS)[0]) => (
    <div
      key={desc}
      className="group relative p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-purple-100/50 hover:border-purple-300/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
    >
      <div className="relative space-y-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Icon className="h-6 w-6 text-purple-600" />
        </div>
        <div className="space-y-2">
          <span className="font-semibold block text-gray-900">{text}</span>
          <span className="text-sm text-gray-500">{desc}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-purple-50 scroll-smooth">
      <nav className="fixed top-0 w-full border-b border-purple-100/20 bg-white/80 backdrop-blur-md z-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-x-2.5 group">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500/20 rounded-lg blur-lg group-hover:bg-purple-500/30 transition-all duration-300" />
                <img
                  src="/logo.svg"
                  alt="Plexifly Logo"
                  className="h-9 w-9 relative"
                />
              </div>
              <span className="font-semibold text-xl font-display bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 group-hover:from-purple-600 group-hover:to-purple-900 transition-all duration-300">
                Plexifly
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-x-1">
              {NAVIGATION_ITEMS.map(renderNavLink)}
            </div>

            <div className="flex items-center gap-x-3">
              {!isSignedIn && (
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="font-medium relative group"
                  >
                    Log in
                    <span className="absolute inset-x-2 -bottom-px h-px bg-gradient-to-r from-purple-500/0 via-purple-500/70 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </Link>
              )}
              <Link href="/dashboard">
                <Button
                  size="sm"
                  className="relative group bg-[#8c52ff] hover:bg-[#7c4dff] font-medium px-6"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-md" />
                  <span className="relative flex items-center gap-x-1">
                    {isSignedIn ? "Dashboard" : "Get Plexifly free"}
                    {isSignedIn ? (
                      <PenTool className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-300" />
                    ) : (
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-300" />
                    )}
                  </span>
                </Button>
              </Link>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="ml-2 p-1.5 rounded-lg text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-colors duration-200 md:hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      isMobileMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div
          className={`md:hidden absolute top-full left-0 right-0 bg-white border-b border-purple-100/20 transition-all duration-300 ${
            isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <div className="container mx-auto px-6 py-4">
            <div className="flex flex-col space-y-2">
              {NAVIGATION_ITEMS.map((item) => (
                <Link
                  key={item}
                  href="/dashboard"
                  className="px-4 py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
              {!isSignedIn && (
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log in
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
      </nav>

      <div className="flex-1 pt-32 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-10 w-[600px] h-[600px]">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#8c52ff]/20 to-purple-300/20 rounded-full blur-[120px] animate-float-slow" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#8c52ff]/10 to-blue-300/10 rounded-full blur-[120px] animate-float-reverse" />
          </div>
          <div className="absolute top-40 -right-20 w-[700px] h-[700px]">
            <div className="absolute inset-0 bg-gradient-to-bl from-purple-200/20 to-blue-300/20 rounded-full blur-[120px] animate-float" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#7c4dff]/10 to-purple-300/10 rounded-full blur-[120px] animate-float-slow" />
          </div>

          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-24 h-24 border-2 border-purple-500/20 rounded-full animate-spin-slow" />
            <div className="absolute top-40 right-20 w-32 h-32 border-2 border-blue-500/20 rounded-full animate-reverse-spin" />

            <div className="absolute top-60 left-1/4 w-40 h-24">
              <div className="absolute inset-0 border-2 border-purple-500/20 rounded-xl animate-float" />
              <div className="absolute inset-0 border-2 border-purple-500/20 rounded-xl animate-float delay-100 rotate-3" />
            </div>

            <svg
              className="absolute top-32 right-1/4 w-24 h-24 animate-float"
              viewBox="0 0 100 100"
            >
              <line
                x1="10"
                y1="50"
                x2="90"
                y2="50"
                stroke="rgba(140, 82, 255, 0.2)"
                strokeWidth="2"
                strokeDasharray="8 8"
                className="animate-dash"
              />
            </svg>

            <div className="absolute bottom-40 right-20 text-sm font-light text-purple-500/30 animate-float-slow">
              collaborate
            </div>
            <div className="absolute top-32 left-1/3 text-sm font-light text-blue-500/30 animate-float">
              create
            </div>

            <svg
              className="absolute bottom-20 left-20 w-16 h-16 animate-float"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="rgba(140, 82, 255, 0.2)"
                strokeWidth="2"
                className="animate-draw"
              />
            </svg>
            <svg
              className="absolute top-40 right-1/3 w-20 h-20 animate-float-reverse"
              viewBox="0 0 100 100"
            >
              <rect
                x="20"
                y="20"
                width="60"
                height="60"
                fill="none"
                stroke="rgba(99, 102, 241, 0.2)"
                strokeWidth="2"
                className="animate-draw-rect"
              />
            </svg>

            <div className="absolute top-20 right-1/4 text-xs font-mono text-purple-500/30 animate-float">
              &lt;canvas /&gt;
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <div className="inline-block animate-fade-in mb-4">
              <div className="relative">
                <span className="absolute inset-0 blur-xl bg-gradient-to-r from-blue-400/40 to-purple-500/40 rounded-full animate-pulse" />
                <span className="relative px-6 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-50 to-purple-50 text-purple-900 border border-purple-100/50 shadow-lg shadow-purple-500/20 backdrop-blur-sm flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Enterprise-Grade Collaboration Platform
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </span>
              </div>
            </div>

            <h1 className="text-6xl sm:text-7xl font-bold tracking-tight font-display">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8c52ff] to-[#5e17eb] animate-gradient">
                Elevate Your
              </span>
              <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-[#5e17eb] to-[#8c52ff] animate-gradient-reverse">
                Team Collaboration
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Transform ideas into reality with our enterprise-ready whiteboard
              platform. Seamless collaboration, powerful features, and unmatched
              security for modern teams.
            </p>

            <div className="flex flex-wrap justify-center gap-3 my-6">
              {[
                { text: "Enterprise Security", icon: "🔒" },
                { text: "Real-time Sync", icon: "⚡" },
                { text: "Smart Features", icon: "🧠" },
                { text: "24/7 Support", icon: "💬" },
              ].map((pill) => (
                <span
                  key={pill.text}
                  className="px-4 py-2 rounded-full bg-white/80 text-purple-800 font-medium border border-purple-100 shadow-sm 
                           hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-1.5
                           hover:border-purple-300/50 hover:bg-white/90"
                >
                  <span className="text-base">{pill.icon}</span>
                  {pill.text}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="relative group overflow-hidden bg-[#8c52ff] hover:bg-[#7c4dff] transition-all duration-300
                             shadow-lg shadow-purple-500/25 px-8 py-6 text-base font-medium"
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-transparent 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <span className="relative flex items-center gap-2">
                    Start Free Trial
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
              </Link>
              <GitStarButton />
            </div>

            <div className="pt-6 flex flex-wrap items-center justify-center gap-6">
              {[
                { icon: Shield, text: "SOC 2 Type II Certified" },
                { icon: Zap, text: "99.9% Uptime SLA" },
                { icon: Clock, text: "24/7 Priority Support" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 hover:text-purple-600 transition-colors duration-300"
                >
                  <item.icon className="h-4 w-4" />
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          <PreviewWhiteboardHome />

          <div className="mt-32 relative">
            <div className="w-full mx-auto px-4 mb-20">
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full">
                  <Shapes className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-600">
                    Features
                  </span>
                </div>
              </div>

              <div className="space-y-28">
                <MorphingText
                  texts={[
                    "Everything you need",
                    "to bring ideas to life",
                    "to empower your team",
                    "for seamless collaboration",
                    "to drive innovation",
                    "to scale globally",
                    "for enterprise success",
                  ]}
                  className="text-[#8c52ff]"
                />

                <p className="text-xl text-center text-gray-500 leading-relaxed">
                  Powerful tools and features designed to enhance your
                  team&apos;s creativity and productivity.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
                {FEATURE_ITEMS.map((item) => renderFeatureCard(item))}
              </div>
            </div>

            <div className="py-20 relative">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -left-40 top-20 w-[500px] h-[500px]">
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-blue-500/10 to-transparent rounded-full blur-3xl animate-float-slow" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#8c52ff]/5 via-blue-500/5 to-transparent rounded-full blur-3xl animate-float-reverse" />
                </div>
                <div className="absolute -right-40 bottom-20 w-[500px] h-[500px]">
                  <div className="absolute inset-0 bg-gradient-to-bl from-purple-500/10 via-pink-500/10 to-transparent rounded-full blur-3xl animate-float" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#7c4dff]/5 via-purple-500/5 to-transparent rounded-full blur-3xl animate-float-slow" />
                </div>

                <div className="absolute inset-0">
                  <svg
                    className="absolute top-20 left-1/4 w-24 h-24 animate-float"
                    viewBox="0 0 100 100"
                  >
                    <line
                      x1="10"
                      y1="50"
                      x2="90"
                      y2="50"
                      stroke="rgba(140, 82, 255, 0.2)"
                      strokeWidth="2"
                      strokeDasharray="8 8"
                      className="animate-dash"
                    />
                  </svg>

                  <div className="absolute top-40 right-1/4 w-32 h-32 border border-purple-500/20 rounded-full animate-spin-slow" />
                  <div className="absolute bottom-40 left-1/3 w-24 h-24 border border-blue-500/20 rounded-full animate-reverse-spin" />

                  <div className="absolute top-1/4 right-1/4 text-xs font-mono text-purple-500/30 animate-float">
                    &lt;trust /&gt;
                  </div>
                  <div className="absolute bottom-1/4 left-1/4 text-xs font-mono text-blue-500/30 animate-float-slow">
                    {"{success: true}"}
                  </div>
                </div>
              </div>

              <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col items-center text-center space-y-4 mb-16">
                  <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full mb-4">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-600">
                      Trusted Globally
                    </span>
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-bold max-w-2xl">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                      Empowering 10,000+ teams worldwide
                    </span>
                  </h2>
                  <p className="text-xl text-gray-500 max-w-2xl">
                    Join the community of innovative teams using Plexifly to
                    transform their collaboration
                  </p>
                </div>

                <div className="relative py-16">
                  <div className="absolute left-0 top-0 bottom-0 w-24 z-10" />
                  <div className="absolute right-0 top-0 bottom-0 w-24  to-transparent z-10" />

                  <div className="flex gap-12 items-center justify-center overflow-hidden">
                    <div className="flex gap-12 items-center animate-scroll-left">
                      {[
                        {
                          name: "Acme Corp",
                          gradient: "from-blue-500 to-purple-500",
                        },
                        {
                          name: "TechFlow",
                          gradient: "from-purple-500 to-pink-500",
                        },
                        {
                          name: "InnovateLabs",
                          gradient: "from-indigo-500 to-blue-500",
                        },
                        {
                          name: "FutureAI",
                          gradient: "from-violet-500 to-purple-500",
                        },
                        {
                          name: "QuantumTech",
                          gradient: "from-fuchsia-500 to-pink-500",
                        },
                        {
                          name: "MetaVerse",
                          gradient: "from-purple-500 to-indigo-500",
                        },
                      ].map((company, index) => (
                        <div
                          key={index}
                          className="relative w-40 h-20 rounded-xl bg-white/70 backdrop-blur-sm 
                                     border border-gray-100 p-4 flex items-center justify-center
                                     group hover:border-purple-200 hover:bg-white/90
                                     transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                        >
                          <div
                            className={`absolute inset-0 bg-gradient-to-r ${company.gradient} 
                                          opacity-0 group-hover:opacity-[0.02] transition-opacity 
                                          duration-300 rounded-xl`}
                          />

                          <span className="relative font-medium text-base">
                            <span
                              className="block text-gray-800 group-hover:text-transparent 
                                            group-hover:bg-clip-text group-hover:bg-gradient-to-r 
                                            group-hover:from-purple-600 group-hover:to-blue-600
                                            transition-all duration-300"
                            >
                              {company.name}
                            </span>
                          </span>

                          <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden">
                            <div
                              className="absolute -right-4 -top-4 w-8 h-8 
                                            bg-gradient-to-r from-purple-500/10 to-blue-500/10 
                                            rotate-45 transform origin-bottom-left
                                            opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-24">
                  {TRUST_METRICS.map((item, index) => (
                    <div
                      key={index}
                      className="group relative p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-100 hover:border-purple-200 transition-all duration-300"
                    >
                      <div
                        className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl"
                        style={{
                          backgroundImage: `linear-gradient(to right, ${item.color})`,
                        }}
                      />
                      <div className="relative space-y-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <item.icon className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-900">
                          {item.metric}
                        </div>
                        <div className="text-sm text-gray-600">
                          {item.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="relative py-24">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -left-20 top-1/4 w-96 h-96">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-blue-500/10 rounded-full blur-3xl animate-float-slow" />
                <div className="absolute inset-0 bg-gradient-to-bl from-[#8c52ff]/10 to-blue-300/10 rounded-full blur-3xl animate-float-reverse" />
              </div>

              <div className="absolute top-20 right-1/4 w-16 h-16 border-2 border-purple-500/20 rounded-full animate-spin-slow" />
              <div className="absolute bottom-20 left-1/4 w-20 h-20 border-2 border-blue-500/20 rounded animate-float" />

              <div className="absolute top-1/4 right-1/3">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="animate-float"
                >
                  <path
                    d="M7 2l10 10-10 10"
                    stroke="rgba(140, 82, 255, 0.2)"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute -right-1 -top-1 w-3 h-3 bg-purple-500/20 rounded-full animate-ping" />
              </div>

              <div className="absolute top-1/3 left-20 text-xs font-mono text-purple-500/30 animate-float-slow">
                &lt;collaboration /&gt;
              </div>
              <div className="absolute bottom-1/3 right-20 text-xs font-mono text-blue-500/30 animate-float">
                {"{innovation: true}"}
              </div>

              <svg
                className="absolute bottom-20 right-1/4 w-24 h-24 animate-float-reverse"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="rgba(140, 82, 255, 0.2)"
                  strokeWidth="2"
                  strokeDasharray="8 8"
                  className="animate-dash"
                />
              </svg>
              <svg
                className="absolute top-24 left-1/4 w-20 h-20 animate-float"
                viewBox="0 0 100 100"
              >
                <rect
                  x="20"
                  y="20"
                  width="60"
                  height="60"
                  fill="none"
                  stroke="rgba(99, 102, 241, 0.2)"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                  className="animate-draw-rect"
                />
              </svg>

              <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent animate-pulse" />
              <div className="absolute bottom-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent animate-pulse delay-150" />
            </div>

            <div className="max-w-4xl mx-auto px-4 text-center relative">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full mb-8">
                <Star className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-600">
                  Get Started Free
                </span>
              </div>

              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8c52ff] to-[#5e17eb]">
                  Ready to transform
                </span>
                <br />
                <span className="text-gray-900">
                  your team&apos;s collaboration?
                </span>
              </h2>

              <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
                Join thousands of teams already using Plexifly to bring their
                ideas to life. Start your free trial today.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="relative group overflow-hidden bg-[#8c52ff] hover:bg-[#7c4dff] px-8 py-6 text-base font-medium
                               shadow-lg shadow-purple-500/25 w-full sm:w-auto"
                  >
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-transparent 
                                 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <span className="relative flex items-center gap-2">
                      Start Free Trial
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    variant="outline"
                    className="relative group px-8 py-6 text-base font-medium border-2 border-purple-100
                               hover:border-purple-200 w-full sm:w-auto backdrop-blur-sm"
                  >
                    <span className="relative flex items-center gap-2">
                      <Play className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                      Schedule Demo
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="relative border-t bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <img src="/logo.svg" alt="Plexifly Logo" className="h-8 w-8" />
                <span className="font-semibold text-xl">Plexifly</span>
              </div>
              <p className="text-gray-500 mb-6 max-w-md">
                Empowering teams to create, collaborate, and innovate together.
                Build the future of work with our enterprise-grade collaboration
                platform.
              </p>
              <div className="flex items-center gap-4">
                {[Twitter, Github, Linkedin].map((Icon, index) => (
                  <Link
                    key={index}
                    href="/dashboard"
                    className="text-gray-400 hover:text-purple-600 transition-colors p-2 hover:bg-purple-50 rounded-full"
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                ))}
              </div>
            </div>

            {FOOTER_SECTIONS.map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold text-gray-900 mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href="/dashboard"
                        className="text-gray-500 hover:text-purple-600 transition-colors text-sm"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-500">
                © {new Date().getFullYear()} Plexifly. All rights reserved.
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                {["Privacy", "Terms", "Cookies"].map((item) => (
                  <Link
                    key={item}
                    href="/dashboard"
                    className="hover:text-purple-600 transition-colors"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
