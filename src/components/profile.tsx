import { BackgroundType, Profile } from "@prisma/client"
import SteamID from "steamid"
import Link from "next/link"
import ExportedImage from "next-image-export-optimizer"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Center from "./center"
import "./profile.css"

export default function ProfileCard({ profile }: { profile: Profile | null }) {
  return profile ? (
    <>
      <ProfileBackground
        type={profile.backgroundType}
        url={profile.backgroundUrl}
      />

      <Center>
        <Card className="max-w-lg w-full bg-transparent border-0 backdrop-blur-2xl backdrop-brightness-50">
          <CardContent className="text-muted-foreground text-sm text-center flex flex-col items-center gap-2">
            <Link href={profile.longUrl} target="_blank">
              <ExportedImage
                className="rounded hover:rounded-xl border-2 border-white/50 hover:border-white transition-all p-1"
                src={profile.avatarUrl}
                alt="Avatar"
                height={96}
                width={96}
              />
            </Link>

            <div className="flex gap-2 items-center">
              <p className="text-foreground text-xl max-w-[256px] truncate">
                {profile.username}
              </p>

              {profile.level ? (
                <ProfileLevel level={profile.level} />
              ) : undefined}
            </div>

            <div className="flex flex-col gap-1">
              {profile.vanity ? (
                <div>
                  <p className="text-foreground">Vanity</p>
                  <p className="select-text">{profile.vanity}</p>
                </div>
              ) : undefined}

              {profile.timeCreated ? (
                <div>
                  <p className="text-foreground">Created On</p>
                  <p className="select-text">
                    {new Date(profile.timeCreated * 1000).toLocaleDateString()}
                  </p>
                </div>
              ) : undefined}

              <ProfileSteamIds input={profile.steamId} />
            </div>
          </CardContent>
        </Card>
      </Center>
    </>
  ) : (
    <ProfileNotFound />
  )
}

function ProfileBackground({
  type,
  url,
}: {
  type: BackgroundType
  url: string
}) {
  return type === BackgroundType.Video ? (
    <video
      className="fixed top-0 left-0 -z-50 w-full h-dvh object-cover brightness-50 blur-xs"
      autoPlay={true}
      muted={true}
      loop={true}
    >
      <source src={url} />
    </video>
  ) : (
    <div
      className={cn(
        "fixed top-0 left-0 -z-50 w-full h-dvh bg-center",
        type === BackgroundType.Image
          ? "bg-no-repeat bg-cover"
          : "bg-repeat bg-auto"
      )}
      style={{ backgroundImage: `url(${url})` }}
    />
  )
}

function ProfileLevel({ level }: { level: number }) {
  if (level >= 6200) level = 0

  const getLevelClass = (level = 0) => {
    const lvl = Math.floor(level / 100) * 100 || Math.floor(level / 10) * 10
    const lvl_plus = Math.floor((level - lvl) / 10) * 10

    if (lvl < 100) {
      return `lvl_${lvl}`
    }

    return `lvl_${lvl} lvl_plus_${lvl_plus}`
  }

  return (
    <div className={`friendPlayerLevel ${getLevelClass(level)}`}>
      <span className="profileLevelNum text-foreground">{level}</span>
    </div>
  )
}

function ProfileNotFound() {
  return (
    <Center>
      <h2 className="text-2xl font-bold">Not found!</h2>
      <p className="text-sm text-muted-foreground text-center">
        Profile does not exist or an error has occurred.
        <br />
        Please try again later.
      </p>
    </Center>
  )
}

function ProfileSteamIds({ input }: { input: string }) {
  const steamId = new SteamID(input)

  return (
    <div>
      <p className="text-foreground">Steam IDs</p>
      <p className="select-all">{steamId.getSteam2RenderedID(true)}</p>
      <p className="select-all">{steamId.getSteam3RenderedID()}</p>
      <p className="select-all">{steamId.getSteamID64()}</p>
    </div>
  )
}
