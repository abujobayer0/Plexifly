"use client";
import React, { forwardRef } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolButtonsProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  shortcut?: string;
  isActive?: boolean;
  isDisabled?: boolean;
}

// forwardRef + rest props let it act as a popover trigger.
export const ToolButton = forwardRef<HTMLButtonElement, ToolButtonsProps>(
  function ToolButton(
    { label, icon: Icon, shortcut, isActive, isDisabled, onClick, ...props },
    ref
  ) {
    return (
      <button
        ref={ref}
        {...props}
        disabled={isDisabled}
        onClick={onClick}
        className={cn(
          "h-9 w-9 rounded-lg flex items-center justify-center transition-colors duration-150",
          "group relative outline-none focus-visible:ring-2 focus-visible:ring-indigo-400",
          isActive
            ? "bg-indigo-500 text-white shadow-sm shadow-indigo-500/30"
            : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
          isDisabled && "opacity-40 cursor-not-allowed hover:bg-transparent"
        )}
        type="button"
        aria-label={label}
        aria-pressed={isActive}
      >
        <Icon className="h-[18px] w-[18px]" strokeWidth={isActive ? 2.25 : 2} />
        {/* Only single-key tool shortcuts get a corner badge. */}
        {shortcut?.length === 1 && (
          <span
            className={cn(
              "absolute bottom-0.5 right-1 text-[8px] font-semibold leading-none",
              isActive ? "text-white/70" : "text-neutral-400"
            )}
          >
            {shortcut}
          </span>
        )}
        <div className="pointer-events-none absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2 py-1 rounded-md bg-neutral-900 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
          {label}
          {shortcut && (
            <kbd className="px-1 rounded bg-white/15 text-[10px] font-sans text-white/80">
              {shortcut}
            </kbd>
          )}
        </div>
      </button>
    );
  }
);
