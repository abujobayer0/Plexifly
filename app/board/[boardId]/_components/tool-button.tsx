"use client";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolButtonsProps {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  isActive?: boolean;
  isDisabled?: boolean;
}

export const ToolButton = ({
  label,
  icon: Icon,
  isActive,
  isDisabled,
  onClick,
}: ToolButtonsProps) => {
  return (
    <button
      disabled={isDisabled}
      onClick={onClick}
      className={cn(
        "p-2 rounded-lg flex items-center justify-center hover:bg-neutral-100 transition-all duration-200",
        "group relative",
        isActive && "bg-neutral-200 hover:bg-neutral-200",
        isDisabled && "opacity-50 cursor-not-allowed"
      )}
      type="button"
      title={label}
    >
      <Icon
        className={cn(
          "h-5 w-5 text-neutral-500 transition-colors duration-200",
          isActive && "text-neutral-800",
          !isDisabled && "group-hover:text-neutral-800"
        )}
      />
      <div className="absolute left-14 px-2.5 py-1.5 rounded-md bg-neutral-800 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {label}
      </div>
    </button>
  );
};
