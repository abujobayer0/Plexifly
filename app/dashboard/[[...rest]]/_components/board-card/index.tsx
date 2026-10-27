"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useAuth } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import Footer from "./footer";
import { Skeleton } from "@/components/ui/skeleton";
import Actions from "@/components/actions";
import { MoreHorizontal } from "lucide-react";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

interface BoardCardProps {
  id: string;
  title: string;
  imageUrl: string;
  authorId: string;
  authorName: string;
  createdAt: number;
  orgId: string;
  isFavorite: boolean;
}
export const BoardCard = ({
  id,
  title,
  imageUrl,
  authorId,
  authorName,
  createdAt,
  orgId,
  isFavorite,
}: BoardCardProps) => {
  const { userId } = useAuth();
  const authorLabel = userId === authorId ? "You" : authorName;
  const createdAtLabel = formatDistanceToNow(createdAt, { addSuffix: true });
  const { pending: favoritePending, mutate: onFavorite } = useApiMutation(
    api.board.favorite
  );
  const { pending: unfavoritePending, mutate: onUnfavorite } = useApiMutation(
    api.board.unfavorite
  );

  const toggleFavorite = () => {
    if (isFavorite) {
      onUnfavorite({ id, orgId }).catch(() =>
        toast.error("Failed to unfavorite")
      );
    } else {
      onFavorite({ id, orgId }).catch(() => toast.error("Failed to favorite"));
    }
  };

  return (
    <Link
      href={`/board/${id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm outline-none transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-[0_12px_32px_-12px_rgba(15,23,42,0.18)] focus-visible:ring-2 focus-visible:ring-indigo-400"
    >
      <div className="relative aspect-[16/10] bg-[#f8f9fb] bg-[radial-gradient(rgba(0,0,0,0.07)_1px,transparent_1px)] [background-size:14px_14px]">
        <Image
          src={imageUrl}
          alt=""
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-contain p-6 transition-transform duration-300 group-hover:scale-[1.04]"
        />
        <Actions id={id} side="right" title={title}>
          <button
            type="button"
            aria-label="Board actions"
            onClick={(e) => {
              // Keep the card link from navigating when opening the menu.
              e.preventDefault();
              e.stopPropagation();
            }}
            className="absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200/80 bg-white/90 text-zinc-600 opacity-0 shadow-sm backdrop-blur transition-opacity hover:text-zinc-900 focus-visible:opacity-100 group-hover:opacity-100 data-[state=open]:opacity-100"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </Actions>
      </div>
      <Footer
        title={title}
        authorLabel={authorLabel}
        createdAtLabel={createdAtLabel}
        onClick={toggleFavorite}
        disabled={favoritePending || unfavoritePending}
        isFavorite={isFavorite}
      />
    </Link>
  );
};

BoardCard.Skeleton = function BoardCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white">
      <Skeleton className="aspect-[16/10] rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
};
