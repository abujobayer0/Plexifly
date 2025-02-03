import { Plus } from "lucide-react";
import { OrganizationProfile } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const InviteButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          <Plus className="w-4 h-4 mr-2 " />
          Invite Members
        </Button>
      </DialogTrigger>
      <DialogContent
        onClick={(e) => e.stopPropagation()}
        className="p-0 bg-transparent border-none max-w-[880px]"
      >
        <DialogTitle>Invite Members</DialogTitle>
        <OrganizationProfile />
      </DialogContent>
    </Dialog>
  );
};
