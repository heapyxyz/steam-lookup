import { storeApiBasePath } from "@/src/lib/steam"
import type { Game } from "@/src/types"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id)
    return Response.json({ message: "An id wasn't provided" }, { status: 400 })

  const gameUrl = `${storeApiBasePath}/appdetails?appids=${id}`
  const gameRequest = await fetch(gameUrl)

  if (gameRequest.status == 400)
    return Response.json({ message: "Game doesn't exist" }, { status: 400 })

  const gameResponse = await gameRequest.json()

  if (!gameResponse)
    return Response.json(
      { message: "Couldn't fetch data about game" },
      { status: 400 }
    )

  const game: Game = {
    name: gameResponse[id].data.name,
    appId: Number(id),
  }

  return Response.json(game)
}
