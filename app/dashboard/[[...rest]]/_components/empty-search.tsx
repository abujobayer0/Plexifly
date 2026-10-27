import React from "react";
import { EmptyState } from "./empty-state";

export const EmptySearch = () => {
  return (
    <EmptyState
      image="/empty-search.svg"
      title="No boards match your search"
      description="Try a different name, or clear the search to see all boards."
    />
  );
};
