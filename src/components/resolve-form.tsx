"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { resolve } from "../app/actions"
import { Button, Input } from "@nextui-org/react"

export function ResolveForm() {
  const router = useRouter()
  const [input, setInput] = useState("")
  const [isLoading, setLoading] = useState(false)

  const { data, mutate, isPending } = useMutation({
    mutationFn: resolve,
    onSuccess(data, variables, context) {
      if (data.success) router.push(`/profile/${data.steamId}`)
      else setLoading(false)
    },
  })

  return (
    <div className="flex drop-shadow-background">
      <Input
        name="input"
        className="text-lg"
        classNames={{
          inputWrapper: `
            rounded-none rounded-l-lg bg-black bg-opacity-50
            data-[hover=true]:bg-black group-data-[focus=true]:bg-black 
            data-[hover=true]:bg-opacity-60 group-data-[focus=true]:bg-opacity-60
          `,
        }}
        placeholder="..."
        maxLength={64}
        value={input}
        onValueChange={(value) => setInput(value)}
        onKeyDown={(e) => {
          if (e.key != "Enter" || input.trim().length == 0) return
          setLoading(true)
          mutate({ input })
        }}
        disabled={isLoading}
      />

      <Button
        className="text-lg font-black rounded-none rounded-r-lg w-40 bg-white text-black"
        isLoading={isLoading}
        onPress={() => {
          if (input.trim().length == 0) return
          setLoading(true)
          mutate({ input })
        }}
      >
        Search
      </Button>
    </div>
  )
}
