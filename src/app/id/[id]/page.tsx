import { Error } from "@/src/components/error"
import { Profile } from "@/src/components/profile"
import SteamID from "steamid"
import * as api from "@/src/lib/steam"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const steamID: SteamID | null = await api.resolve((await params).id)
  if (!steamID) return <Error message={"Profile not found!"} />

  return <Profile id={steamID.getSteamID64()} />
}
