import * as cheerio from "cheerio"
import type { Game, Profile } from "@/src/types"
import { BackgroundType } from "@/src/types"
import { apiBasePath } from "@/src/lib/steam"

// https://steamapi.xpaw.me/

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id)
    return Response.json({ message: "An id wasn't provided" }, { status: 400 })

  // Profile
  const profileUrl = `${apiBasePath}/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.API_KEY}&steamids=${id}`
  const profileRequest = await fetch(profileUrl)

  if (profileRequest.status == 400)
    return Response.json({ message: "Profile doesn't exist" }, { status: 400 })

  const profileResponse = (await profileRequest.json()).response.players[0]

  // Level
  const levelUrl = `${apiBasePath}/IPlayerService/GetSteamLevel/v1/?key=${process.env.API_KEY}&steamid=${id}`
  const levelRequest = await fetch(levelUrl)

  if (levelRequest.status == 400)
    return Response.json(
      { message: "Couldn't fetch profile's level" },
      { status: 400 }
    )

  const levelResponse = (await levelRequest.json()).response.player_level

  // Background
  const backgroundUrl = `https://steamcommunity.com/profiles/${id}`
  const backgroundRequest = await fetch(backgroundUrl)

  if (backgroundRequest.status == 400)
    return Response.json(
      { message: "Couldn't fetch profile's background" },
      { status: 400 }
    )

  const selector = cheerio.load(await backgroundRequest.text())
  var profileBackgroundUrl = selector(".profile_page .has_profile_background")
    .first()
    .attr("style")
  var profileBackgroundType: BackgroundType = BackgroundType.Image

  // If background image wasn't found, use default one
  if (!profileBackgroundUrl)
    profileBackgroundUrl =
      "https://steamcommunity-a.akamaihd.net/public/images/profile/2020/bg_dots.png"
  else
    profileBackgroundUrl = profileBackgroundUrl
      .replace("background-image: url( '", "")
      .replace("' );", "")

  // If background video was found, use it instead
  var animatedBackgroundDiv = selector(".profile_animated_background").first()
  if (animatedBackgroundDiv) {
    var animatedBackgroundVideo = animatedBackgroundDiv.children().first()

    if (animatedBackgroundVideo) {
      var videoSource = animatedBackgroundVideo.children().get(1)?.attribs.src

      if (videoSource) {
        profileBackgroundUrl = videoSource
        profileBackgroundType = BackgroundType.Video
      }
    }
  }

  // Games
  const gamesUrl = `${apiBasePath}/IPlayerService/GetOwnedGames/v1/?key=${process.env.API_KEY}&steamid=${id}&include_played_free_games=true&include_free_sub=true&include_appinfo=true`
  const gamesRequest = await fetch(gamesUrl)

  if (gamesRequest.status == 400)
    return Response.json(
      { message: "Couldn't fetch profile's games" },
      { status: 400 }
    )

  const gamesResponse = (await gamesRequest.json()).response.games
  const games: Game[] = []

  if (gamesResponse != undefined) {
    gamesResponse.forEach((game: any) => {
      games.push({
        name: game.name,
        appId: game.appid,
        playtime: game.playtime_forever,
      })
    })
  }

  const profile: Profile = {
    name: profileResponse.personaname,
    id: profileResponse.steamid,
    timeCreated: profileResponse.timecreated,
    avatarUrl: profileResponse.avatarfull,
    background: {
      type: profileBackgroundType,
      url: profileBackgroundUrl,
    },
    url: profileResponse.profileurl,
    level: levelResponse,
    games: games,
  }

  return Response.json(profile)
}
