import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublic = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  // If the request matches public routes, skip authentication
  if (isPublic(request)) {
    return; // Allow access to public routes without protection
  }

  // Otherwise, protect the route
  await auth.protect();
});

// Define which routes the middleware should apply to
export const config = {
  matcher: [
    // Skip Next.js internals and static files (like images, CSS, JS)
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

    // Always run for API routes (e.g., /api or /trpc)
    "/(api|trpc)(.*)",
  ],
};
