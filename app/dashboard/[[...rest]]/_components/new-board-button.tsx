"use client";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
interface Props {
  orgId: string;
  disabled?: boolean;
}
export default function NewBoardButton({ orgId, disabled }: Props) {
  const { mutate, pending } = useApiMutation(api.board.create);
  const router = useRouter();
  const onClick = () => {
    mutate({
      orgId,
      title: "Untitled board",
    })
      .then((id) => {
        toast.success("Board created successfully");
        router.push(`/board/${id}`);
      })
      .catch(() => toast.error("Failed to create board"));
  };

  return (
    <button
      type="button"
      disabled={pending || disabled}
      onClick={onClick}
      className={cn(
        "group flex min-h-[240px] h-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-zinc-200 bg-white/60 p-6 text-center transition-all",
        "hover:border-indigo-300 hover:bg-indigo-50/50",
        (pending || disabled) &&
          "cursor-not-allowed opacity-60 hover:border-zinc-200 hover:bg-white/60"
      )}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 transition-transform group-hover:scale-105">
        <Plus className="h-6 w-6" />
      </span>
      <span>
        <span className="block text-sm font-semibold text-zinc-900">
          {pending ? "Creating…" : "New board"}
        </span>
        <span className="mt-0.5 block text-xs text-zinc-500">
          Start from scratch or a template
        </span>
      </span>
    </button>
  );
}
