import Image from "next/image";
import React from "react";

interface EmptyStateProps {
  image: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

// Shared layout for the dashboard's empty and no-results screens.
export const EmptyState = ({
  image,
  title,
  description,
  action,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200 bg-white px-6 py-20 text-center">
      <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-zinc-50 ring-1 ring-inset ring-zinc-100">
        <Image src={image} alt="" width={84} height={84} />
      </div>
      <h2 className="mt-6 text-xl font-bold tracking-tight">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-500">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export const primaryButtonClassName =
  "inline-flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60";
