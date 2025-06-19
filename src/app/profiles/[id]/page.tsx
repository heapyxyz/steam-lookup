import { BackgroundType } from "@prisma/client"

import FixedElement from "@/components/fixed-element"
import SearchForm from "@/components/search-form"
import { steam } from "@/lib/steam"
import { cn } from "@/lib/utils"
import ProfileCard from "@/components/profile"

export default async function Profile({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const profile = await steam.getProfile(id)

  return (
    <>
      <FixedElement
        position="top"
        className="max-md:p-4 py-4 max-w-lg w-full mx-auto"
      >
        <div
          className={cn(
            "bg-card p-2 rounded-xl",
            profile && profile.backgroundType === BackgroundType.Video
              ? "opacity-75 hover:opacity-100 focus-within:opacity-100 transition-opacity"
              : undefined
          )}
        >
          <SearchForm />
        </div>
      </FixedElement>

      <ProfileCard profile={profile} />
    </>
  )
}
