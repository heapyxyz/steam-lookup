import Link from "next/link"

export function Navigation() {
  return (
    <div className="fixed flex flex-row items-center justify-center w-screen space-x-3 p-5 font-bold drop-shadow-background z-10">
      <Link href="/" className="transition-opacity opacity-60 hover:opacity-90">
        Home
      </Link>

      <p className="opacity-60">•</p>

      <Link
        href="https://github.com/heapyxyz/steam-lookup"
        target="_blank"
        className="transition-opacity opacity-60 hover:opacity-90"
      >
        GitHub
      </Link>
    </div>
  )
}
