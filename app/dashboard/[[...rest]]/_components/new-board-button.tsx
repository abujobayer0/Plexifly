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
      title: "untitled",
    })
      .then((id) => {
        toast.success("Board created successfully");
        router.push(`/board/${id}`);
      })
      .catch(() => toast.error("Failed to create board"));
  };

  return (
    <button
      disabled={pending || disabled}
      onClick={onClick}
      className={cn(
        "col-span-1 aspect-[100/127] bg-[#8c52ff] rounded-lg hover:bg-[#5e17eb] flex flex-col items-center justify-center py-6",
        (pending || disabled) &&
          "opacity-75  hover:bg-[#8c52ff] cursor-not-allowed "
      )}
    >
      <div />
      <Plus className="h-12 w-12 text-white stroke-1" />
      <p className="text-sm text-white font-light">New Board</p>
    </button>
  );
}
