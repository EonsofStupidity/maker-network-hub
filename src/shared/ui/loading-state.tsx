
import React from "react";
import { Skeleton } from "@/shared/ui/skeleton";
import { cn } from "@/shared/utils/cn";

interface LoadingStateProps {
  className?: string;
  type?: "card" | "text" | "avatar" | "button" | "list" | "custom";
  count?: number;
  height?: number | string;
  width?: number | string;
  children?: React.ReactNode;
}

export function LoadingState({
  className,
  type = "text",
  count = 1,
  height,
  width,
  children,
}: LoadingStateProps) {
  if (children) {
    return <>{children}</>;
  }

  const items = Array.from({ length: count }, (_, i) => i);

  const getSkeletonStyles = () => {
    switch (type) {
      case "card":
        return "h-[180px] w-full rounded-lg";
      case "avatar":
        return "h-10 w-10 rounded-full";
      case "button":
        return "h-9 w-[100px] rounded-md";
      case "list":
        return "h-12 w-full rounded-md";
      case "custom":
        return "";
      default:
        return "h-4 w-[250px] rounded-md";
    }
  };

  const styles = cn(
    getSkeletonStyles(),
    className,
    height && typeof height === "number" ? `h-[${height}px]` : height ? `h-[${height}]` : "",
    width && typeof width === "number" ? `w-[${width}px]` : width ? `w-[${width}]` : ""
  );

  return (
    <>
      {items.map((i) => (
        <Skeleton key={i} className={styles} />
      ))}
    </>
  );
}

/**
 * ContentLoader component to show skeleton loading state for content
 */
export function ContentLoader({
  className,
  lines = 3,
}: {
  className?: string;
  lines?: number;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <LoadingState type="text" width="70%" />
      {Array.from({ length: lines - 1 }, (_, i) => (
        <LoadingState key={i} type="text" width={`${Math.floor(Math.random() * 30) + 60}%`} />
      ))}
    </div>
  );
}

/**
 * CardLoader component to show skeleton loading state for cards
 */
export function CardLoader({
  className,
  count = 1,
  showContent = true,
}: {
  className?: string;
  count?: number;
  showContent?: boolean;
}) {
  return (
    <div className={cn("grid gap-4", className, count > 1 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3")}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <LoadingState type="card" height={120} />
          {showContent && (
            <div className="mt-4 space-y-2">
              <LoadingState type="text" width="60%" />
              <LoadingState type="text" width="40%" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * TableLoader component to show skeleton loading state for tables
 */
export function TableLoader({
  className,
  rows = 5,
  columns = 4,
}: {
  className?: string;
  rows?: number;
  columns?: number;
}) {
  return (
    <div className={cn("w-full overflow-hidden rounded-lg border border-border", className)}>
      <div className="bg-muted/50 p-3">
        <div className="flex items-center gap-4">
          {Array.from({ length: columns }, (_, i) => (
            <LoadingState key={i} type="text" width={`${Math.floor(Math.random() * 20) + 70}px`} />
          ))}
        </div>
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: rows }, (_, rowIndex) => (
          <div key={rowIndex} className="flex items-center gap-4 p-3">
            {Array.from({ length: columns }, (_, colIndex) => (
              <LoadingState 
                key={colIndex} 
                type="text" 
                width={`${Math.floor(Math.random() * 50) + 50}px`} 
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// This will replace both LoadingStates and LoadingState components
export { LoadingState as LoadingStates };
