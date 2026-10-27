import React from "react";
import { NewButton } from "./new-button";
import { List } from "./list";

// Narrow rail listing the user's organizations.
export const Sidebar = () => {
  return (
    <aside className="flex h-full w-[68px] shrink-0 flex-col items-center gap-y-3 border-r border-zinc-200/80 bg-zinc-50 py-4">
      <List />
      <NewButton />
    </aside>
  );
};
