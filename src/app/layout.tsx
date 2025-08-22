import type { Metadata } from "next"

import "./globals.css"
import Providers from "@/app/providers"
import { Toaster } from "@/components/ui/sonner"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: {
    default: "SteamLookup - Find Any Steam Profile Instantly",
    template: "%s - SteamLookup",
  },
  description:
    "Lookup profiles by Steam IDs, vanities or profile URLs. Now with FACEIT support.",
  generator: "Next.js",
  applicationName: "SteamLookup",
  authors: [{ name: "heapy", url: "https://heapy.xyz" }],
  creator: "heapy",
  publisher: "heapy",
  metadataBase: new URL("https://heapy.xyz"),
  alternates: {
    canonical: "/",
  },
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
    "steam profile finder",
    "steam id finder",
    "steam account lookup",
    "find steam id",
    "steam profile search",
    "faceit",
    "faceit lookup",
    "faceit finder",
    "faceit profile",
    "faceit stats",
    "faceit elo",
    "faceit level",
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
        url: "/icon-dark.png",
        href: "/icon-dark.png",
      },
    ],
  },
  openGraph: {
    title: "SteamLookup - Find Any Steam Profile Instantly",
    description:
      "Lookup profiles by Steam IDs, vanities or profile URLs. Now with FACEIT support.",
    url: "https://heapy.xyz",
    siteName: "SteamLookup",
    images: [
      {
        url: "https://heapy.xyz/icon-dark.png",
        width: 512,
        height: 512,
        alt: "Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SteamLookup - Find Any Steam Profile Instantly",
    description:
      "Lookup profiles by Steam IDs, vanities or profile URLs. Now with FACEIT support.",
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
      <head>
        {process.env.ADSENSE_ID && (
          <meta
            name="google-adsense-account"
            content={process.env.ADSENSE_ID}
          />
        )}
      </head>

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
                  border: "none",
                },
                className: "backdrop-blur-2xl backdrop-brightness-50",
              }}
            />
            <Footer />
          </main>
        </Providers>
      </body>
    </html>
  )
}
