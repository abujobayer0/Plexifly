import React from "react";
import { Sidebar } from "./_components/sidebar";
import { OrganizationalSidebar } from "./_components/OrganizationalSidebar";
import { Navbar } from "./_components/navbar";
interface Props {
  children: React.ReactNode;
}
const DashboardLayout = ({ children }: Props) => {
  return (
    <main className="h-full ">
      <Sidebar></Sidebar>
      <div className="pl-[60px] h-full">
        <div className="flex gap-x-3 h-full">
          <OrganizationalSidebar></OrganizationalSidebar>
          <div className="h-full flex-1">
            <Navbar />
            {children}
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardLayout;
