import React from "react";
import { NewButton } from "./new-button";
import { List } from "./list";

export const Sidebar = () => {
  return (
    <aside className="fixed z-[1] left-0 bg-[#8c52ff] h-full w-[60px] flex p-3 flex-col gap-y-4 text-white">
      <List />
      <NewButton />
    </aside>
  );
};
