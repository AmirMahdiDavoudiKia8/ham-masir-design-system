import Image from "next/image";
import { ThemeToggle } from "@/design-system";
import { SideMenu } from "./SideMenu";

interface HeaderProps {
  title?: string;
}

/** App header — the real brand mark, next to the wordmark, plus the side-menu trigger (see SideMenu) for anything that doesn't fit the four-tab bottom nav. */
export function Header({ title = "هم‌مسیر" }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border/70 bg-surface/90 px-2 backdrop-blur-md">
      <SideMenu />
      <div className="flex flex-1 items-center justify-center gap-2.5">
        <Image src="/brand/logo.png" alt="" width={32} height={32} className="h-8 w-8 object-contain" />
        <span className="text-h3 font-bold text-foreground">
          {title}
        </span>
      </div>
      {/* Night-walk toggle — mirrors the menu button's footprint, so the brand mark stays centered. */}
      <span className="flex h-12 w-12 shrink-0 items-center justify-center">
        <ThemeToggle className="shadow-none" />
      </span>
    </header>
  );
}
