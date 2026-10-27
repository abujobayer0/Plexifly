import React from "react";
import { EmptyState } from "./empty-state";

export const EmptyFavorites = () => {
  return (
    <EmptyState
      image="/empty-favorites.svg"
      title="No favorite boards yet"
      description="Star a board from its card to keep it one click away here."
    />
  );
};
