"use client";
import React from "react";
import { EmptyOrg } from "./_components/empty-org";
import { useOrganization } from "@clerk/nextjs";
import { BoardList } from "./_components/board-list";

const DashboardPage = () => {
  const { organization } = useOrganization();

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-8 py-8">
      {!organization ? (
        <EmptyOrg />
      ) : (
        <BoardList orgId={organization.id} orgName={organization.name} />
      )}
    </div>
  );
};

export default DashboardPage;
