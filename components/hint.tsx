import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export interface HintProps {
  lablel: string;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "end";
  sideOffset?: number;
  alignOffset?: number;
}

export const Hint = ({
  lablel,
  children,
  side,
  align,
  alignOffset,
  sideOffset,
}: HintProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          className="px-3 py-2 text-sm text-white bg-zinc-800 rounded-lg shadow-lg border border-zinc-700/50 backdrop-blur-sm"
          side={side}
          sideOffset={sideOffset}
          align={align}
          alignOffset={alignOffset}
        >
          <p className="font-medium">{lablel}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
