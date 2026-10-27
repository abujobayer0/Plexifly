import { UserPlus } from "lucide-react";
import { OrganizationProfile } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const InviteButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex h-9 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3.5 text-sm font-semibold text-zinc-700 shadow-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50"
        >
          <UserPlus className="h-4 w-4" />
          <span className="hidden sm:inline">Invite members</span>
        </button>
      </DialogTrigger>
      <DialogContent
        onClick={(e) => e.stopPropagation()}
        className="p-0 bg-transparent border-none max-w-[880px]"
      >
        <DialogTitle className="sr-only">Invite members</DialogTitle>
        <OrganizationProfile />
      </DialogContent>
    </Dialog>
  );
};
