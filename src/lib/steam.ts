import "server-only"

import SteamID from "steamid"
import { BackgroundType, Profile } from "@prisma/client"

import { prisma } from "./prisma"
import { getRandom } from "random-useragent"

enum InputType {
  None,
  ProfileUrl64,
  ProfileUrl3,
  ProfileUrlVanity,
  UserUrl,
  Steam64,
  Steam2,
  Steam3,
  Steam3NB,
  User,
  Vanity,
}

interface Background {
  type: BackgroundType
  url: string
}

class SteamClient {
  private readonly reProfileUrlBase = String.raw`(?:(?:https?)?:\/\/)?(?:www.)?steamcommunity.com`
  private readonly reUserUrlBase = String.raw`(?:(?:https?)?:\/\/)?s.team`

  private readonly reProfileUrl64 = RegExp(
    String.raw`^${this.reProfileUrlBase}\/profiles\/(7656119\d{10})`
  )
  private readonly reProfileUrl3 = RegExp(
    String.raw`^${this.reProfileUrlBase}\/profiles\/(\[U:1:\d+\])`
  )
  private readonly reProfileUrlVanity = RegExp(
    String.raw`^${this.reProfileUrlBase}\/id\/([a-zA-Z0-9_-]{2,32})`
  )
  private readonly reUserUrl = RegExp(
    String.raw`^${this.reUserUrlBase}\/p\/([a-z]{1,4}(?:\-[a-z]{1,4})?)`
  )

  private readonly reSteam64 = RegExp(String.raw`^(7656119\d{10})$`)
  private readonly reSteam3 = RegExp(String.raw`^[U:1:\d+]$`)
  private readonly reSteam3NB = RegExp(String.raw`^U:1:\d+$`)
  private readonly reSteam2 = RegExp(String.raw`^(STEAM_[0-1]:[0-9]:\d+)$`)
  private readonly reUser = RegExp(String.raw`^([a-z]{1,4}(?:-[a-z]{1,4})?)$`)
  private readonly reVanity = RegExp(String.raw`^([a-zA-Z0-9_-]{2,32})$`, "i")

  private readonly apiKey: string
  private readonly apiUrlBase = "https://api.steampowered.com"
  private readonly backgroundUrlBase =
    "https://cdn.fastly.steamstatic.com/steamcommunity/public/images/"

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  private identifyInput(input: string): InputType {
    if (this.reProfileUrl64.test(input)) return InputType.ProfileUrl64
    else if (this.reProfileUrl3.test(input)) return InputType.ProfileUrl3
    else if (this.reProfileUrlVanity.test(input))
      return InputType.ProfileUrlVanity
    else if (this.reUserUrl.test(input)) return InputType.UserUrl
    else if (this.reSteam64.test(input)) return InputType.Steam64
    else if (this.reSteam3.test(input)) return InputType.Steam3
    else if (this.reSteam3NB.test(input)) return InputType.Steam3NB
    else if (this.reSteam2.test(input)) return InputType.Steam2
    else if (this.reUser.test(input)) return InputType.User
    else if (this.reVanity.test(input)) return InputType.Vanity

    return InputType.None
  }

  private async vanityToId64(input: string): Promise<string | null> {
    const response = await this.fetch(
      `${this.apiUrlBase}/ISteamUser/ResolveVanityURL/v1/?key=${this.apiKey}&vanityurl=${input}&url_type=1`
    )

    if (response.status !== 200) return null

    const data = (await response.json()).response
    return data.steamid ?? null
  }

  private async userToId64(input: string): Promise<string | null> {
    if (!input.startsWith("https://") && !input.startsWith("http://"))
      input = `https://${input}`

    const response = await this.fetch(input)
    const url = response.url
    const userId = input.match(this.reUserUrl)![1]

    if (
      url === `https://steamcommunity.com/id/${userId}` ||
      url.startsWith("https://store.steampowered.com")
    )
      return null

    if (!this.reProfileUrl64.test(url) && !this.reProfileUrlVanity.test(url))
      return null

    const id64 = this.reProfileUrl64.test(url)
      ? url.match(this.reProfileUrl64)![1]
      : await this.vanityToId64(url.match(this.reProfileUrlVanity)![1])

    if (id64)
      await prisma.profile.updateMany({
        where: { steamId: id64 },
        limit: 1,
        data: { shortUrl: input },
      })

    return id64
  }

  private async updateOrCreate(profile: Profile) {
    const existingProfile = await prisma.profile.findUnique({
      where: { steamId: profile.steamId },
    })

    if (existingProfile)
      return await prisma.profile.update({
        where: { steamId: profile.steamId },
        data: profile,
      })

    return await prisma.profile.create({ data: profile })
  }

