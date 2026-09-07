import { SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement>;

/**
 * Shared icon set — single stroke family (1.75px, 24 viewBox, rounded caps)
 * so every icon on the screen reads as one visual language. Add new icons
 * here rather than one-off inline SVGs in feature components.
 */
function base(props: IconProps) {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...props,
  };
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx={11} cy={11} r={6.5} />
      <path d="m20 20-4.3-4.3" />
    </svg>
  );
}

export function MapPinIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 21s-6.75-5.86-6.75-11.25a6.75 6.75 0 0 1 13.5 0C18.75 15.14 12 21 12 21Z" />
      <circle cx={12} cy={9.75} r={2.25} />
    </svg>
  );
}

export function StethoscopeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 4v6a4 4 0 0 0 8 0V4" />
      <path d="M10 14v2a5 5 0 0 0 10 0v-1" />
      <circle cx={20} cy={13.5} r={1.6} />
      <path d="M6 4H4.5M14 4h1.5" />
    </svg>
  );
}

export function BoltIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12.5 3 5 13.5h5.5L11 21l7.5-10.5H13l-.5-7.5Z" />
    </svg>
  );
}

export function CpuIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x={6} y={6} width={12} height={12} rx={2} />
      <rect x={9.5} y={9.5} width={5} height={5} rx={1} />
      <path d="M9 3v2.2M15 3v2.2M9 18.8V21M15 18.8V21M3 9h2.2M3 15h2.2M18.8 9H21M18.8 15H21" />
    </svg>
  );
}

export function FactoryIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 21V10l5 3.5V10l5 3.5V10l5 3.5V21H4Z" />
      <path d="M4 21h16" />
    </svg>
  );
}

export function ScaleIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3v18M8 21h8" />
      <path d="M5 7h5M14 7h5" />
      <path d="m5 7-2.5 5.2a2.6 2.6 0 0 0 5 0L5 7ZM19 7l-2.5 5.2a2.6 2.6 0 0 0 5 0L19 7Z" />
    </svg>
  );
}

export function BrainIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M9 4.5a2.5 2.5 0 0 0-2.5 2.5 2.5 2.5 0 0 0-1.5 4.4A2.6 2.6 0 0 0 6.5 16a2.6 2.6 0 0 0 2.5 2.6V4.5Z" />
      <path d="M15 4.5a2.5 2.5 0 0 1 2.5 2.5 2.5 2.5 0 0 1 1.5 4.4A2.6 2.6 0 0 1 17.5 16 2.6 2.6 0 0 1 15 18.6V4.5Z" />
    </svg>
  );
}

export function FemaleIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx={12} cy={8.5} r={4.5} />
      <path d="M12 13v8M8.5 18h7" />
    </svg>
  );
}

export function MaleIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx={10.5} cy={13.5} r={5.5} />
      <path d="M15 9l5.5-5.5M15.5 3.5H21V9" />
    </svg>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx={9} cy={8} r={3.2} />
      <path d="M3.5 19a5.7 5.7 0 0 1 11 0" />
      <path d="M16 5.3a3.2 3.2 0 0 1 0 6" />
      <path d="M15 13.2a5.7 5.7 0 0 1 5.5 5.8" />
    </svg>
  );
}

export function CoinIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx={12} cy={12} r={8.5} />
      <path d="M12 7.5v9M9.3 9.8c0-1.3 1.2-2.1 2.7-2.1s2.7.9 2.7 2c0 2.6-5.4 1.4-5.4 4 0 1.2 1.2 2.1 2.7 2.1s2.7-.8 2.7-2.1" />
    </svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x={5} y={10.5} width={14} height={9.5} rx={2.2} />
      <path d="M8 10.5V7.5a4 4 0 1 1 8 0v3" />
    </svg>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export function AwardIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx={12} cy={9} r={5.25} />
      <path d="M9.2 13.6 7.5 20l4.5-2.4 4.5 2.4-1.7-6.4" />
    </svg>
  );
}

