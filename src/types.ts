import { BackgroundType } from "@prisma/client"
import { type as arktype } from "arktype"

export const Input = arktype("0 < string <= 64")
export type Input = typeof Input.infer

export enum InputType {
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
  FaceitUrl,
}

export interface Background {
  type: BackgroundType
  url: string
}

export interface Bans {
  communityBanned: boolean
  tradeBanned: boolean
  vacBans: number
  gameBans: number
  daysSinceLastBan: number
}

export interface Game {
  appId: number
  playtime: number
}

export interface FaceitPlayer {
  url: string
  level: number
  elo: number
}
