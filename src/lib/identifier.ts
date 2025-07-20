import "server-only"

import { InputType } from "@/types"

export class Identifier {
  static readonly reFaceitUrl = RegExp(
    String.raw`(?:(?:https?)?:\/\/)?(?:www.)?faceit.com\/en\/players\/([a-zA-Z0-9_-]{1,20})`
  )

  static readonly reProfileUrlBase = String.raw`(?:(?:https?)?:\/\/)?(?:www.)?steamcommunity.com`
  static readonly reUserUrlBase = String.raw`(?:(?:https?)?:\/\/)?s.team`

  static readonly reProfileUrl64 = RegExp(
    String.raw`^${this.reProfileUrlBase}\/profiles\/(7656119\d{10})`
  )
  static readonly reProfileUrl3 = RegExp(
    String.raw`^${this.reProfileUrlBase}\/profiles\/(\[U:1:\d+\])`
  )
  static readonly reProfileUrlVanity = RegExp(
    String.raw`^${this.reProfileUrlBase}\/id\/([a-zA-Z0-9_-]{2,32})`
  )
  static readonly reUserUrl = RegExp(
    String.raw`^${this.reUserUrlBase}\/p\/([a-z]{1,4}(?:\-[a-z]{1,4})?)`
  )

  static readonly reSteam64 = RegExp(String.raw`^(7656119\d{10})$`)
  static readonly reSteam3 = RegExp(String.raw`^[U:1:\d+]$`)
  static readonly reSteam3NB = RegExp(String.raw`^U:1:\d+$`)
  static readonly reSteam2 = RegExp(String.raw`^(STEAM_[0-1]:[0-9]:\d+)$`)
  static readonly reUser = RegExp(String.raw`^([a-z]{1,4}(?:-[a-z]{1,4})?)$`)
  static readonly reVanity = RegExp(String.raw`^([a-zA-Z0-9_-]{2,32})$`, "i")

  static identifyInput(input: string): InputType {
    if (Identifier.reFaceitUrl.test(input)) return InputType.FaceitUrl
    else if (Identifier.reProfileUrl64.test(input))
      return InputType.ProfileUrl64
    else if (Identifier.reProfileUrl3.test(input)) return InputType.ProfileUrl3
    else if (Identifier.reProfileUrlVanity.test(input))
      return InputType.ProfileUrlVanity
    else if (Identifier.reUserUrl.test(input)) return InputType.UserUrl
    else if (Identifier.reSteam64.test(input)) return InputType.Steam64
    else if (Identifier.reSteam3.test(input)) return InputType.Steam3
    else if (Identifier.reSteam3NB.test(input)) return InputType.Steam3NB
    else if (Identifier.reSteam2.test(input)) return InputType.Steam2
    else if (Identifier.reUser.test(input)) return InputType.User
    else if (Identifier.reVanity.test(input)) return InputType.Vanity

    return InputType.None
  }
}
