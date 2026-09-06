import { redirect } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { isAdminSession } from "@/lib/adminAuth";
import { loginAdmin } from "./actions";

// Belt-and-suspenders alongside reading `searchParams` (itself a Dynamic API)
// — see /mentor/admin/plan/page.tsx's own comment for why an admin page
// silently getting statically prerendered is a real, previously-hit failure
// mode here, not just a performance nicety.
export const dynamic = "force-dynamic";

interface AdminLoginPageProps {
  searchParams: Promise<{ next?: string; error?: string }>;
}

/** Gate for every /mentor/admin/* page — see lib/adminAuth.ts. Plain form action (no client JS) so the internal redirect() reliably fires — see loginAdmin's own doc comment. */
export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const { next, error } = await searchParams;
  const target = next && next.startsWith("/mentor/admin") ? next : "/mentor/admin/analytics";

  // loginAdmin bounces back here (not straight to `target`) after a
  // successful login — this is the second half of that hop, a plain
  // page-level redirect once the cookie it just set is actually present.
  if (!error && (await isAdminSession())) {
    redirect(target);
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-8 px-6">
      <h1 className="text-h1 font-bold text-foreground">ورود مدیریت</h1>
      <form action={loginAdmin} className="flex w-full max-w-xs flex-col gap-3">
        <input type="hidden" name="next" value={target} />
        <Input
          type="password"
          name="secret"
          dir="ltr"
          autoFocus
          placeholder="رمز"
          className="h-14 text-center text-body"
        />
        {error && <p className="text-center text-caption font-semibold text-danger">رمز اشتباهه.</p>}
        <Button type="submit" size="lg" fullWidth>
          ورود
        </Button>
      </form>
    </div>
  );
}
