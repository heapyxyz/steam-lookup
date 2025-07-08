import { GithubIcon } from "lucide-react"
import Link from "next/link"
import ExportedImage from "next-image-export-optimizer"

import Center from "@/components/center"
import SearchForm from "@/components/search-form"
import { buttonVariants } from "@/components/ui/button"
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
    <Center>
      <Card className="max-w-lg w-full">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <ExportedImage
              src="/icon-dark.png"
              alt="Logo"
              width={24}
              height={24}
            />
            SteamLookup
          </CardTitle>

          <CardDescription>
            The easiest way to lookup Steam profiles.
          </CardDescription>
        </CardHeader>

        <CardContent className="text-muted-foreground text-sm">
          <b>Supported Inputs</b>

          <ul>
            <li>All SteamID variants, for example:</li>
            <ul>
              <li>76561198875567402</li>
              <li>STEAM_1:0:457650837</li>
              <div className="max-md:hidden">
                <li>[U:1:915301674]</li>
                <li>U:1:915301674</li>
              </div>
            </ul>

            <li>Custom IDs, for example:</li>
            <ul>
              <li>heapyxyz</li>
              <li>gaben</li>
              <div className="max-md:hidden">
                <li>fjmv-jhdp</li>
              </div>
            </ul>

            <li>Short and long URLs, for example:</li>
            <ul>
              <div className="max-md:hidden">
                <li>https://.../profiles/76561198875567402</li>
                <li>https://.../id/heapyxyz</li>
              </div>
              <li>https://s.team/p/fjmv-jhdp</li>
            </ul>
          </ul>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <SearchForm />

          <Link
            href="https://github.com/heapyxyz/steam-lookup"
            target="_blank"
            className={buttonVariants({
              variant: "outline",
              className: "w-full",
            })}
          >
            <GithubIcon />
            GitHub
          </Link>
        </CardFooter>
      </Card>
    </Center>
  )
}
