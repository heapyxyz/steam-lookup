import SteamID from "steamid"

// https://github.com/xDimGG/node-steamapi/blob/master/src/SteamAPI.js#L21-L26
const reProfileBase = String.raw`(?:(?:(?:(?:https?)?:\/\/)?(?:www\.)?steamcommunity\.com)?)?\/?`
export const reProfileURL = RegExp(
  String.raw`${reProfileBase}profiles\/(7656119\d{10})`,
  "i"
)
export const reProfileId = RegExp(
  String.raw`${reProfileBase}id\/([a-z0-9_-]{2,32})`,
  "i"
)
export const reSteam64 = RegExp(String.raw`^(7656119\d{10})$`, "i")
export const reSteam2 = RegExp(String.raw`^(STEAM_[0-1]:[0-9]:\d+)$`, "i")
export const reSteam3 = RegExp(String.raw`^(\[U:1:(\d+)\])$`, "i")
export const reSteam3NB = RegExp(String.raw`^(U:1:(\d+))$`, "i")
// NB -> No Brackets

export const apiBasePath = "https://api.steampowered.com"
export const storeApiBasePath = "https://store.steampowered.com/api"

export async function resolve(data: string): Promise<SteamID | null> {
  var steamId: SteamID | undefined

  const urlMatch = data.match(reProfileURL)
  const steam64Match = data.match(reSteam64)
  const steam2Match = data.match(reSteam2)
  const steam3Match = data.match(reSteam3)
  const steam3NBMatch = data.match(reSteam3NB)

  if (urlMatch) steamId = new SteamID(urlMatch[1])
  else if (steam64Match) steamId = new SteamID(steam64Match[1])
  else if (steam2Match) steamId = new SteamID(steam2Match[1])
  else if (steam3Match) steamId = new SteamID(steam3Match[1])
  else if (steam3NBMatch) steamId = new SteamID(`[${data}]`)
  else if (!isNaN(Number(data))) steamId = new SteamID(`[U:1:${data}]`)
  else {
    const vanityMatch = data.match(reProfileId)
    const vanity = vanityMatch !== null ? vanityMatch[1] : data
    const steamFromVanity = await vanityToSteamID(vanity)
    if (steamFromVanity) steamId = new SteamID(steamFromVanity)
  }

  const reCheck = steamId ? steamId.getSteamID64().match(reSteam64) : false
  if (!steamId || !reCheck) return null

  return steamId
}

async function vanityToSteamID(vanity: string): Promise<string | null> {
  const url = `${apiBasePath}/ISteamUser/ResolveVanityURL/v1?vanityurl=${vanity}&key=${process.env.API_KEY}`
  const request = await fetch(url)

  if (request.status == 400) return null

  return (await request.json()).response.steamid
}
