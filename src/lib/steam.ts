import "server-only"

import SteamID from "steamid"
import { BackgroundType, Profile } from "@prisma/client"
import { getRandom } from "random-useragent"

import { prisma } from "./prisma"
import { Background, Bans, Game, InputType } from "@/types"
import { Identifier } from "./identifier"
import { faceit } from "./faceit"

class SteamClient {
  private readonly apiKey: string
  private readonly apiUrlBase = "https://api.steampowered.com"
  private readonly cdnUrlBase =
    "https://cdn.fastly.steamstatic.com/steamcommunity/public/images/"
  private readonly currentlyFetching = new Set<string>()

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  private async vanityToId64(input: string): Promise<string | null> {
    const response = await this.fetch(
      `/ISteamUser/ResolveVanityURL/v1/?key=${this.apiKey}&vanityurl=${input}&url_type=1`
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
    const userId = input.match(Identifier.reUserUrl)![1]

    if (
      url === `https://steamcommunity.com/id/${userId}` ||
      url.startsWith("https://store.steampowered.com")
    )
      return null

    if (
      !Identifier.reProfileUrl64.test(url) &&
      !Identifier.reProfileUrlVanity.test(url)
    )
      return null

    const id64 = Identifier.reProfileUrl64.test(url)
      ? url.match(Identifier.reProfileUrl64)![1]
      : await this.vanityToId64(url.match(Identifier.reProfileUrlVanity)![1])

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

    let newProfile
    if (existingProfile)
      newProfile = await prisma.profile.update({
        where: { steamId: profile.steamId },
        data: profile,
      })
    else newProfile = await prisma.profile.create({ data: profile })

    this.currentlyFetching.delete(profile.steamId)

    return newProfile
  }

  async resolveToId64(input: string): Promise<string | null> {
    const type = Identifier.identifyInput(input)

    switch (type) {
      default:
        return null
      case InputType.ProfileUrl64:
        return input.match(Identifier.reProfileUrl64)![1]
      case InputType.ProfileUrl3:
        return new SteamID(
          input.match(Identifier.reProfileUrl3)![1].toUpperCase()
        ).getSteamID64()
      case InputType.ProfileUrlVanity:
        return await this.vanityToId64(
          input.match(Identifier.reProfileUrlVanity)![1]
        )
      case InputType.UserUrl:
        return await this.userToId64(input)
      case InputType.Steam64:
        return input
      case InputType.Steam2:
      case InputType.Steam3:
        return new SteamID(input.toUpperCase()).getSteamID64()
      case InputType.Steam3NB:
        return new SteamID(`[${input.toUpperCase()}]`).getSteamID64()
      case InputType.User:
        return await this.userToId64(`https://s.team/p/${input}`)
      case InputType.Vanity:
        return await this.vanityToId64(input)
    }
  }

  async getProfile(id64: string): Promise<Profile | null> {
    const type = Identifier.identifyInput(id64)
    if (type !== InputType.Steam64) return null

    const existingProfile = await prisma.profile.findUnique({
      where: { steamId: id64 },
    })

    // If profile is already in the db and was last updated within last 30 minutes or is already being fetched, return stored data
    // Otherwise fetch the profile and return updated data
    if (
      existingProfile &&
      (existingProfile.lastUpdated.getTime() >= Date.now() - 1800000 ||
        this.currentlyFetching.has(id64))
    )
      return existingProfile
    // If profile is already being fetched but doesn't exist in the db, wait for it to be stored and then return its data
    else if (!existingProfile && this.currentlyFetching.has(id64))
      for (let i = 0; i < 10; i++) {
        await new Promise((r) => setTimeout(r, 1000))
        const profile = await prisma.profile.findUnique({
          where: { steamId: id64 },
        })
        if (profile) return profile
      }

    this.currentlyFetching.add(id64)

    const response = await this.fetch(
      `/ISteamUser/GetPlayerSummaries/v2/?key=${this.apiKey}&steamids=${id64}`
    )

    if (response.status !== 200) return existingProfile ?? null

    const data = (await response.json()).response.players[0]
    const background = await this.getBackground(id64)
    const level = await this.getLevel(id64)
    const animatedAvatar = await this.getAnimatedAvatar(id64)
    const avatarFrame = await this.getAvatarFrame(id64)
    const bans = await this.getBans(id64)
    const games = await this.getGames(id64)
    const faceitPlayer = await faceit.getPlayer(id64)

    const profile: Profile = {
      steamId: id64,
      backgroundType: background.type,
      backgroundUrl: background.url,
      level: level,
      timeCreated: data.timecreated,
      avatarUrl: animatedAvatar ?? data.avatarfull,
      avatarFrameUrl: avatarFrame,
      longUrl: `https://steamcommunity.com/profiles/${id64}`,
      shortUrl: null,
      username: data.personaname,
      vanity: null,
      communityBanned: bans.communityBanned,
      tradeBanned: bans.tradeBanned,
      vacBans: bans.vacBans,
      gameBans: bans.gameBans,
      daysSinceLastBan: bans.daysSinceLastBan,
      gameCount: games.gameCount,
      playtime: games.games.reduce((total, game) => total + game.playtime, 0),
      csPlaytime: games.games
        .filter((game) => game.appId === 730)
        .reduce((total, game) => total + game.playtime, 0),
      faceitUrl: faceitPlayer?.url ?? null,
      faceitLevel: faceitPlayer?.level ?? null,
      faceitElo: faceitPlayer?.elo ?? null,
      lastUpdated: new Date(Date.now()),
    }

    if (
      Identifier.identifyInput(data.profileurl) === InputType.ProfileUrlVanity
    )
      profile.vanity = data.profileurl.match(Identifier.reProfileUrlVanity)![1]

    return await this.updateOrCreate(profile)
  }

  async getBackground(id64: string): Promise<Background> {
    const background: Background = {
      type: BackgroundType.Image,
      url: "https://steamcommunity-a.akamaihd.net/public/images/profile/2020/bg_dots.png",
    }

    const type = Identifier.identifyInput(id64)
    if (type !== InputType.Steam64) return background

    const response = await this.fetch(
      `/IPlayerService/GetProfileBackground/v1/?key=${this.apiKey}&steamid=${id64}`
    )

    if (response.status !== 200) return background

    const data = (await response.json()).response.profile_background

    if (data.movie_mp4) {
      background.type = BackgroundType.Video
      background.url = this.cdnUrlBase + data.movie_mp4
    } else if (data.image_large) {
      if (data.tiled === true) background.type = BackgroundType.Tiled
      background.url = this.cdnUrlBase + data.image_large
    }

    return background
  }

  async getLevel(id64: string): Promise<number | null> {
    const response = await this.fetch(
      `/IPlayerService/GetSteamLevel/v1/?key=${this.apiKey}&steamid=${id64}`
    )

    if (response.status !== 200) return null

    const data = (await response.json()).response
    return data.player_level
  }

  async getAnimatedAvatar(id64: string): Promise<string | null> {
    const type = Identifier.identifyInput(id64)
    if (type !== InputType.Steam64) return null

    const response = await this.fetch(
      `/IPlayerService/GetAnimatedAvatar/v1/?key=${this.apiKey}&steamid=${id64}`
    )

    if (response.status !== 200) return null

    const data = (await response.json()).response.avatar
    return data.image_small ? this.cdnUrlBase + data.image_small : null
  }

  async getAvatarFrame(id64: string): Promise<string | null> {
    const type = Identifier.identifyInput(id64)
    if (type !== InputType.Steam64) return null

    const response = await this.fetch(
      `/IPlayerService/GetAvatarFrame/v1/?key=${this.apiKey}&steamid=${id64}`
    )

    if (response.status !== 200) return null

    const data = (await response.json()).response.avatar_frame
    return data.image_small ? this.cdnUrlBase + data.image_small : null
  }

  async getBans(id64: string): Promise<Bans> {
    const bans: Bans = {
      communityBanned: false,
      tradeBanned: false,
      vacBans: 0,
      gameBans: 0,
      daysSinceLastBan: 0,
    }

    const type = Identifier.identifyInput(id64)
    if (type !== InputType.Steam64) return bans

    const response = await this.fetch(
      `/ISteamUser/GetPlayerBans/v1/?key=${this.apiKey}&steamids=${id64}`
    )

    if (response.status !== 200) return bans

    const data = (await response.json()).players[0]
    if (!data) return bans

    bans.communityBanned = data.CommunityBanned
    bans.tradeBanned = data.EconomyBan !== "none"
    bans.vacBans = data.NumberOfVACBans
    bans.gameBans = data.NumberOfGameBans
    bans.daysSinceLastBan = data.DaysSinceLastBan

    return bans
  }

  async getGames(id64: string): Promise<{ gameCount: number; games: Game[] }> {
    const games: Game[] = []

    const type = Identifier.identifyInput(id64)
    if (type !== InputType.Steam64) return { gameCount: 0, games }

    const response = await this.fetch(
      `/IPlayerService/GetOwnedGames/v1/?key=${this.apiKey}&steamid=${id64}`
    )

    if (response.status !== 200) return { gameCount: 0, games }

    const data = (await response.json()).response
    const gameCount = data.game_count
    if (!gameCount || !data.games) return { gameCount: 0, games }

    for (const game of data.games) {
      games.push({
        appId: game.appid,
        playtime: Math.round((game.playtime_forever * 10) / 60) / 10,
      })
    }

    return { gameCount, games }
  }

  private async fetch(route: string, retries: number = 10): Promise<Response> {
    const url = new URL(route, this.apiUrlBase)

    for (let i = 0; i < retries; i++) {
      const response = await fetch(url, {
        headers: { "user-agent": getRandom() },
      })

      console.log(`SteamClient: ${response.status} ${route}`)

      if (response.status === 200) return response

      // Delay by 2^i * 100ms + a random delay up to 1000ms
      const delay = Math.pow(2, i) * 100 + Math.random() * 1000
      await new Promise((r) => setTimeout(r, delay))
    }

    console.log(
      `SteamClient: failed to fetch ${route} after ${retries} retries`
    )

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
