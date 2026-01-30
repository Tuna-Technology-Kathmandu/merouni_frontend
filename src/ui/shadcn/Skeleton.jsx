import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
    return (
        <div
            className={cn(
                "animate-featured-shimmer bg-featured-shimmer bg-[length:200%_100%] rounded-md",
                className
            )}
            {...props}
        />
    );
}

export { Skeleton };
