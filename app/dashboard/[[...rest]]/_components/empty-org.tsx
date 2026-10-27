import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateOrganization } from "@clerk/nextjs";
import { Building2 } from "lucide-react";
import React from "react";
import { EmptyState, primaryButtonClassName } from "./empty-state";

export const EmptyOrg = () => {
  return (
    <EmptyState
      image="/elements.svg"
      title="Welcome to Plexifly"
      description="Create an organization to get started. Boards live in organizations, so everyone you invite can collaborate on them."
      action={
        <Dialog>
          <DialogTrigger asChild>
            <button type="button" className={primaryButtonClassName}>
              <Building2 className="h-4 w-4" />
              Create organization
            </button>
          </DialogTrigger>
          <DialogContent className="p-0 bg-transparent border-none max-w-[420px]">
            <DialogTitle className="sr-only">Create organization</DialogTitle>
            <CreateOrganization />
          </DialogContent>
        </Dialog>
      }
    />
  );
};
