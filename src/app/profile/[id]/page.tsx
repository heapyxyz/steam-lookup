import { Error } from "@/src/components/error"
import { Profile } from "@/src/components/profile"

import * as api from "@/src/lib/steam"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const steam64Match = (await params).id.match(api.reSteam64)

  if (steam64Match == null) return <Error message={"Profile not found!"} />

  return <Profile id={(await params).id} />
}
