"use client";
import {
  OrganizationSwitcher,
  UserButton,
  useOrganization,
} from "@clerk/nextjs";
import React from "react";
import SearchInput from "./search-input";
import { InviteButton } from "./invite-button";

export const Navbar = () => {
  const { organization } = useOrganization();

  return (
    <header className="flex h-16 shrink-0 items-center gap-x-3 border-b border-zinc-200/80 bg-white/80 px-4 sm:px-6 backdrop-blur">
      <div className="hidden lg:flex lg:flex-1">
        <SearchInput />
      </div>
      <div className="flex-1 lg:hidden">
        <OrganizationSwitcher
          hidePersonal
          appearance={{
            elements: {
              rootBox: {
                display: "flex",
                width: "100%",
                maxWidth: "320px",
              },
              organizationSwitcherTrigger: {
                padding: "6px 10px",
                width: "100%",
                borderRadius: "12px",
                border: "1px solid #e4e4e7",
                justifyContent: "space-between",
                backgroundColor: "white",
              },
            },
          }}
        />
      </div>
      {organization && <InviteButton />}
      <div className="flex h-9 w-9 items-center justify-center">
        <UserButton
          appearance={{ elements: { avatarBox: { width: 32, height: 32 } } }}
        />
      </div>
    </header>
  );
};
