"use client";
import React from "react";
import { Sidebar } from "./_components/sidebar";
import { OrganizationalSidebar } from "./_components/OrganizationalSidebar";
import { Navbar } from "./_components/navbar";
import { Authenticated, AuthLoading } from "convex/react";
import { Loading } from "@/components/auth/loading";
interface Props {
  children: React.ReactNode;
}
const DashboardLayout = ({ children }: Props) => {
  return (
    <>
      <Authenticated>
        <main className="flex h-screen bg-white text-zinc-900 [font-family:var(--font-jakarta)]">
          <Sidebar />
          <OrganizationalSidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <Navbar />
            <div className="flex-1 overflow-y-auto bg-zinc-50/60">
              {children}
            </div>
          </div>
        </main>
      </Authenticated>
      <AuthLoading>
        <Loading></Loading>
      </AuthLoading>
    </>
  );
};

export default DashboardLayout;
