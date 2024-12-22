import SteamID from "steamid"
import * as api from "@/src/lib/steam"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id)
    return Response.json({ message: "An id wasn't provided" }, { status: 400 })

  const steamID: SteamID | null = await api.resolve(id)

  if (!steamID)
    return Response.json({ message: "Invalid SteamID" }, { status: 400 })

  return Response.json({ steamid64: steamID.getSteamID64() })
}
