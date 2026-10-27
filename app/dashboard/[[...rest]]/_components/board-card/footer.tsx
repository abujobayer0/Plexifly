import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import React from "react";
interface Props {
  title: string;
  authorLabel: string;
  createdAtLabel: string;
  isFavorite: boolean;
  onClick: () => void;
  disabled: boolean;
}
export default function Footer({
  title,
  authorLabel,
  createdAtLabel,
  isFavorite,
  onClick,
  disabled,
}: Props) {
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
    event.preventDefault();
    onClick();
  };
  return (
    <div className="flex items-start gap-3 border-t border-zinc-100 p-4">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold uppercase text-indigo-600 ring-1 ring-inset ring-indigo-100">
        {authorLabel.charAt(0)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-zinc-900">{title}</p>
        <p className="mt-0.5 truncate text-xs text-zinc-500">
          {authorLabel} · {createdAtLabel}
        </p>
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={handleClick}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        aria-pressed={isFavorite}
        className={cn(
          "-mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all hover:bg-zinc-100",
          isFavorite
            ? "text-amber-500"
            : "text-zinc-400 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 hover:text-zinc-700",
          disabled && "cursor-not-allowed opacity-60"
        )}
      >
        <Star className={cn("h-4 w-4", isFavorite && "fill-amber-400")} />
      </button>
    </div>
  );
}
