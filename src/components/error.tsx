import { Center } from "@/src/components/center"
import { getRandom, randomErrorMessages } from "@/src/lib/random"

export function Error({ message }: { message: string }) {
  return (
    <Center className="space-y-0">
      <p className="text-2xl font-bold">{message}</p>
      <p className="text-sm italic w-64 text-center">
        {getRandom(randomErrorMessages)}
      </p>
    </Center>
  )
}
