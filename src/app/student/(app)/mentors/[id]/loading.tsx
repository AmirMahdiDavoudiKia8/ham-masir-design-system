/** Real loading state (implicit Suspense boundary while the server component resolves), mirroring the profile's structure so nothing jumps once content lands. */
export default function MentorProfileLoading() {
  return (
    <div aria-hidden className="flex flex-col gap-9 px-5 pb-10 pt-16">
      <div className="flex flex-col items-center gap-3">
        <div className="h-24 w-24 animate-pulse rounded-full bg-muted" />
        <div className="h-5 w-40 animate-pulse rounded bg-muted" />
        <div className="h-4 w-56 animate-pulse rounded bg-muted" />
        <div className="h-6 w-32 animate-pulse rounded-full bg-muted" />
      </div>

      <div className="flex flex-col gap-3 border-t border-border pt-9">
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
      </div>

      <div className="flex flex-col gap-3 border-t border-border pt-9">
        <div className="h-24 w-full animate-pulse rounded-lg bg-muted" />
        <div className="h-24 w-full animate-pulse rounded-lg bg-muted" />
      </div>
    </div>
  );
}
