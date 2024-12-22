import "@/src/styles/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Suspense } from "react"
import { Loading } from "@/src/components/loading"
import { Providers } from "./providers"
import { Navigation } from "../components/navigation"

const inter = Inter({
  weight: ["500", "700", "900"],
  subsets: ["latin"],
})

export const viewport = {
  width: "device-width",
  initialScale: 0.75,
  maximumScale: 5,
  userScalable: 1,
}

export const metadata: Metadata = {
  title: "SteamLookup",
  description: "Website for looking up Steam profiles",
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
    card: "app",
    title: "SteamLookup",
    description: "Website for looking up Steam profiles",
    creator: "@heapyxyz",
    images: {
      url: "https://heapy.xyz/icon-dark.png",
      alt: "SteamLookup Logo",
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className + " select-none"}>
        <Providers>
          <Suspense fallback={<Loading />}>
            <Navigation />
            {children}
          </Suspense>
        </Providers>
      </body>
    </html>
  )
}
