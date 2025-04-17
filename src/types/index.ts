export enum BackgroundType {
  Image,
  TiledImage,
  Video,
}

export interface Background {
  type: BackgroundType
  url: string
}

export interface Game {
  name: string
  appId: number
  playtime?: number
}

export interface Profile {
  name: string
  id: string
  timeCreated: number
  avatarUrl: string
  background: Background
  url: string
  level: number
  games: Game[]
}
