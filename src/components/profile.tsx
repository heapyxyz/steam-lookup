import { BackgroundType, Profile } from "@prisma/client"
import SteamID from "steamid"
import Link from "next/link"
import Image from "next/image"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Center from "./center"
import "./profile.css"
import { Bans } from "@/types"
import { buttonVariants } from "./ui/button"
import {
  Faceit,
  FaceitLevelOne,
  FaceitLevelTwo,
  FaceitLevelThree,
  FaceitLevelFour,
  FaceitLevelFive,
  FaceitLevelSix,
  FaceitLevelSeven,
  FaceitLevelEight,
  FaceitLevelNine,
  FaceitLevelTen,
  Steam,
  CsStats,
} from "./icons"

export default function ProfileCard({ profile }: { profile: Profile | null }) {
  if (!profile) return <ProfileNotFound />

  return (
    <>
      <ProfileBackground
        type={profile.backgroundType}
        url={profile.backgroundUrl}
      />

      <Center>
        <Card className="max-w-lg w-full bg-transparent border-0 backdrop-blur-2xl backdrop-brightness-50">
          <CardContent className="text-muted-foreground text-sm text-center flex flex-col items-center gap-2">
            <ProfileAvatar
              href={profile.longUrl}
              avatarUrl={profile.avatarUrl}
              avatarFrameUrl={profile.avatarFrameUrl}
            />

            <ProfileUser
              username={profile.username}
              level={profile.level}
              faceitLevel={profile.faceitLevel}
            />

            <ProfileBans
              communityBanned={profile.communityBanned}
              tradeBanned={profile.tradeBanned}
              vacBans={profile.vacBans}
              gameBans={profile.gameBans}
              daysSinceLastBan={profile.daysSinceLastBan}
            />

            <ProfileBody
              vanity={profile.vanity}
              timeCreated={profile.timeCreated}
              gameCount={profile.gameCount}
              playtime={profile.playtime}
            />

            <ProfileSteamIds steamId={new SteamID(profile.steamId)} />

            <ProfileFaceit
              elo={profile.faceitElo}
              level={profile.faceitLevel}
              url={profile.faceitUrl}
            />

            <ProfileButtons steamId={profile.steamId} />
          </CardContent>
        </Card>
      </Center>
    </>
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

function ProfileAvatar({
  href,
  avatarUrl,
  avatarFrameUrl,
}: {
  href: string
  avatarUrl: string
  avatarFrameUrl: string | null
}) {
  return (
    <Link
      href={href}
      target="_blank"
      className={avatarFrameUrl ? "py-1" : undefined}
    >
      {avatarFrameUrl && (
        <Image
          className="absolute scale-125"
          src={avatarFrameUrl}
          alt="Avatar Frame"
          height={96}
          width={96}
        />
      )}

      <Image
        className={
          avatarFrameUrl
            ? undefined
            : "rounded hover:rounded-xl border-2 border-white/50 hover:border-white transition-all p-1"
        }
        src={avatarUrl}
        alt="Avatar"
        height={96}
        width={96}
      />
    </Link>
  )
}

function ProfileUser({
  username,
  level,
  faceitLevel,
}: {
  username: string
  level: number | null
  faceitLevel: number | null
}) {
  return (
    <div className="flex gap-2 items-center">
      <p className="text-foreground text-xl max-w-[256px] truncate">
        {username}
      </p>

      {level ? <ProfileLevel level={level} /> : undefined}

      {faceitLevel ? <ProfileFaceitLevel level={faceitLevel} /> : undefined}
    </div>
  )
}

function ProfileLevel({ level }: { level: number }) {
  if (level <= 0 || level >= 6200) return

  const getLevelClass = (level: number) => {
    const lvl = Math.floor(level / 100) * 100 || Math.floor(level / 10) * 10
    if (lvl < 100) return `lvl_${lvl}`

    const lvlPlus = Math.floor((level - lvl) / 10) * 10
    return `lvl_${lvl} lvl_plus_${lvlPlus}`
  }

  return (
    <div className={`friendPlayerLevel ${getLevelClass(level)}`}>
      <span className="text-foreground">{level}</span>
    </div>
  )
}

function ProfileFaceitLevel({ level }: { level: number }) {
  switch (level) {
    default:
      return undefined
    case 1:
      return <FaceitLevelOne />
    case 2:
      return <FaceitLevelTwo />
    case 3:
      return <FaceitLevelThree />
    case 4:
      return <FaceitLevelFour />
    case 5:
      return <FaceitLevelFive />
    case 6:
      return <FaceitLevelSix />
    case 7:
      return <FaceitLevelSeven />
    case 8:
      return <FaceitLevelEight />
    case 9:
      return <FaceitLevelNine />
    case 10:
      return <FaceitLevelTen />
  }
}

function ProfileBans({
  communityBanned,
  tradeBanned,
  vacBans,
  gameBans,
  daysSinceLastBan,
}: Bans) {
  return (
    (communityBanned || tradeBanned || vacBans > 0 || gameBans > 0) && (
      <div className="flex flex-col text-red-500">
        {communityBanned && <p>Community Banned</p>}
        {tradeBanned && <p>Trade Banned</p>}

        {vacBans > 0 && (
          <p>
            {vacBans} VAC {vacBans === 1 ? "Ban" : "Bans"}
          </p>
        )}

        {gameBans > 0 && (
          <p>
            {gameBans} Game {gameBans === 1 ? "Ban" : "Bans"}
          </p>
        )}

        {daysSinceLastBan !== 0 && (
          <p>
            {daysSinceLastBan}{" "}
            {daysSinceLastBan === 1
              ? "Day Since Last Ban"
              : "Days Since Last Ban"}
          </p>
        )}
      </div>
    )
  )
}

function ProfileBody({
  vanity,
  timeCreated,
  gameCount,
  playtime,
}: {
  vanity: string | null
  timeCreated: number | null
  gameCount: number
  playtime: number
}) {
  return (
    (vanity || timeCreated || gameCount > 0 || playtime > 0) && (
      <div className="grid grid-cols-2 grid-center-last gap-y-1 gap-x-4">
        {vanity && (
          <div>
            <p className="text-foreground">Vanity</p>
            <p className="select-text">{vanity}</p>
          </div>
        )}

        {timeCreated && (
          <div>
            <p className="text-foreground">Created On</p>
            <p className="select-text">
              {new Date(timeCreated * 1000).toLocaleDateString()}
            </p>
          </div>
        )}

        {gameCount > 0 && (
          <div>
            <p className="text-foreground">Games Owned</p>
            <p className="select-text">{gameCount}</p>
          </div>
        )}

        {playtime > 0 && (
          <div>
            <p className="text-foreground">Playtime</p>
            <p className="select-text">
              {Math.round((playtime * 10) / 60) / 10} Hours
            </p>
          </div>
        )}
      </div>
    )
  )
}

function ProfileSteamIds({ steamId }: { steamId: SteamID }) {
  return (
    <div>
      <p className="text-foreground">Steam IDs</p>
      <p className="select-all">{steamId.getSteam2RenderedID(true)}</p>
      <p className="select-all">{steamId.getSteam3RenderedID()}</p>
      <p className="select-all">{steamId.getSteamID64()}</p>
    </div>
  )
}

function ProfileFaceit({
  level,
  elo,
  url,
}: {
  level: number | null
  elo: number | null
  url: string | null
}) {
  return (
    <>
      {(level || elo) && (
        <div className="grid grid-cols-2 grid-center-last gap-y-1 gap-x-4">
          {level && (
            <div>
              <p className="text-foreground">FACEIT Level</p>
              <p className="select-text">{level}</p>
            </div>
          )}

          {elo && (
            <div>
              <p className="text-foreground">FACEIT Elo</p>
              <p className="select-text">{elo}</p>
            </div>
          )}
        </div>
      )}

      {url && (
        <Link
          className={cn(
            buttonVariants({
              className:
                "max-w-[192px] w-full bg-[#FF5500] hover:bg-[#FF5500]/80",
              size: "sm",
            })
          )}
          href={url}
          target="_blank"
        >
          <Faceit />
          FACEIT
        </Link>
      )}
    </>
  )
}

function ProfileButtons({ steamId }: { steamId: string }) {
  return (
    <>
      <Link
        className={cn(
          buttonVariants({
            className:
              "max-w-[192px] w-full text-foreground bg-[#173ADE] hover:bg-[#173ADE]/80",
            size: "sm",
          })
        )}
        href={`https://csstats.gg/player/${steamId}`}
        target="_blank"
      >
        <CsStats />
        CSSTATS.GG
      </Link>

      <Link
        className={cn(
          buttonVariants({
            className: "max-w-[192px] w-full",
            variant: "secondary",
            size: "sm",
          })
        )}
        href={`https://steamdb.info/calculator/${steamId}`}
        target="_blank"
      >
        <Steam />
        SteamDB
      </Link>
    </>
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
