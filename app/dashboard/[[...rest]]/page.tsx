"use client";
import React from "react";
import { EmptyOrg } from "./_components/empty-org";
import { useOrganization } from "@clerk/nextjs";
import { BoardList } from "./_components/board-list";

const DashboardPage = () => {
  const { organization } = useOrganization();

  return (
    <div className="flex-1 h-[calc(100%-80px)] p-6 bg-gradient-to-b from-white to-purple-50">
      <div className="relative">
        <div className="absolute inset-0 pointer-events-none ">
          <div className="absolute top-10 -left-10 w-[500px] h-[500px]">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#8c52ff]/10 to-purple-300/10 rounded-full blur-[100px] animate-float-slow" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#8c52ff]/5 to-blue-300/5 rounded-full blur-[100px] animate-float-reverse" />
          </div>
          <div className="absolute top-20 -right-10 w-[600px] h-[600px]">
            <div className="absolute inset-0 bg-gradient-to-bl from-purple-200/10 to-blue-300/10 rounded-full blur-[100px] animate-float" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#7c4dff]/5 to-purple-300/5 rounded-full blur-[100px] animate-float-slow" />
          </div>

          <div className="absolute top-10 left-1/4 w-24 h-24 border border-purple-500/20 rounded-full animate-spin-slow" />
          <div className="absolute bottom-20 right-1/4 w-32 h-32 border border-blue-500/20 rounded-full animate-reverse-spin" />

          <div className="absolute top-40 right-20 w-40 h-24">
            <div className="absolute inset-0 border border-purple-500/20 rounded-xl animate-float" />
            <div className="absolute inset-0 border border-purple-500/20 rounded-xl animate-float delay-100 rotate-3" />
          </div>
          <div className="absolute bottom-40 left-20 w-36 h-36">
            <svg
              className="animate-pulse-slow"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="rgba(140, 82, 255, 0.2)"
                strokeWidth="2"
              />
              <path
                d="M50 10 L50 90"
                stroke="rgba(140, 82, 255, 0.15)"
                strokeWidth="2"
                className="animate-dash"
              />
              <path
                d="M10 50 L90 50"
                stroke="rgba(140, 82, 255, 0.15)"
                strokeWidth="2"
                className="animate-dash"
              />
            </svg>
          </div>

          <div className="absolute top-60 left-1/3 w-20 h-20 rotate-45">
            <div className="absolute inset-0 border border-blue-500/20 animate-bounce-slow" />
            <div className="absolute inset-0 border border-purple-500/20 rotate-45 animate-bounce-slow delay-150" />
          </div>

          <div className="absolute bottom-32 right-1/3">
            <svg
              className="w-24 h-24 animate-float-slow"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polygon
                points="50,10 90,90 10,90"
                stroke="rgba(140, 82, 255, 0.2)"
                strokeWidth="2"
                className="animate-draw"
                fill="none"
              />
            </svg>
          </div>
        </div>

        <div className="relative">
          {!organization ? <EmptyOrg /> : <BoardList orgId={organization.id} />}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
