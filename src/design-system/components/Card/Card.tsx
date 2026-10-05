/**
 * Card — structured container surface.
 *
 * Slots: title + description (header) · children (body) · actions footer.
 * Footer layouts: single action · action pair · pair + leadingAction split
 * opposite via space-between (direction-agnostic: works in RTL).
 * `interactive` enables hover elevation (a :hover state, never a prop-driven look).
 *
 * Brand: surface bg, hairline border, card radius, 16px padding.
 * Resting elevation is the soft card shadow; `interactive` lifts it on hover.
 * Title text-h3 semibold; description text-caption muted.
 * Without any slot (title/description/actions/leadingAction) the card is a
 * plain surface container and renders children directly.
 */
import * as React from "react";
import { cn } from "@/lib/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  /** Footer actions: one button, or a Secondary + Primary pair. */
  actions?: React.ReactNode;
  /** Standalone action opposite `actions` — providing it splits the footer. */
  leadingAction?: React.ReactNode;
  /** Enables hover elevation. */
  interactive?: boolean;
}

export function Card({
  title, description, actions, leadingAction, interactive = false, children, className, onClick, onKeyDown, ...props
}: CardProps) {
  // Whole-card tap target: when the card itself handles clicks, it must be
  // keyboard-operable too (Enter/Space) — a <div onClick> alone is a dead
  // end for keyboard and assistive tech.
  const clickable = interactive && !!onClick;
  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(e);
    if (!clickable || e.defaultPrevented) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
    }
  }
  const structured = !!(title || description || actions || leadingAction);
  return (
    <div
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "rounded-lg border border-border bg-surface p-4 shadow-card",
        structured && "flex flex-col gap-4",
        interactive &&
          "cursor-pointer touch-manipulation transition-[box-shadow,transform,background-color,border-color] duration-standard ease-gentle hover:border-border-strong hover:shadow-card active:scale-[0.99]",
        clickable &&
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
      {...props}
    >
      {(title || description) && (
        <div className="flex flex-col gap-1">
          {title && <h3 className="text-balance text-h3 font-semibold text-foreground">{title}</h3>}
          {description && <p className="text-caption text-muted-foreground">{description}</p>}
        </div>
      )}

      {structured ? children && <div className="text-body text-foreground">{children}</div> : children}

      {(actions || leadingAction) && (
        leadingAction ? (
          <div className="flex items-center justify-between gap-3">
            {leadingAction}
            <div className="flex items-center gap-2">{actions}</div>
          </div>
        ) : (
          <div className="flex items-center justify-start gap-2">{actions}</div>
        )
      )}
    </div>
  );
}
export default Card;
