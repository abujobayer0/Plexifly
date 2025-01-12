import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/providers/convex-client-provider";
import { Toaster } from "@/components/ui/sonner";
import { ModalProvider } from "@/providers/modal-provider";
import { Suspense } from "react";
import { Loading } from "@/components/auth/loading";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PlexiFly | Realtime Collaboration Board",
  description:
    "PlexiFly is a powerful, intuitive real-time collaboration board for teams to work together seamlessly, share ideas, and organize tasks with ease.",
  keywords:
    "PlexiFly, collaboration board, real-time collaboration, team collaboration, task management, productivity, online whiteboard, remote collaboration, team productivity tool",

  robots: "index, follow", // Ensures search engines index and follow the links
  viewport: "width=device-width, initial-scale=1.0", // Responsive design
  themeColor: "#7C4DFF", // Set the theme color to your primary brand color

  openGraph: {
    title: "PlexiFly | Realtime Collaboration Board",
    description:
      "PlexiFly is a powerful, intuitive real-time collaboration board for teams to work together seamlessly, share ideas, and organize tasks with ease.",
    url: "https://plexifly.com",
    siteName: "PlexiFly",
    images: [
      {
        url: "https://scontent.frjh5-1.fna.fbcdn.net/v/t39.30808-6/471431664_122100027332703343_8154094821525022959_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=rJ6dqptjoFEQ7kNvgHxGBMS&_nc_zt=23&_nc_ht=scontent.frjh5-1.fna&_nc_gid=ABvnPiw790XzkbQLqXgeY96&oh=00_AYDoC-fpqGl14U9Pb7RMrPYjZoL6E5wVAeRMZ7tjHS-kQg&oe=678A0C5B", // URL to an image to be displayed when shared
        width: 1200,
        height: 630,
        alt: "PlexiFly Realtime Collaboration Board",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={<Loading />}>
          <ConvexClientProvider>
            <Toaster />
            <ModalProvider />
            {children}
          </ConvexClientProvider>
        </Suspense>
      </body>
    </html>
  );
}
