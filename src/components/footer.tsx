import FixedElement from "./fixed-element"

export default function Footer() {
  return (
    <FixedElement
      position="bottom"
      className="text-sm text-muted-foreground p-4 flex max-md:flex-col md:gap-1 justify-center items-center"
    >
      <span>SteamLookup © 2025</span>
      <span className="max-md:hidden">|</span>
      <span>Not affiliated with Steam or Valve</span>
    </FixedElement>
  )
}
