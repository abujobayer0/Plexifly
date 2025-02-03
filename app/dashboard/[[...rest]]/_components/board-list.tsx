"use client";

import { useQuery } from "convex/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";
import { EmptyBoards } from "./empty-boards";
import { EmptyFavorites } from "./empty-favorites";
import { EmptySearch } from "./empty-search";
import { BoardCard } from "./board-card";
import NewBoardButton from "./new-board-button";

export const BoardList = ({ orgId }: { orgId: string }) => {
  const searchParams = useSearchParams();

  const [query, setQuery] = useState<{ search?: string; favorites?: string }>({
    search: "",
    favorites: "",
  });

  useEffect(() => {
    setQuery({
      search: searchParams.get("search") || "",
      favorites: searchParams.get("favorites") || "",
    });
  }, [searchParams]);

  const data = useQuery(api.boards.get, { orgId, ...query });

  if (data === undefined) {
    return (
      <div>
        <h2 className="text-3xl">
          {query.favorites ? "Favorite boards" : "Team boards"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
          <NewBoardButton orgId={orgId} disabled />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
        </div>
      </div>
    );
  }

  if (!data?.length && query.search) return <EmptySearch />;
  if (!data?.length && query.favorites) return <EmptyFavorites />;
  if (!data?.length) return <EmptyBoards />;

  return (
    <div>
      <h2 className="text-3xl">
        {query.favorites ? "Favorite boards" : "Team boards"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
        <NewBoardButton orgId={orgId} />
        {data.map((board) => (
          <BoardCard
            key={board._id}
            id={board._id}
            title={board.title}
            imageUrl={board.imageUrl}
            authorId={board.authorId}
            authorName={board.authorName}
            createdAt={board._creationTime}
            orgId={orgId}
            isFavorite={board.isFavorite}
          />
        ))}
      </div>
    </div>
  );
};
