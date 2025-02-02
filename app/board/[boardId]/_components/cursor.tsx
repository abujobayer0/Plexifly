"use client";

import { memo } from "react";
import { MousePointer2 } from "lucide-react";

import { connectionIdToColor } from "@/lib/utils";
import { useOther } from "@liveblocks/react";

export interface CursorProps {
  connectionId: number;
}

export const Cursor = memo(({ connectionId }: CursorProps) => {
  const info = useOther(connectionId, (user) => user.info);
  const cursor = useOther(connectionId, (user) => user.presence.cursor);

  const name = info?.name || "Anonymous";

  if (!cursor) return null;
  const { x, y } = cursor;

  return (
    <foreignObject
      style={{
        transform: `translateX(${x}px) translateY(${y}px)`,
      }}
      height={50}
      width={name.length * 10 + 32}
      className="relative drop-shadow-md transition-transform duration-200 ease-in-out"
    >
      <MousePointer2
        className="h-5 w-5 animate-pulse-subtle"
        style={{
          fill: `${connectionIdToColor(connectionId)}33`,
          color: connectionIdToColor(connectionId),
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
        }}
      />
      <div
        className="absolute left-5 px-2.5 py-1 rounded-full text-xs font-medium 
        backdrop-blur-sm shadow-sm transition-opacity duration-200"
        style={{
          backgroundColor: `${connectionIdToColor(connectionId)}CC`,
          transform: "translateY(-50%)",
        }}
      >
        {name}
      </div>
    </foreignObject>
  );
});

Cursor.displayName = "Cursor";
