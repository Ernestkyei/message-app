import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "relative overflow-hidden rounded-md bg-muted animate-pulse",
        className
      )}
      {...props}
    >
      <span className="absolute inset-0 block bg-gradient-to-r from-transparent via-gray-200/60 to-transparent animate-[shimmer_1.5s_infinite]"></span>
    </div>
  );
}

export { Skeleton }