export function RepeatIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 12a8 8 0 0 1 13.5-5.8M20 12a8 8 0 0 1-13.5 5.8" />
      <path d="M17 4v3.2h-3.2M7 20v-3.2h3.2" />
    </svg>
  );
}

/** Star with an optional solid fill for rating displays. */
export function StarIcon({
  filled = false,
  className,
  ...rest
}: IconProps & { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={filled ? "currentColor" : "none"}
      className={className}
      {...rest}
    >
      <path d="M12 3.5l2.6 5.4 5.9.7-4.3 4.1 1.1 5.9L12 16.9l-5.3 2.7 1.1-5.9-4.3-4.1 5.9-.7L12 3.5Z" />
    </svg>
  );
}

export function SparkleIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3v3.2M12 17.8V21M3 12h3.2M17.8 12H21M6 6l2.2 2.2M15.8 15.8 18 18M18 6l-2.2 2.2M8.2 15.8 6 18" />
      <circle cx={12} cy={12} r={2.6} />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9a1 1 0 0 0 1 1h3v-5h4v5h3a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}

export function ProgressIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 20V13M10 20V8M16 20v-6M20 20V4" />
    </svg>
  );
}

export function ProfileIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx={12} cy={8} r={3.5} />
      <path d="M5 20c1.2-3.5 4-5.5 7-5.5s5.8 2 7 5.5" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx={12} cy={12} r={8.25} />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

/**
 * The brand's signature motif — "the accompanied line", two paths that
 * travel together (دو مسافر، یک مسیر). Unlike the rest of this file it's
 * intentionally two-tone (leader teal + companion peach), for reuse as a
 * quiet graphic in empty states, headers, and dividers — never a functional
 * icon, so it skips the shared single-stroke-color `base()` helper.
 */
export function AccompaniedLineIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
      <path
        d="M6 36c8 0 8-14 16-14s8-14 16-14"
        className="stroke-primary"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <path
        d="M6 12c8 0 8 14 16 14s8 14 16 14"
        className="stroke-secondary-dark"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ShieldCheckIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3.2 5 6v5.6c0 4.2 2.8 7.4 7 9.2 4.2-1.8 7-5 7-9.2V6l-7-2.8Z" />
      <path d="m9 12 2.2 2.2L15.4 10" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  );
}

export function BookIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H12v18H6.5A2.5 2.5 0 0 1 4 18.5v-13Z" />
      <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H12v18h5.5a2.5 2.5 0 0 0 2.5-2.5v-13Z" />
    </svg>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x={4} y={5.5} width={16} height={14.5} rx={2.2} />
      <path d="M4 10h16M8 3v4M16 3v4" />
    </svg>
  );
}

export function CompassIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx={12} cy={12} r={8.5} />
      <path d="m14.8 9.2-1.9 4.7-4.7 1.9 1.9-4.7 4.7-1.9Z" />
    </svg>
  );
}

export function ChatIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 12.2C4 7.7 7.8 4 12.5 4S21 7.7 21 12.2 17.2 20.4 12.5 20.4c-1 0-1.9-.15-2.8-.45L5 21.5l1.3-3.7a7.9 7.9 0 0 1-2.3-5.6Z" />
    </svg>
  );
}

export function VideoIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x={3} y={6.5} width={12.5} height={11} rx={2.2} />
      <path d="M15.5 10.8 21 8v8l-5.5-2.8Z" />
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6.6 3.6 4 6.2c-1 3.8 1.7 9.2 5.2 12.7 3.5 3.5 8.9 6.2 12.7 5.2l2.6-2.6a1.4 1.4 0 0 0-.3-2.2l-3.8-2.4a1.4 1.4 0 0 0-1.7.2l-1.3 1.3c-1.9-1-3.9-3-4.9-4.9l1.3-1.3a1.4 1.4 0 0 0 .2-1.7L11.7 6.5a1.4 1.4 0 0 0-2.2-.3L6.6 3.6Z" />
    </svg>
  );
}

