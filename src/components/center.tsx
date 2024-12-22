import * as React from "react"
import { cn } from "@/src/lib/utils"

const Center = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col items-center justify-center w-screen h-screen space-y-5",
      className
    )}
    {...props}
  />
))
Center.displayName = "Center"

export { Center }
