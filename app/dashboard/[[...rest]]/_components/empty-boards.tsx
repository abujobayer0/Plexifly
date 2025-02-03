import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useOrganization } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export const EmptyBoards = () => {
  const { pending, mutate } = useApiMutation(api.board.create);
  const { organization } = useOrganization();
  const router = useRouter();
  const handleCreateBoard = () => {
    if (!organization) return;

    mutate({
      orgId: organization.id,
      title: "untitled board",
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
    <div className="h-full flex flex-col items-center justify-center pt-32">
      <Image src={"/note.svg"} alt="note" width={140} height={140} />
      <h2 className="text-2xl font-semibold mt-6">Create your first board!</h2>
      <p className="text-muted-foreground text-sm mt-2">
        Start by creating a new board for your organization
      </p>
      <div className="mt-6">
        <Button size={"lg"} disabled={pending} onClick={handleCreateBoard}>
          Create board
        </Button>
      </div>
    </div>
  );
};
