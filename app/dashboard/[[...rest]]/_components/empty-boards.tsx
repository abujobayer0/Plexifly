import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useOrganization } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { EmptyState, primaryButtonClassName } from "./empty-state";

export const EmptyBoards = () => {
  const { pending, mutate } = useApiMutation(api.board.create);
  const { organization } = useOrganization();
  const router = useRouter();
  const handleCreateBoard = () => {
    if (!organization) return;

    mutate({
      orgId: organization.id,
      title: "Untitled board",
    })
      .then((id) => {
        toast.success(`Board created successfully`);
        router.push(`/board/${id}`);
      })
      .catch(() => {
        toast.error(`Failed to create board`);
      });
  };

  return (
    <EmptyState
      image="/note.svg"
      title="Create your first board"
      description="Boards are where your team brainstorms, diagrams and plans together. Start one now — you can use a template once you're in."
      action={
        <button
          type="button"
          disabled={pending}
          onClick={handleCreateBoard}
          className={primaryButtonClassName}
        >
          <Plus className="h-4 w-4" />
          Create board
        </button>
      }
    />
  );
};
