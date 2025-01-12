import React from "react";
import Canvas from "./_components/canvas";
import { Room } from "@/components/room";
import Loading from "./_components/loading";

export default async function BoardIdPage({
  params,
}: {
  params: Promise<{ boardId: string }>;
}) {
  // Await the params
  const { boardId } = await params;

  if (!boardId) {
    return <div>Error: Board not found</div>;
  }

  return (
    <Room roomId={boardId} fallback={<Loading />}>
      <Canvas boardId={boardId} />
    </Room>
  );
}
