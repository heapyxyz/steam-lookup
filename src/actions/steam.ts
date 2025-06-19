"use server"

import { redirect } from "next/navigation"
import { type } from "arktype"

import { steam } from "@/lib/steam"
import { Input } from "@/types"

export const resolveAndRedirect = async (input: string) => {
  const out = Input(input)
  if (out instanceof type.errors) return { error: `Input ${out.summary}.` }

  const id64 = await steam.resolveToId64(input)
  if (id64 === null)
    return {
      error: `Profile does not exist or an error has occurred. Please try again later.`,
    }

  redirect(`/profiles/${id64}`)
}
