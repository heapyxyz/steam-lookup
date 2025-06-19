import { cn } from "@/lib/utils"

export default function Center({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col grow justify-center items-center",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
