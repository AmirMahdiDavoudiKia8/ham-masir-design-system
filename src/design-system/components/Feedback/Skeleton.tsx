/** Skeleton — soft pulse placeholder.
 * Status: proposal — generic reserve, not yet adopted by product. */
import { cn } from "@/lib/cn";
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("animate-pulse rounded-sm bg-muted", className)} />;
}
export default Skeleton;
