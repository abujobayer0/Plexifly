"use client";
import { useOthers, useSelf } from "@liveblocks/react";
import React from "react";
import { UserAvatar } from "./user-avatar";
import { connectionIdToColor } from "@/lib/utils";

const MAX_SHOWN_OTHER_USERS = 10;

export default function Participants() {
  const users = useOthers();
  const currentUser = useSelf();
  const hasMoreUsers = users.length > MAX_SHOWN_OTHER_USERS;
  return (
    <div className="absolute h-12 top-2 right-2 bg-white/70 border border-white/20 backdrop-blur-[12px] rounded-xl p-3 flex items-center shadow-xl">
      <div className="flex gap-x-2">
        {users
          ?.slice(0, MAX_SHOWN_OTHER_USERS)
          ?.map(({ connectionId, info }) => {
            return (
              <UserAvatar
                borderColor={connectionIdToColor(connectionId)}
                key={connectionId}
                src={info?.picture}
                name={info?.name}
              />
            );
          })}
        {currentUser && (
          <UserAvatar
            borderColor={connectionIdToColor(currentUser.connectionId)}
            src={currentUser.info?.picture}
            name={`${currentUser.info?.name} (You)`}
          />
        )}
        {hasMoreUsers && (
          <UserAvatar name={`+${users.length - MAX_SHOWN_OTHER_USERS} more`} />
        )}
      </div>
    </div>
  );
}

export function ParticipantsSkeleton() {
  return (
    <div className="absolute h-12 top-2 right-2 bg-white rounded-md p-3 flex items-center shadow-md w-[100px]" />
  );
}