  async resolveToId64(input: string): Promise<string | null> {
    const type = this.identifyInput(input)
    if (type === InputType.None) return null

    switch (type) {
      case InputType.ProfileUrl64:
        return input.match(this.reProfileUrl64)![1]
      case InputType.ProfileUrl3:
        return new SteamID(input.match(this.reProfileUrl3)![1]).getSteamID64()
      case InputType.ProfileUrlVanity:
        return await this.vanityToId64(input.match(this.reProfileUrlVanity)![1])
      case InputType.UserUrl:
        return await this.userToId64(input)
      case InputType.Steam64:
        return input
      case InputType.Steam2:
      case InputType.Steam3:
        return new SteamID(input).getSteamID64()
      case InputType.Steam3NB:
        return new SteamID(`[${input}]`).getSteamID64()
      case InputType.User:
        return await this.userToId64(`https://s.team/p/${input}`)
      case InputType.Vanity:
        return await this.vanityToId64(input)
    }
  }

  async getProfile(id64: string): Promise<Profile | null> {
    const type = this.identifyInput(id64)
    if (type !== InputType.Steam64) return null

    const existingProfile = await prisma.profile.findUnique({
      where: { steamId: id64 },
    })

    // If profile is already in db and was last updated within last 24 hours, return the stored profile
    // Otherwise update the profile and return updated info
    if (
      existingProfile &&
      existingProfile.lastUpdated.getTime() >= Date.now() - 86400000
    )
      return existingProfile

    if (existingProfile) await this.updateOrCreate(existingProfile)

    const response = await this.fetch(
      this.apiUrlBase +
        `/ISteamUser/GetPlayerSummaries/v2/?key=${this.apiKey}&steamids=${id64}`
    )

    if (response.status !== 200) return existingProfile ?? null

    const data = (await response.json()).response.players[0]
    const background = await this.getProfileBackground(id64)
    const level = await this.getProfileLevel(id64)

    const profile: Profile = {
      steamId: id64,
      backgroundType: background.type,
      backgroundUrl: background.url,
      level: level,
      timeCreated: data.timecreated,
      avatarUrl: data.avatarfull,
      longUrl: `https://steamcommunity.com/profiles/${id64}`,
      shortUrl: null,
      username: data.personaname,
      vanity: null,
      lastUpdated: new Date(Date.now()),
    }

    if (this.identifyInput(data.profileurl) === InputType.ProfileUrlVanity)
      profile.vanity = data.profileurl.match(this.reProfileUrlVanity)![1]

    return await this.updateOrCreate(profile)
  }

  async getProfileLevel(id64: string): Promise<number | null> {
    const response = await this.fetch(
      this.apiUrlBase +
        `/IPlayerService/GetSteamLevel/v1/?key=${this.apiKey}&steamid=${id64}`
    )

    if (response.status !== 200) return null

    const data = (await response.json()).response
    return data.player_level
  }

  async getProfileBackground(id64: string): Promise<Background> {
    const background: Background = {
      type: BackgroundType.Image,
      url: "https://steamcommunity-a.akamaihd.net/public/images/profile/2020/bg_dots.png",
    }

    const type = this.identifyInput(id64)
    if (type !== InputType.Steam64) return background

    const response = await this.fetch(
      this.apiUrlBase +
        `/IPlayerService/GetProfileBackground/v1/?key=${this.apiKey}&steamid=${id64}`
    )

    if (response.status !== 200) return background

    const data = (await response.json()).response.profile_background

    if (data.movie_mp4) {
      background.type = BackgroundType.Video
      background.url = this.backgroundUrlBase + data.movie_mp4
    } else if (data.image_large) {
      if (data.tiled === true) background.type = BackgroundType.Tiled
      background.url = this.backgroundUrlBase + data.image_large
    }

    return background
  }

  private async fetch(url: string, retries: number = 10): Promise<Response> {
    for (let i = 0; i < retries; i++) {
      const response = await fetch(url, {
        headers: { "user-agent": getRandom() },
      })
      console.log(`SteamLookup ${response.status} ${url}`)
      if (response.status === 200) return response

      // Delay by i * 1000
      // 1000ms, 2000ms, 3000ms, 4000ms, etc.
      await new Promise((r) => setTimeout(r, i * 1000))
    }

    console.log(`SteamLookup failed to fetch ${url} after ${retries} retries`)
    return new Response(null, {
      status: 418,
      statusText: `Fetch failed after ${retries} retries`,
    })
  }
}

if (!process.env.STEAM_API_KEY)
  throw new Error("STEAM_API_KEY variable does not exist")

const globalForSteam = global as unknown as { steam: SteamClient }

export const steam =
  globalForSteam.steam || new SteamClient(process.env.STEAM_API_KEY)

if (process.env.NODE_ENV !== "production") globalForSteam.steam = steam
