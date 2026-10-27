import Image from "next/image";
import React from "react";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Hint } from "@/components/hint";

interface ItemsProps {
  id: string;
  name: string;
  imageUrl: string;
}
export const Item = ({ name, imageUrl, id }: ItemsProps) => {
  const { organization } = useOrganization();
  const { setActive } = useOrganizationList();

  const isActive = organization?.id === id;

  const onClick = () => {
    if (!isActive && setActive) {
      setActive({ organization: id });
    }
  };

  return (
    <li className="relative flex items-center">
      {/* Active indicator bar on the rail's left edge. */}
      <span
        className={cn(
          "absolute -left-[14px] h-5 w-1 rounded-r-full bg-indigo-600 transition-all",
          isActive ? "opacity-100" : "opacity-0"
        )}
      />
      <Hint lablel={name} side="right" sideOffset={12}>
        <button
          type="button"
          onClick={onClick}
          aria-label={`Switch to ${name}`}
          aria-current={isActive}
          className={cn(
            "h-10 w-10 overflow-hidden rounded-xl transition-all",
            isActive
              ? "ring-2 ring-indigo-600 ring-offset-2 ring-offset-zinc-50"
              : "opacity-70 hover:opacity-100 hover:ring-2 hover:ring-zinc-300 hover:ring-offset-2 hover:ring-offset-zinc-50"
          )}
        >
          <Image
            src={imageUrl}
            alt=""
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        </button>
      </Hint>
    </li>
  );
};
