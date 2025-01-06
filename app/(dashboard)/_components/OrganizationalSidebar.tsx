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
    <div className="hidden lg:flex  flex-col space-y-6 w-[260px] pl-5 pt-5">
      <Link href={"/"}>
        <div className="flex items-center gap-x-1 ">
          <Image src="/logo.svg" alt="Logo" width={40} height={40} />
          <span className={cn("font-semibold text-2xl ", font.className)}>
            Board
          </span>
        </div>
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
              padding: "6px",
              width: "100%",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              justifyContent: "space-between",
              backgroundColor: "white",
            },
          },
        }}
      />
      <div className="space-y-1 w-full">
        <Button
          asChild
          className="font-normal justify-start px-2 w-full"
          size={"lg"}
          variant={favorites ? "ghost" : "secondary"}
        >
          <Link href={"/"}>
            <LayoutDashboard className="w-4 h-4 mr-2 " />
            Team Boards
          </Link>
        </Button>
        <Button
          asChild
          className="font-normal justify-start px-2 w-full"
          size={"lg"}
          variant={favorites ? "secondary" : "ghost"}
        >
          <Link href={{ pathname: "/", query: { favorites: true } }}>
            <Star className="w-4 h-4 mr-2 " />
            Favorite Boards
          </Link>
        </Button>
      </div>
    </div>
  );
};
