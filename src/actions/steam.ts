"use server"

import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { type as arktype } from "arktype"

import { steam } from "@/lib/steam"
import { Input, InputType } from "@/types"
import { Identifier } from "@/lib/identifier"
import { faceit } from "@/lib/faceit"

export const resolveAndRedirect = async (input: string) => {
  const out = Input(input)
  if (out instanceof arktype.errors) return { error: `Input ${out.summary}.` }

  const type = Identifier.identifyInput(input)
  const id64 =
    type === InputType.FaceitUrl
      ? await faceit.getId64(input)
      : await steam.resolveToId64(input)

  if (id64 === null)
    return {
      error: `Profile does not exist or an error has occurred. Please try again later.`,
    }

  const headersList = await headers()
  const referer = headersList.get("referer")

  if (referer && referer.includes(`/profiles/${id64}`))
    return {
      error: `You are already on this profile.`,
    }

  redirect(`/profiles/${id64}`)
}
