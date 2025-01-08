import React from "react";
import Canvas from "./_components/canvas";
import { Room } from "@/components/room";
import Loading from "./_components/loading";

interface BoardIdPageProps {
  params: {
    boardId?: string; // Optional to handle undefined gracefully
  };
}

const BoardIdPage = async ({ params }: BoardIdPageProps) => {
  const { boardId } = await params;

  return (
    <Room roomId={boardId as string} fallback={<Loading />}>
      <Canvas boardId={boardId as string} />
    </Room>
  );
};

export default BoardIdPage;
