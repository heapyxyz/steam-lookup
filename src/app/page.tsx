import Image from "next/image"

import Center from "@/components/center"
import SearchForm from "@/components/search-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Home() {
  return (
    <>
      <div
        className="fixed top-0 left-0 -z-50 w-full h-dvh bg-center bg-no-repeat bg-cover"
        style={{
          backgroundImage:
            "url(https://steamcommunity-a.akamaihd.net/public/images/profile/2020/bg_dots.png)",
        }}
      />

      <Center>
        <Card className="max-w-lg w-full bg-transparent border-0 backdrop-blur-2xl backdrop-brightness-50">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Image src="/icon-dark.png" alt="Logo" width={24} height={24} />
              <h1>SteamLookup</h1>
            </CardTitle>

            <CardDescription>
              The easiest way to lookup Steam profiles.
            </CardDescription>
          </CardHeader>

          <CardContent className="text-muted-foreground text-sm">
            <b>Supported Inputs</b>

            <ul>
              <li>All SteamID variants:</li>
              <ul>
                <li>76561198875567402</li>
                <li>STEAM_1:0:457650837</li>
                <div className="max-md:hidden">
                  <li>[U:1:915301674]</li>
                  <li>U:1:915301674</li>
                </div>
              </ul>

              <li>Custom IDs:</li>
              <ul>
                <li>heapyxyz</li>
                <li>gaben</li>
                <div className="max-md:hidden">
                  <li>fjmv-jhdp</li>
                </div>
              </ul>

              <li>Short and long URLs:</li>
              <ul>
                <div className="max-md:hidden">
                  <li>https://.../profiles/76561198875567402</li>
                  <li>https://.../id/heapyxyz</li>
                </div>
                <li>https://s.team/p/fjmv-jhdp</li>
              </ul>
            </ul>
          </CardContent>

          <CardFooter className="flex-col gap-4">
            <SearchForm />
            <p className="text-xs text-muted-foreground text-center">
              SteamLookup © 2026 | Not affiliated with Steam or Valve
            </p>
          </CardFooter>
        </Card>
      </Center>
    </>
  )
}
