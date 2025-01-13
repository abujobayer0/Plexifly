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
  title: "Plexifly | Realtime Collaboration Board",
  description:
    "Plexifly is a powerful, intuitive real-time collaboration board for teams to work together seamlessly, share ideas, and organize tasks with ease.",
  keywords:
    "Plexifly, collaboration board, real-time collaboration, team collaboration, task management, productivity, online whiteboard, remote collaboration, team productivity tool",

  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1.0",
  themeColor: "#7C4DFF",

  openGraph: {
    title: "Plexifly | Realtime Collaboration Board",
    description:
      "Plexifly is a powerful, intuitive real-time collaboration board for teams to work together seamlessly, share ideas, and organize tasks with ease.",
    url: "https://plexifly.com",
    siteName: "Plexifly",
    images: [
      {
        url: "https://i.ibb.co.com/7vyfSk5/P.jpg",
        width: 1200,
        height: 630,
        alt: "Plexifly Realtime Collaboration Board",
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
