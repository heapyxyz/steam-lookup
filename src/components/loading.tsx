import { Center } from "@/src/components/center"
import Image from "next/image"

export function Loading() {
  return (
    <Center>
      <div className="flex flex-row items-center space-x-3">
        <Image src="/favicon.ico" width={96} height={96} alt="Logo" />

        <div>
          <p className="font-black text-5xl leading-none">SteamLookup</p>

          <p className="font-bold">Loading...</p>
        </div>
      </div>
    </Center>
  )
}
