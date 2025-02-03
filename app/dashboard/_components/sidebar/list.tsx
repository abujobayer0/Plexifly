"use client";
import { useOrganizationList } from "@clerk/nextjs";
import { Item } from "./item";
export const List = () => {
  const { userMemberships } = useOrganizationList({
    userMemberships: { infinite: true },
  });

  if (!userMemberships.data?.length) return null;
  return (
    <ul className="space-y-4">
      {userMemberships.data.map((membership) => (
        <Item
          name={membership.organization.name}
          key={membership.organization.id}
          id={membership.organization.id}
          imageUrl={membership.organization.imageUrl}
        />
      ))}
    </ul>
  );
};
