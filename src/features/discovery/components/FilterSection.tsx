import { ReactNode } from "react";

interface FilterSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

/** Consistent label + spacing wrapper shared by every filter block on the discovery screen. */
export function FilterSection({ title, description, children }: FilterSectionProps) {
  return (
    <section className="flex flex-col gap-2.5">
      <div>
        <h2 className="text-label font-medium text-foreground">{title}</h2>
        {description && (
          <p className="mt-0.5 text-caption text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}
