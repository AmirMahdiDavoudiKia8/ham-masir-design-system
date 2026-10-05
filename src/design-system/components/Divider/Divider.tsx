/** Divider — hairline, with optional calm label.
 * Status: proposal — trivial layout primitive, not yet adopted by product. */
import { cn } from "@/lib/cn";
export function Divider({ label, className }: { label?: string; className?: string }) {
  if (!label) return <hr className={cn("border-0 border-t border-border", className)} />;
  return (
    <div className={cn("flex items-center gap-3", className)} role="separator">
      <hr className="flex-1 border-0 border-t border-border" />
      <span className="text-label text-muted-foreground">{label}</span>
      <hr className="flex-1 border-0 border-t border-border" />
    </div>
  );
}
export default Divider;