export function EditIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M15.7 4.3 19.7 8.3 8.2 19.8H4.2v-4l11.5-11.5Z" />
      <path d="m13.6 6.4 4 4" />
    </svg>
  );
}

export function LogOutIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M13 4H9.5A2.5 2.5 0 0 0 7 6.5v11A2.5 2.5 0 0 0 9.5 20H13" />
      <path d="M20 12H10.5M20 12l-3.5-3.5M20 12l-3.5 3.5" />
    </svg>
  );
}

export function CameraIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1.2-1.8A1.5 1.5 0 0 1 10 4.5h4a1.5 1.5 0 0 1 1.3.7L16.5 7h2A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5v-9Z" />
      <circle cx={12} cy={13} r={3.3} />
    </svg>
  );
}

export function SendIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4.5 11.2 19.5 4l-5.3 15.8-3-6.3-6.7-2.3Z" />
      <path d="m10.9 13.3 3.3-3.3" />
    </svg>
  );
}

export function UploadIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 15V4M8 8l4-4 4 4" />
      <path d="M4.5 15v3.5A1.5 1.5 0 0 0 6 20h12a1.5 1.5 0 0 0 1.5-1.5V15" />
    </svg>
  );
}

export function FileIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6.5 3.5h7l4 4v12.5a1 1 0 0 1-1 1h-10a1 1 0 0 1-1-1v-15.5a1 1 0 0 1 1-1Z" />
      <path d="M13.5 3.5V8h4" />
    </svg>
  );
}

export function IdCardIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x={3} y={5.5} width={18} height={13} rx={2} />
      <circle cx={8.5} cy={11} r={2} />
      <path d="M5.5 16c.6-1.7 1.8-2.5 3-2.5s2.4.8 3 2.5" />
      <path d="M14 9.5h5M14 13h5" />
    </svg>
  );
}

export function CodeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m9 8-4 4 4 4M15 8l4 4-4 4" />
    </svg>
  );
}

export function BuildingIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x={5} y={3} width={14} height={18} rx={1.5} />
      <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" />
    </svg>
  );
}

export function RocketIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 2c2.5 2 4 5.5 4 9.5 0 2-.5 4-1.5 5.5L12 20l-2.5-3c-1-1.5-1.5-3.5-1.5-5.5C8 7.5 9.5 4 12 2Z" />
      <circle cx={12} cy={9.5} r={1.6} />
      <path d="M8.5 15.5 6 18M15.5 15.5 18 18" />
    </svg>
  );
}

export function GearIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx={12} cy={12} r={3} />
      <path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.8 5.8l1.5 1.5M16.7 16.7l1.5 1.5M5.8 18.2l1.5-1.5M16.7 7.3l1.5-1.5" />
    </svg>
  );
}

export function ToothIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M8.5 3c-2 0-3.5 1.8-3.5 4 0 2 .8 3.3 1 5.5.2 2 .5 6.5 2 6.5 1.2 0 1.3-3.5 1.8-5 .3-1 .7-1.5 1.2-1.5s.9.5 1.2 1.5c.5 1.5.6 5 1.8 5 1.5 0 1.8-4.5 2-6.5.2-2.2 1-3.5 1-5.5 0-2.2-1.5-4-3.5-4-1 0-1.7.5-2.5.5S9.5 3 8.5 3Z" />
    </svg>
  );
}

export function PillIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x={3} y={9.5} width={18} height={5} rx={2.5} transform="rotate(-45 12 12)" />
      <path d="M12 9.5v5" transform="rotate(-45 12 12)" />
    </svg>
  );
}

export function BriefcaseIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x={3.5} y={7.5} width={17} height={12} rx={2} />
      <path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5" />
      <path d="M3.5 12.5h17" />
    </svg>
  );
}

export function GraduationCapIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m12 4 9 4.5-9 4.5-9-4.5 9-4.5Z" />
      <path d="M7 11v4.5c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5V11" />
      <path d="M21 8.5v5" />
    </svg>
  );
}
