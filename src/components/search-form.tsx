"use client"

import { LoaderCircle, Search } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { useEffect, useState } from "react"

import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { resolveAndRedirect } from "@/actions/steam"
import { toast } from "sonner"

const examples = [
  "https://steamcommunity.com/profiles/76561198875567402",
  "https://steamcommunity.com/profiles/[U:1:915301674]",
  "https://steamcommunity.com/id/heapyxyz",
  "https://s.team/p/fjmv-jhdp",
  "76561198875567402",
  "STEAM_1:0:457650837",
  "[U:1:915301674]",
  "U:1:915301674",
  "heapyxyz",
  "fjmv-jhdp",
]

export default function SearchForm() {
  const [placeholder, setPlaceholder] = useState("...")
  const [input, setInput] = useState("")
  const [error, setError] = useState<string | undefined>()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    setPlaceholder(examples[Math.floor(Math.random() * examples.length)])
  }, [])

  const { isPending, mutate: server_resolveAndRedirect } = useMutation({
    mutationFn: resolveAndRedirect,
    onSuccess: (data) => {
      setError(data?.error)
      if (data?.error) toast.error(data.error)
    },
    onError: (error) => {
      setError(undefined)
      if (
        error.message === "An unexpected response was received from the server."
      )
        toast.error(
          "You have been rate limited or an error has occurred. Please try again later."
        )
      else if (error.message === "NEXT_REDIRECT") setIsRedirecting(true)
    },
  })

  return (
    <div className="flex justify-center gap-2 container">
      <Input
        maxLength={64}
        aria-invalid={error !== undefined}
        placeholder={placeholder}
        disabled={isPending || isRedirecting}
        onChange={(event) => setInput(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") server_resolveAndRedirect(input)
        }}
      />

      <Button
        className="cursor-pointer"
        onClick={() => server_resolveAndRedirect(input)}
        disabled={isPending || isRedirecting}
      >
        {isPending || isRedirecting ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          <Search />
        )}
        Search
      </Button>
    </div>
  )
}
