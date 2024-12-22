"use server"

import SteamID from "steamid"
import * as api from "@/src/lib/steam"

export const resolve = async ({ input }: { input: string }) => {
  const steamId: SteamID | null = await api.resolve(input)

  if (!steamId) return { success: false }

  return { success: true, steamId: steamId.getSteamID64() }
}
