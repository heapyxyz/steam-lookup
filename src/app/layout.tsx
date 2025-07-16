import type { Metadata } from "next"

import "./globals.css"
import Providers from "@/app/providers"
import { Toaster } from "@/components/ui/sonner"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "SteamLookup",
  description: "The easiest way to lookup Steam profiles.",
  generator: "Next.js",
  applicationName: "SteamLookup",
  authors: [{ name: "heapy", url: "https://heapy.xyz" }],
  creator: "heapy",
  publisher: "heapy",
  keywords: [
    "steam",
    "steamlookup",
    "steam lookup",
    "steam api",
    "steam profile",
    "steam profiles",
    "steam account",
    "steam accounts",
    "steam user",
    "steam users",
    "steam community",
    "steam profile analysis",
    "steam profile viewer",
    "steam profile checker",
    "steam profile lookup",
    "steam id",
    "steam id lookup",
    "steam 64 id",
    "steam 64 id lookup",
    "steam profile stats",
    "steam profile information",
    "steam profile data",
    "steam profile insights",
  ],
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/icon-light.png",
        href: "/icon-light.png",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/icon.png",
        href: "/icon-dark.png",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "SteamLookup",
    description: "An easy-to-use website that lets you lookup Steam profiles.",
    creator: "@heapyxyz",
    images: {
      url: "https://heapy.xyz/icon-dark.png",
      alt: "Logo",
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased select-none">
        <Providers>
          <main className="min-h-dvh max-w-5xl container mx-auto p-4 flex flex-col">
            {children}
            <Toaster position="bottom-right" visibleToasts={1} />
            <Footer />
          </main>
        </Providers>
      </body>
    </html>
  )
}
