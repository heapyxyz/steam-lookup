"use client"

import SteamID from "steamid"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Center } from "@/src/components/center"
import { Error } from "@/src/components/error"
import { Level } from "@/src/components/level/level"
import { reProfileURL } from "@/src/lib/steam"
import type { Game, Profile } from "@/src/types"
import { BackgroundType } from "@/src/types"
import { Loading } from "./loading"
import { ResolveForm } from "@/src/components/resolve-form"
import Link from "next/link"

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

export function Profile({ id }: { id: string }) {
  const steamId = new SteamID(id)

  const [profile, setProfile] = useState<null | Profile>(null)
  const [dateCreated, setDateCreated] = useState(0)
  const [playtime, setPlaytime] = useState(0.0)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/profile?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProfile(data)
        setDateCreated(data.timeCreated * 1000)

        if (data.games.length > 0) {
          var playtime = 0
          data.games.forEach((game: Game) => (playtime += game.playtime ?? 0))
          setPlaytime(Number((playtime / 60).toFixed(1)))
        }

        setLoading(false)
      })
  }, [id])

  if (isLoading) return <Loading />
  if (!profile) return <Error message={"Couldn't fetch data!"} />

  const date = new Date(dateCreated)

  return (
    <>
      {profile.background.type == BackgroundType.Image ? (
        ""
      ) : (
        <video
          className="fixed object-cover w-screen h-screen blur-lg"
          autoPlay={true}
          muted={true}
          loop={true}
        >
          <source src={profile.background.url} />
        </video>
      )}

      <Center
        style={{
          backgroundImage:
            profile.background.type == BackgroundType.Image || BackgroundType.TiledImage
              ? `url(${profile.background.url})`
              : "",
          backgroundRepeat:
            profile.background.type == BackgroundType.TiledImage
              ? "repeat"
              : "no-repeat",
          backgroundSize: 
            profile.background.type == BackgroundType.TiledImage
              ? "auto"
              : "cover",
          backgroundPosition: "center center",
        }}
        className="space-y-5"
      >
        <div className="flex flex-col space-y-3 drop-shadow-background z-10">
          <div className="flex flex-col space-y-2 self-center">
            <Link
              href={
                "https://steamcommunity.com/profiles/" + steamId.getSteamID64()
              }
              target="_blank"
              className="rounded-lg transition-all outline outline-offset-2 outline-2 outline-default hover:outline-white self-center"
            >
              <Image
                src={profile.avatarUrl}
                className="rounded-lg"
                width={128}
                height={128}
                alt="Avatar"
                priority={true}
              />
            </Link>

            <div className="flex flex-row justify-center items-center space-x-2">
              <p className="select-text max-w-64 truncate text-2xl font-bold text-center leading-8 my-1">
                {profile.name}
              </p>
              <Level level={profile.level} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="font-bold">SteamID2</p>

              <p className="select-all text-sm">
                {steamId.getSteam2RenderedID(true)}
              </p>
            </div>

            <div>
              <p className="font-bold">SteamID3</p>
              <p className="select-all text-sm">
                {steamId.getSteam3RenderedID()}
              </p>
            </div>

            <div>
              <p className="font-bold">SteamID64</p>

              <p className="select-all text-sm">{steamId.getSteamID64()}</p>
            </div>

            {profile.timeCreated == undefined ? (
              ""
            ) : (
              <div>
                <p className="font-bold">Created on</p>

                <p className="select-text text-sm">
                  {`${date.getDate()} ${
                    months[date.getMonth()]
                  } ${date.getFullYear()}`}
                </p>
              </div>
            )}

            {profile.url.match(reProfileURL) ? (
              ""
            ) : (
              <div>
                <p className="font-bold">Vanity</p>

                <p className="select-text text-sm">
                  {profile.url
                    .replace("https://steamcommunity.com/id/", "")
                    .replace("/", "")}
                </p>
              </div>
            )}

            {playtime == 0 ? (
              ""
            ) : (
              <div>
                <p className="font-bold">Total playtime</p>

                <p className="select-text text-sm">{`${playtime} hours`}</p>
              </div>
            )}
          </div>
        </div>

        <ResolveForm />
      </Center>
    </>
  )
}
