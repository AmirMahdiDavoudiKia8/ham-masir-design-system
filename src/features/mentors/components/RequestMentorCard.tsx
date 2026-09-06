"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Input } from "@/components/ui/Input";
import { FemaleIcon, MaleIcon, UsersIcon } from "@/components/ui/icons";
import { trackClick } from "@/lib/analyticsClient";
import { showToast } from "@/lib/toast";

const GENDER_OPTIONS = [
  { key: "خانم", label: "خانم", Icon: FemaleIcon },
  { key: "آقا", label: "آقا", Icon: MaleIcon },
  { key: "فرقی نداره", label: "فرقی نداره", Icon: UsersIcon },
] as const;

/**
 * Sits at the end of the mentor grid (see MentorList) — for a student whose
 * ideal هم‌مسیر isn't in the catalogue yet. Forwards straight to the same
 * Google Sheet every other lead type goes to (see lib/sheetForward); no
 * dedicated backend, this is a manually-followed-up request, not a live
 * search.
 */
export function RequestMentorCard() {
  const [open, setOpen] = useState(false);
  const [field, setField] = useState("");
  const [rank, setRank] = useState("");
  const [university, setUniversity] = useState("");
  const [gender, setGender] = useState<(typeof GENDER_OPTIONS)[number]["key"] | "">("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const canSubmit = field.trim().length > 0;

  async function handleSubmit() {
    if (!canSubmit || submitting) return;
    trackClick("/student/mentors", "mentor_request_submit");
    setSubmitting(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "mentor_request",
          data: {
            field: field.trim(),
            rank: rank.trim(),
            university: university.trim(),
            gender,
            notes: notes.trim(),
          },
        }),
      });
      setSent(true);
      showToast("درخواستت ثبت شد، به‌زودی بررسیش می‌کنیم", "success");
    } catch {
      showToast("مشکلی پیش اومد، دوباره امتحان کن", "error");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="col-span-full flex flex-col items-center gap-1 rounded-lg border border-border bg-surface p-5 text-center shadow-card">
        <p className="text-body font-bold text-foreground">مرسی! درخواستت ثبت شد</p>
        <p className="text-caption text-muted-foreground">به‌زودی یه هم‌مسیر مناسب برات پیدا می‌کنیم.</p>
      </div>
    );
  }

  return (
    <div className="col-span-full flex flex-col items-center gap-3 rounded-lg border border-border bg-surface p-4 shadow-card">
      <div className="flex w-full max-w-md flex-col gap-1 text-center">
        <p className="text-body font-bold text-foreground">هم‌مسیر دلخواهت توی لیست ما نیست؟</p>
        <p className="text-caption text-muted-foreground">
          مشخصاتش رو برامون بفرست تا یکی شبیهش رو پیدا کنیم
        </p>
      </div>

      {!open ? (
        <Button
          size="md"
          className="w-full max-w-md"
          onClick={() => {
            trackClick("/student/mentors", "mentor_request_open");
            setOpen(true);
          }}
        >
          درخواست بده
        </Button>
      ) : (
        <div className="flex w-full max-w-md flex-col gap-3">
          <Field label="رشته">
            <Input value={field} onChange={(e) => setField(e.target.value)} placeholder="مثلاً پزشکی" />
          </Field>
          <Field label="رتبه">
            <Input value={rank} onChange={(e) => setRank(e.target.value)} placeholder="مثلاً زیر ۵۰۰ منطقه یک" />
          </Field>
          <Field label="دانشگاه">
            <Input value={university} onChange={(e) => setUniversity(e.target.value)} placeholder="مثلاً تهران" />
          </Field>
          <Field label="جنسیت">
            <div className="flex flex-wrap gap-2">
              {GENDER_OPTIONS.map(({ key, label, Icon }) => (
                <Chip key={key} selected={gender === key} onClick={() => setGender(key)}>
                  <Icon className="h-4 w-4" />
                  {label}
                </Chip>
              ))}
            </div>
          </Field>
          <Field label="توضیحات">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="هرچی بیشتر بگی، بهتر پیدا می‌کنیم"
              rows={3}
              className="w-full resize-none rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors duration-standard ease-gentle focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary-light/30"
            />
          </Field>

          <Button size="md" fullWidth disabled={!canSubmit || submitting} onClick={handleSubmit}>
            {submitting ? "در حال ارسال…" : "ارسال درخواست"}
          </Button>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-label font-semibold text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}
