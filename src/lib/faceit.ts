import "server-only"

import { Identifier } from "./identifier"
import { FaceitPlayer, InputType } from "@/types"

class FaceitClient {
  private readonly apiKey: string
  private readonly apiUrlBase = "https://open.faceit.com"

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async getPlayer(id64: string): Promise<FaceitPlayer | null> {
    const type = Identifier.identifyInput(id64)
    if (type !== InputType.Steam64) return null

    const response = await this.fetch(
      `/data/v4/players?game=cs2&game_player_id=${id64}`
    )

    if (response.status !== 200) return null

    const data = await response.json()
    if (!data.faceit_url || !data.games.cs2) return null

    return {
      url: data.faceit_url.replace("{lang}", "en"),
      level: data.games.cs2.skill_level,
      elo: data.games.cs2.faceit_elo,
    }
  }

  async getId64(url: string): Promise<string | null> {
    const type = Identifier.identifyInput(url)
    if (type !== InputType.FaceitUrl) return null

    const nickname = url.match(Identifier.reFaceitUrl)![1]
    const response = await this.fetch(`/data/v4/players?nickname=${nickname}`)

    if (response.status !== 200) return null

    const data = await response.json()
    return data.steam_id_64 ?? null
  }

  private async fetch(route: string): Promise<Response> {
    const url = new URL(route, this.apiUrlBase)

    const response = await fetch(url, {
      headers: {
        "user-agent": "SteamLookup by @heapyxyz",
        authorization: `Bearer ${this.apiKey}`,
      },
    })

    console.log(`FaceitClient: ${response.status} ${route}`)

    return response
  }
}

if (!process.env.FACEIT_API_KEY)
  throw new Error("FACEIT_API_KEY variable does not exist")

const globalForFaceit = global as unknown as { faceit: FaceitClient }

export const faceit =
  globalForFaceit.faceit || new FaceitClient(process.env.FACEIT_API_KEY)

if (process.env.NODE_ENV !== "production") globalForFaceit.faceit = faceit
