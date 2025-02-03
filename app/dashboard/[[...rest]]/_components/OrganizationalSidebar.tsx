"use client";

import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { OrganizationSwitcher } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Star } from "lucide-react";
import { useSearchParams } from "next/navigation";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export const OrganizationalSidebar = () => {
  const searchParams = useSearchParams();
  const favorites = searchParams.get("favorites");

  return (
    <div className="hidden lg:flex flex-col space-y-6 w-[280px] pl-5 pt-5 border-r border-purple-100/20">
      <Link href="/dashboard" className="flex items-center gap-x-2.5 group">
        <div className="relative">
          <div className="absolute inset-0 bg-purple-500/20 rounded-lg blur-lg group-hover:bg-purple-500/30 transition-all duration-300" />
          <Image
            src="/logo.svg"
            alt="Logo"
            priority
            width={40}
            height={40}
            className="relative"
          />
        </div>
        <span
          className={cn(
            "font-semibold text-2xl bg-clip-text text-transparent bg-gradient-to-r",
            "from-gray-900 to-gray-600 group-hover:from-purple-600 group-hover:to-purple-900",
            "transition-all duration-300",
            font.className
          )}
        >
          Board
        </span>
      </Link>

      <OrganizationSwitcher
        hidePersonal
        appearance={{
          elements: {
            rootBox: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            },
            organizationSwitcherTrigger: {
              padding: "12px",
              width: "100%",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              backgroundColor: "white",
              transition: "all 0.2s",
              "&:hover": {
                borderColor: "#c7d2fe",
                backgroundColor: "#faf5ff",
              },
            },
          },
        }}
      />

      <div className="space-y-2 w-full">
        <Button
          asChild
          variant={favorites ? "ghost" : "secondary"}
          className={cn(
            "w-full justify-start gap-2 group hover:bg-purple-50 transition-colors duration-200",
            !favorites && "bg-purple-50 hover:bg-purple-100/80"
          )}
          size="lg"
        >
          <Link href="/dashboard">
            <LayoutDashboard className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium">Team Boards</span>
          </Link>
        </Button>

        <Button
          asChild
          variant={favorites ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start gap-2 group hover:bg-purple-50 transition-colors duration-200",
            favorites && "bg-purple-50 hover:bg-purple-100/80"
          )}
          size="lg"
        >
          <Link href={{ pathname: "/dashboard", query: { favorites: true } }}>
            <Star className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium">Favorite Boards</span>
          </Link>
        </Button>
      </div>

      <div className="absolute bottom-5  z-10 left-5 flex justify-end right-5">
        <div className="p-4 rounded-lg bg-purple-50/50 border border-purple-100">
          <div className="flex items-center gap-x-2">
            <div className="p-2 rounded-md bg-purple-100">
              <Star className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-purple-900">Pro Features</p>
              <p className="text-purple-600">Upgrade for more features</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
