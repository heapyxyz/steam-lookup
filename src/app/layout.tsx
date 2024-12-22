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
  description: "Tool for looking up Steam profiles.",
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
