"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";

const NotFound = () => {
  const { isSignedIn } = useUser();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-purple-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-10 w-[600px] h-[600px]">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#8c52ff]/20 to-purple-300/20 rounded-full blur-[120px] animate-float-slow" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#8c52ff]/10 to-blue-300/10 rounded-full blur-[120px] animate-float-reverse" />
        </div>
        <div className="absolute bottom-20 -right-10 w-[600px] h-[600px]">
          <div className="absolute inset-0 bg-gradient-to-bl from-purple-200/20 to-blue-300/20 rounded-full blur-[120px] animate-float" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#7c4dff]/10 to-purple-300/10 rounded-full blur-[120px] animate-float-slow" />
        </div>

        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-24 h-24 border-2 border-purple-500/20 rounded-full animate-spin-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 border-2 border-blue-500/20 rounded-full animate-reverse-spin" />
          <div className="absolute top-1/3 right-1/4 text-xs font-mono text-purple-500/30 animate-float">
            &lt;404 /&gt;
          </div>
          <div className="absolute bottom-1/3 left-1/4 text-xs font-mono text-blue-500/30 animate-float-slow">
            {"{page: null}"}
          </div>
        </div>
      </div>

      <div className="relative text-center px-6 z-10">
        <div className="inline-block animate-fade-in mb-8">
          <div className="relative">
            <span className="absolute inset-0 blur-xl bg-gradient-to-r from-blue-400/40 to-purple-500/40 rounded-full animate-pulse" />
            <span className="relative px-6 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-50 to-purple-50 text-purple-900 border border-purple-100/50 shadow-lg shadow-purple-500/20 backdrop-blur-sm">
              404 Error
            </span>
          </div>
        </div>

        <h1 className="text-6xl sm:text-7xl font-bold tracking-tight font-display mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8c52ff] to-[#5e17eb] animate-gradient">
            Page Not Found
          </span>
        </h1>

        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-12">
          Sorry, we couldn't find the page you're looking for. It might have
          been moved or deleted.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
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
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
                Return Home
              </span>
            </Button>
          </Link>
          {isSignedIn && (
            <Link href="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="relative group px-8 py-6 text-base font-medium
                         backdrop-blur-sm bg-white/50 hover:bg-white/80 border-2 border-purple-100
                         hover:border-purple-200 transition-all duration-300"
              >
                <span className="relative flex items-center gap-2">
                  <span
                    className="bg-clip-text text-transparent bg-gradient-to-r 
                               from-purple-700 to-purple-900 font-medium"
                  >
                    Go to Dashboard
                  </span>
                </span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
