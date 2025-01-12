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
    if (isActive && setActive) {
      setActive({ organization: id });
    }
  };

  return (
    <div className="aspect-square relative flex justify-center items-center  bg-white rounded-lg">
      <Hint lablel={name} alignOffset={18} side="right">
        <Image
          src={imageUrl}
          alt={name}
          width={120}
          height={120}
          onClick={onClick}
          className={cn(
            "rounded-md cursor-pointer opacity-75 hover:opacity-100 transition",
            isActive && "opacity-100"
          )}
        />
      </Hint>
    </div>
  );
};
