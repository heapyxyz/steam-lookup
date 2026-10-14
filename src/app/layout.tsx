import type { Metadata } from "next"

import "./globals.css"
import Providers from "@/app/providers"
import { Toaster } from "@/components/ui/sonner"

const TITLE = "SteamLookup"
const DESCRIPTION =
  "Lookup profiles by Steam IDs, vanities or profile URLs. Now with FACEIT support."

export const metadata: Metadata = {
  title: {
    default: TITLE,
    template: "%s - SteamLookup"
  },
  description: DESCRIPTION,
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/icon-light.png",
        href: "/icon-light.png"
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/icon-dark.png",
        href: "/icon-dark.png"
      }
    ]
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://heapy.xyz",
    siteName: TITLE,
    images: [
      {
        url: "https://heapy.xyz/icon-dark.png",
        width: 512,
        height: 512,
        alt: "Logo"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    creator: "@heapyxyz",
    images: {
      url: "https://heapy.xyz/icon-dark.png",
      alt: "Logo"
    }
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased select-none">
        <Providers>
          <main className="min-h-dvh max-w-5xl container mx-auto p-4 flex flex-col">
            {children}
            <Toaster
              position="bottom-right"
              visibleToasts={1}
              toastOptions={{
                style: {
                  background: "transparent",
                  border: "none"
                },
                className: "backdrop-blur-2xl backdrop-brightness-50"
              }}
            />
          </main>
        </Providers>
      </body>
    </html>
  )
}
