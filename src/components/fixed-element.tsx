import React from "react"

import { cn } from "@/lib/utils"

interface FixedElementProps extends React.ComponentProps<"div"> {
  position: "top" | "bottom"
}

export default function FixedElement({
  children,
  className,
  position,
  ...props
}: FixedElementProps) {
  const positionClass = position === "top" ? "top-0" : "bottom-0"

  return (
    <div
      className={cn(`fixed left-0 right-0`, positionClass, className)}
      {...props}
    >
      {children}
    </div>
  )
}
