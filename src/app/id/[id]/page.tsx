import { Error } from "@/src/components/error"
import { Profile } from "@/src/components/profile"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const response = await fetch(`/api/resolve?id=${(await params).id}`)
  const data = await response.json()
  if (!data) return <Error message={"Profile not found!"} />

  const id = data.steamid64

  if (!id) return <Error message={"Profile not found!"} />

  return <Profile id={id} />
}
