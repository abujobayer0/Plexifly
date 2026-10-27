import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const liveblocks = new Liveblocks({
  secret: process.env.LIVE_BLOCK_SECRET_KEY!,
});

// board.get throws for unknown ids; treat that as "not found".
const getBoard = (id: string) =>
  convex.query(api.board.get, { id: id as Id<"boards"> }).catch(() => null);

// The session token's active org can lag right after switching or creating
// an organization, so fall back to the user's actual memberships.
async function isOrgMember(userId: string, orgId: string) {
  const client = await clerkClient();
  const { data } = await client.users.getOrganizationMembershipList({
    userId,
    limit: 100,
  });
  return data.some((membership) => membership.organization.id === orgId);
}

export async function POST(request: Request) {
  const authorization = await auth();
  if (!authorization.userId) {
    return new Response("Unauthorized", { status: 403 });
  }

  const { room } = await request.json();
  if (!room) {
    return new Response("Missing room", { status: 400 });
  }

  // Independent lookups run in parallel to keep the auth round trip short.
  const [user, board] = await Promise.all([currentUser(), getBoard(room)]);

  if (!user) {
    return new Response("Unauthorized", { status: 403 });
  }

  if (!board) {
    return new Response("Board not found", { status: 404 });
  }

  if (
    board.orgId !== authorization.orgId &&
    !(await isOrgMember(user.id, board.orgId))
  ) {
    return new Response("Unauthorized", { status: 403 });
  }

  const userInfo = {
    name: user.firstName! || "anonymous",
    picture: user.imageUrl!,
  };

  const session = liveblocks.prepareSession(user.id, { userInfo });
  session.allow(room, session.FULL_ACCESS);

  try {
    const { status, body } = await session.authorize();

    return new Response(body, { status });
  } catch (error) {
    console.error("Error during session authorization:", error);
    return new Response("Error during session authorization", { status: 500 });
  }
}
