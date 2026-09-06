# Ham-Masir — Brand & Art-Direction Guidelines

**For:** Claude Code (and anyone building Ham-Masir's UI)
**Status:** Source of truth for look, feel, motion, imagery, and voice.
**One-line brief:** Ham-Masir is built around *companionship*, not education. The hero is the **relationship** between someone who has walked the path (the mentor) and someone just beginning (the student). Every screen should feel like a calm, warm hand beside a stressed student — quietly saying *"I'm here with you."*

> How to use this file: put every value below into the central theme/token system. **Never hard-code colors, spacing, radii, shadows, type, or motion in components** — reference tokens. When a choice isn't specified here, pick the calmest, most companion-like option. When in doubt: add whitespace, reduce emphasis.

---

## 0. The five laws (read these first)

1. **Companionship before functionality.** The relationship is the hero — never the mentor alone, never the student alone, never the interface.
2. **Calm is the antidote, not denial.** Konkur is high-stakes and anxious. We don't pretend that pressure isn't there — we are the safe harbor inside it. Acknowledge the weight, then relieve it. Never float above the student's reality.
3. **Space is trust.** Whitespace and silence are content, not emptiness. They signal respect, breathing room, and safety. Never sacrifice them for density.
4. **Nothing competitive, nothing loud, nothing corporate.** No finish lines, trophies, races, fireworks. Progress is *walking together*, not winning.
5. **Guidance is gentle.** Curves are soft, transitions are patient, motion accompanies. Nothing collides, bounces, or rushes.

---

## 1. Color tokens

Palette is **brief-pinned** from the logo ("The Accompanied Line") — deliberate, not a default. It stays disciplined: **teal + peach + cream + ink.** 

> **We do NOT use navy.** The manifesto mentioned "deep navy" for stability/trust — we resolve that role into the **primary teal** and a **deep warm ink** (`--ink`), so the palette stays coherent with the logo. (Override only with an explicit decision.)

```
/* Brand */
--leader:        #5B9E94;  /* primary — teal, "the one who walked the path". Trust, calm, guidance. Primary actions, verified, key accents. */
--leader-deep:   #46857C;  /* hover/pressed states of primary; the verified color */
--companion:     #E8B99A;  /* secondary — peach, "the student". Warmth, humanity, welcome. */
--companion-deep:#DBA783;  /* hover/pressed for secondary */

/* Surfaces */
--paper:         #F7F4ED;  /* app background — warm cream, "openness" */
--surface:       #FFFDF8;  /* cards, sheets */
--surface-sunken:#F1ECE0;  /* subtle wells, chips, inputs */

/* Ink / text (the deep, stable anchor — replaces navy) */
--ink:           #2C3A38;  /* primary text; deep warm teal-charcoal (never pure black) */
--ink-muted:     #6E7B78;  /* secondary text */
--ink-faint:     #9AA5A1;  /* placeholders, tertiary */

/* Lines */
--hairline:      #E7E1D3;  /* borders, dividers */

/* Functional — kept calm, never alarming */
--verified:      #46857C;  /* trust signal = teal family, not a loud badge color */
--success:       #6FA98C;
--gentle-alert:  #D99A6C;  /* "behind on plan / needs attention" — a WARM amber from the peach family, NEVER a harsh red */
--scrim:         rgba(44, 58, 56, 0.38); /* bottom-sheet backdrop */
```

**Rules:** No pure black (`#000`) or pure white screaming contrast. No neon, no acid accents, no aggressive gradients. Gradients (if any) are whisper-soft, within one hue. Contrast is intentional and always AA-legible, but never harsh.

---

## 2. Typography

**Font:** Pinar (پینار), loaded locally. Weights: Regular / Medium / SemiBold / Bold.
**Direction:** RTL throughout. Persian numerals (۱۲۳) in all user-facing content.

| Role | Size (mobile) | Weight | Line-height |
|---|---|---|---|
| Display | 30px | Bold | 1.25 |
| H1 | 24px | Bold | 1.3 |
| H2 | 20px | SemiBold | 1.35 |
| H3 | 17px | SemiBold | 1.4 |
| Body | 16px | Regular | 1.7 |
| Caption | 13px | Regular | 1.6 (color: `--ink-muted`) |
| Label/Micro | 12px | Medium | 1.5 |

**Rules:** Generous line-height (1.6–1.75) on Persian body text — it reads as calm and breathes. **Never ALL-CAPS Persian, never heavy letter-spacing on Persian.** Let type be characterful but quiet; the type carries warmth, not drama.

---

## 3. Spacing, radius, elevation

**Spacing scale (4-based):** `4, 8, 12, 16, 20, 24, 32, 40, 48, 64`.
- Screen gutters: 20–24. Card padding: 20–24. Minimum gap between distinct elements: 16.
- **Minimum tap target: 48px.**
- Default to *more* space, not less. Space = trust (Law 3).

**Radius:** `--r-sm: 12px; --r-md: 16px; --r-lg: 20px; --r-pill: 999px;`
Nothing sharp — **no 0-radius corners anywhere.** Curves are soft (Law 5).

**Shadows (soft, warm, low-contrast only):**
```
--shadow-soft:   0 2px 8px rgba(44,58,56,0.06), 0 8px 24px rgba(44,58,56,0.05);
--shadow-lifted: 0 8px 40px rgba(44,58,56,0.12);  /* sheets/modals only */
```
Never harsh, dark, or high-contrast shadows.

---

## 4. Motion — patient, accompanying

- **Durations:** micro 150ms · standard 250ms · entrance 350ms · bottom sheet 340ms.
- **Easing (gentle arrival):** `cubic-bezier(0.22, 0.61, 0.36, 1)` (ease-out). **No bounce, no spring overshoot, no elastic.**
- **Entrances:** fade + a small 8–12px slide inward/upward. *Reveal, don't pop.*
- **Bottom sheet:** slide up 340ms ease-out + scrim fade in.
- **Reduced motion:** respect `prefers-reduced-motion` — collapse to fades ≤120ms, no slides.
- **Rule:** motion *accompanies and guides* — it reveals content and shows the way. It never bounces, never rushes, never pulses for attention. The interface should feel like it's quietly walking beside the user.

---

## 5. Components — principles & do/don't

**Buttons**
- Primary: `--leader` fill, `--paper` text, `--r-pill` (or `--r-md`), generous padding, full-width on mobile for key actions. Press state: darken to `--leader-deep` + subtle `scale(0.98)`. No harsh shadow.
- Secondary: outline/ghost on `--surface`, `--ink` text.
- Copy is active + companion voice (see §8). CTA that opens booking says what happens.

**Mentor card**
- `--surface`, `--r-lg`, `--shadow-soft`, generous padding.
- Trust essentials only, calm hierarchy: name (+ verified) → field + university → rank → rating. **Bio is hidden on the card** (revealed in the booking sheet).
- **Verified badge** is the single most important trust signal: `--verified`, a small check, meaningful and intentional — *never* a loud decorative sticker.

**Bottom sheet** (booking)
- `--surface`, top corners `--r-lg`, drag handle, `--shadow-lifted`, `--scrim` backdrop, slide-up motion.
- Presents the fuller mentor info + the two plan options with equal visual respect (§7). Calm, meaningful choice — never a hard upsell.

**Chips / tags:** `--surface-sunken` or a soft `--companion` tint, `--r-pill`, small, quiet.

**Inputs:** `--surface`, `--hairline` border, `--r-md`, **visible focus ring in `--leader`** (accessibility is non-negotiable).

**Bottom nav:** Home · Discover · Progress · Profile. Fixed, calm, `--surface`, soft.

---

## 6. Imagery & illustration

Translate *"feels like a memory, not an advertisement"* into repeatable, affordable rules:

**Style (define once, reuse everywhere):** soft flat shapes; limited to the brand palette + 1–2 warm neutrals; minimal facial detail; quiet, natural postures. This keeps production cheap and consistent for a solo founder — do NOT commission bespoke, high-detail scenes.

**Content:**
- People **rarely appear alone.** Two figures: walking after class, sitting under a tree, talking over coffee, looking at a map together, one explaining while the other listens.
- If a path exists, it should **suggest someone has walked it before.**
- Characters are authentic and imperfect — students with backpacks, mentors with notebooks. Expressions are quiet and genuine, never theatrical.
- Settings are peaceful and uncrowded: campus paths, libraries, trees, wide skies, warm cafés, shared tables. Natural light, soft shadows.

**Signature motif (use this as the cheap, consistent through-line):** the *accompanied line* — the two-path curve from the logo — as a quiet background/graphic device in headers, empty states, and dividers. On-brand, recognizable, near-free to reuse.

**Never:** stock-photo gloss, dramatic/heroic poses, trophies, medals, confetti, mountaintop-victory clichés, finish lines, crowds, or anything that reads as competition.

---

## 7. Emotional states (how the world holds a *struggling* student)

Calm is easy when things go well. The real test is the discouraged student — and that's exactly when companionship matters most. Never blame. Always leave a way forward.

**Empty state** — an invitation, not a void.
- ✅ "هنوز هم‌مسیری انتخاب نکردی — بیا با هم پیداش کنیم." + one soft graphic + one clear action.

**Behind on plan / missed days** — warm, non-judgmental, forward-looking. Use `--gentle-alert` (warm amber), **never alarming red.**
- ❌ "چرا عقب افتادی؟" / "۳ روز غیبت"
- ✅ "هر روز یه شروعِ تازه‌ست. بیا از همین‌جا ادامه بدیم."

**Errors** — calm, specific, in the interface's voice. No apology-theatre, never vague, always the next step.

**Loading** — soft skeletons. No anxious/urgent spinners.

**Progress / success** — quiet affirmation: a soft check, a gentle rise. **No fireworks, no confetti, no trophies.** Success is shown as steady, shared progress.

---

## 8. Voice & copy

Speak **from beside** the user, never above.

- Companion words: کنارت، باهات، هم‌قدم، بیا با هم. Avoid top-down: باید، مجبوری، الزامیه.
- **Encouraging, never scolding.** Reduce anxiety; never amplify it.
- Plain, warm, human. No corporate filler, no hype, no clever-over-clear.
- **Never competitive framing** (رقابت، شکست‌دادنِ بقیه، برنده). Progress = "با هم جلو رفتن."
- Numbers user-facing = Persian numerals.

**Signature lines (use verbatim):**
- Signature: **با کسی که راهِ تو را رفته**
- Slogan: **مسیرت رو تنها نرو**
- Logo line: **دو مسافر، یک مسیر**

**Booking option titles (verbatim, equal respect):**
- Tier 1: **یک ساعت با کسی که راهِ تو را رفته**
- Tier 2: **یک ماه با کسی که راهِ تو را رفته**

---

## 9. Anti-patterns — hard NO list

- ❌ Navy, neon, acid accents, aggressive gradients, pure black/white screaming contrast.
- ❌ Sharp 0-radius corners; heavy/dark shadows.
- ❌ Bouncy/springy/urgent motion; pulsing attention-grabbing CTAs.
- ❌ Leaderboards or ranking framed as competition; trophies, medals, confetti, finish lines, fireworks.
- ❌ Stock-ad gloss; theatrical "success" imagery; crowds.
- ❌ Dense, crowded layouts; sacrificing whitespace.
- ❌ ALL-CAPS or heavy letter-spacing on Persian.
- ❌ Blaming/scolding copy; competitive language; hype.

---

*Every icon, illustration, animation, button, background, and empty state should feel like it belongs to the same world — a world where experience walks beside curiosity, and no one moves ahead alone. That world is Ham-Masir.*
