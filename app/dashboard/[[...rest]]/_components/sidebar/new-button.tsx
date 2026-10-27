"use client";
import { Plus } from "lucide-react";
import { CreateOrganization } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Hint } from "@/components/hint";

export const NewButton = () => {
  return (
    <Dialog>
      <Hint lablel="Create organization" side="right" sideOffset={12}>
        <DialogTrigger asChild>
          <button
            type="button"
            aria-label="Create organization"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-dashed border-zinc-300 text-zinc-500 transition-colors hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600"
          >
            <Plus className="h-5 w-5" />
          </button>
        </DialogTrigger>
      </Hint>
      <DialogContent className="p-0 bg-transparent border-none max-w-[420px]">
        <DialogTitle className="sr-only">Create organization</DialogTitle>
        <CreateOrganization />
      </DialogContent>
    </Dialog>
  );
};
