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

const GRID_CLASS_NAME =
  "mt-6 grid grid-cols-1 gap-5 pb-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5";

export const BoardList = ({
  orgId,
  orgName,
}: {
  orgId: string;
  orgName: string;
}) => {
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

  const title = query.search
    ? "Search results"
    : query.favorites
      ? "Favorite boards"
      : "Team boards";

  let subtitle: string;
  if (data === undefined) {
    subtitle = "Loading boards…";
  } else if (query.search) {
    subtitle = `${data.length} ${data.length === 1 ? "board matches" : "boards match"} “${query.search}” in ${orgName}`;
  } else if (query.favorites) {
    subtitle = `Boards you've starred in ${orgName}`;
  } else {
    subtitle = `${data.length} ${data.length === 1 ? "board" : "boards"} in ${orgName}`;
  }

  const header = (
    <div>
      <h1 className="text-2xl font-extrabold tracking-[-0.02em]">{title}</h1>
      <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
    </div>
  );

  if (data === undefined) {
    return (
      <div>
        {header}
        <div className={GRID_CLASS_NAME}>
          <NewBoardButton orgId={orgId} disabled />
          {Array.from({ length: 7 }).map((_, index) => (
            <BoardCard.Skeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  let emptyState: React.ReactNode = null;
  if (!data.length && query.search) emptyState = <EmptySearch />;
  else if (!data.length && query.favorites) emptyState = <EmptyFavorites />;
  else if (!data.length) emptyState = <EmptyBoards />;

  if (emptyState) {
    return (
      <div>
        {header}
        <div className="mt-6">{emptyState}</div>
      </div>
    );
  }

  return (
    <div>
      {header}
      <div className={GRID_CLASS_NAME}>
        {!query.search && !query.favorites && <NewBoardButton orgId={orgId} />}
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
