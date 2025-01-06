"use client";
import { Plus } from "lucide-react";
import { CreateOrganization } from "@clerk/nextjs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Hint } from "@/components/hint";

export const NewButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Hint
          lablel="Create Organization"
          alignOffset={18}
          side="right"
          align="start"
        >
          <div className="aspect-square">
            <span className="bg-white/25 cursor-pointer h-full w-full rounded-md flex items-center justify-center opacity-60 hover:opacity-100 transition">
              <Plus className="text-white" />
            </span>
          </div>
        </Hint>
      </DialogTrigger>

      <DialogContent className="p-0 bg-transparent border-none max-w-[420px]">
        <CreateOrganization />
      </DialogContent>
    </Dialog>
  );
};
