/**
 * Avatar — photo or calm fallback initial on a soft primary tint.
 * Fallback matters: mentors join before uploading a photo.
 */
import * as React from "react";
import { cn } from "@/lib/cn";

export type AvatarSize = "sm" | "md" | "lg" | "xl";
export interface AvatarProps extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  name: string;
  src?: string;
  size?: AvatarSize;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-label",
  md: "h-12 w-12 text-h3",
  lg: "h-16 w-16 text-h2",
  xl: "h-20 w-20 text-h1",
};

/** Explicit pixel size per step — keeps <img> CLS-free (width/height attrs). */
const sizePx: Record<AvatarSize, number> = { sm: 32, md: 48, lg: 64, xl: 80 };

export function Avatar({ name, src, size = "md", className, ...props }: AvatarProps) {
  const initial = name.trim().charAt(0);
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={name} width={sizePx[size]} height={sizePx[size]} className={cn("rounded-avatar object-cover", sizeClasses[size], className)} {...props} />;
  }
  return (
    <span
      role="img"
      aria-label={name}
      className={cn(
        "inline-flex items-center justify-center rounded-avatar border border-transparent bg-primary-soft font-bold text-primary-soft-foreground",
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {initial}
    </span>
  );
}
export default Avatar;
