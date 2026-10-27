"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { OrganizationSwitcher } from "@clerk/nextjs";
import { LayoutGrid, LayoutTemplate, Star } from "lucide-react";
import { useSearchParams } from "next/navigation";

const NAV_ITEMS = [
  { label: "Team boards", icon: LayoutGrid, href: "/dashboard", favorites: false },
  {
    label: "Favorites",
    icon: Star,
    href: "/dashboard?favorites=true",
    favorites: true,
  },
];

export const OrganizationalSidebar = () => {
  const searchParams = useSearchParams();
  const favorites = Boolean(searchParams.get("favorites"));

  return (
    <div className="hidden lg:flex w-[260px] shrink-0 flex-col border-r border-zinc-200/80 bg-white px-4 py-5">
      <Link href="/" className="flex items-center gap-x-2.5 px-2">
        <Image src="/logo.svg" alt="" priority width={30} height={30} />
        <span className="text-lg font-bold tracking-tight">Plexifly</span>
      </Link>

      <div className="mt-6">
        <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
          Workspace
        </p>
        <OrganizationSwitcher
          hidePersonal
          appearance={{
            elements: {
              rootBox: {
                display: "flex",
                width: "100%",
              },
              organizationSwitcherTrigger: {
                padding: "8px 10px",
                width: "100%",
                borderRadius: "12px",
                border: "1px solid #e4e4e7",
                backgroundColor: "white",
                justifyContent: "space-between",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                "&:hover": {
                  backgroundColor: "#fafafa",
                  borderColor: "#d4d4d8",
                },
              },
            },
          }}
        />
      </div>

      <nav className="mt-6 space-y-1">
        {NAV_ITEMS.map(({ label, icon: Icon, href, favorites: isFavorites }) => {
          const isActive = favorites === isFavorites;
          return (
            <Link
              key={label}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              )}
            >
              <Icon
                className={cn(
                  "h-[18px] w-[18px]",
                  isActive ? "text-indigo-600" : "text-zinc-400"
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-zinc-200/80 bg-gradient-to-b from-zinc-50 to-white p-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 ring-1 ring-inset ring-indigo-100">
          <LayoutTemplate className="h-4 w-4" />
        </div>
        <p className="mt-3 text-sm font-semibold">Start from a template</p>
        <p className="mt-1 text-[13px] leading-relaxed text-zinc-500">
          Open any board and pick Kanban, Roadmap, Flowchart and more from the
          toolbar.
        </p>
      </div>
    </div>
  );
};
