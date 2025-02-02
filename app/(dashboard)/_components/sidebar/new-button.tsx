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
import { Button } from "@/components/ui/button";

export const NewButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="aspect-square">
          <Button
            variant="ghost"
            className="bg-white/25 cursor-pointer h-full w-full rounded-md flex items-center justify-center opacity-60 hover:opacity-100 transition"
          >
            <Hint
              lablel="Create Organization"
              alignOffset={18}
              side="right"
              align="start"
            >
              <Plus className="text-white" />
            </Hint>
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="p-0 bg-transparent border-none max-w-[420px]">
        <DialogTitle>Create Organization</DialogTitle>
        <CreateOrganization />
      </DialogContent>
    </Dialog>
  );
};
