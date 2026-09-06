# Deploying HamMasir to the VPS (1 vCPU / 2GB RAM, Iran)

Two files in this folder:
- `nginx.conf` — reverse proxy + static file serving + SSL
- `ecosystem.config.js` — PM2 process config for the standalone server

## Why build locally, not on the VPS

`next build` is memory-heavy and can OOM a 2GB box. Build on your own
machine (or free CI), then copy only the output up. The VPS never runs
`npm install` or `next build` at all.

## Directory layout on the VPS

```
/var/www/hammasir/
  persistent/
    mentorPortal/          # mentor accounts + student records (the only real DB this app has)
    mentors-uploads/       # photos/voices mentors upload from the portal
    paymentRequests.json   # Telegram/Bale payment-bot handoff log
    studentBookings.json   # durable, phone-keyed booking list (cross-device restore)
    studentIdentities.json # student accounts: phone -> name + password
    studentProfiles.json   # phone -> major/city/onboarding-quiz answers (see lib/studentProfiles.ts)
    analytics/             # one JSONL file per day, self-hosted pageview/click log
    leads.json             # every quiz/registration/booking/cancellation/mentor-signup lead — see /mentor/admin/leads
    progress.json          # weekly study plan the founder edits at /mentor/admin/plan (see app/mentor/admin/plan/actions.ts saveStudyPlan)
    mentors-catalogue.json # curated mentor catalogue — editable by catalogue mentors themselves via /mentor/portal/profile (see lib/mentors.ts updateCatalogueMentor)
    .env.local             # Google Sheet webhook URL/secret, etc. (leads.json above is now the primary lead record, not this)
  current -> releases/2026-08-26-1/   # symlink, swapped atomically on each deploy
  releases/
    2026-08-26-1/
      server.js
      .next/
      public/
      src/data/
      ecosystem.config.js
```

**Every persistent/ entry above must be symlinked on every deploy** — missing even one silently resets that data to the repo's empty placeholder (`{}`/`[]`) on the next release. That is no longer done by hand: `deploy/persistent-manifest.txt` is the single list, `deploy/link-persistent.sh` applies it, and `deploy/verify-persistent.sh` refuses to let a half-linked release go live.

This has bitten the project twice, both times silently. First, `studentBookings.json`, `studentIdentities.json` and `analytics/` were added to the app after this README was written and the symlink step drifted out of sync. Then it happened again and went unnoticed for far longer: `src/data/progress/progress.json` — the weekly study plan the founder edits at `/mentor/admin/plan` — was never in the list at all, so every release quietly reverted the plan to whatever the repo shipped. The count in this very paragraph used to read "eight" while the list below it had grown to ten, which is exactly how the drift hides.

Remembering is not a control. `npm run check:persistent` scans the code for every `path.join(process.cwd(), …)` and fails if the manifest does not cover it, so a new runtime-written path cannot reach the server unlisted. Run it before every release — it is wired into `npm run build`.

**Always keep the `rm -rf` immediately before each `ln -s` below — never skip it, even for a "quick" manual deploy.** `next build`'s standalone output embeds whatever real files/directories currently sit at these paths in the repo (`src/data/mentorPortal/`, `public/mentors/portal/`) — and for a *directory* target, `ln -sfn target linkname` does **not** replace an existing plain directory at `linkname`; it silently nests the symlink *inside* it instead (`linkname/target-basename`), leaving the stale directory itself untouched as the path the app actually reads/writes. This bit the project for real: several deploys in a row silently served/wrote to that stale embedded snapshot instead of persistent storage, wiping real mentor-portal registrations each time. The fix in this README's own build+deploy steps below has always been correct; the incident happened by deploying ad hoc from memory instead of following them exactly. `src/data/mentorPortal/` and `public/mentors/portal/` in the repo should always stay the empty placeholders they ship as (`mentors.json` = `[]`, `students/` = empty, no stray uploads) specifically so an accidental skip of `rm -rf` fails safe (nothing to embed) instead of failing silent.

`persistent/` is never touched by a deploy. Everything that gets
overwritten each release lives under `releases/<date>/`, and `current` is
just a symlink pointed at whichever release is live.

## One-time server setup

```bash
sudo apt update && sudo apt install -y nginx certbot python3-certbot-nginx
sudo npm install -g pm2   # needs Node installed first (nodejs 20+)

sudo mkdir -p /var/www/hammasir/persistent/mentorPortal/students
sudo mkdir -p /var/www/hammasir/persistent/mentors-uploads
sudo mkdir -p /var/www/hammasir/releases

# swap — cheap insurance against OOM on a 2GB box, even though builds happen elsewhere
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

sudo cp nginx.conf /etc/nginx/sites-available/hammasirsite.ir
sudo ln -s /etc/nginx/sites-available/hammasirsite.ir /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# first cert issuance (nginx.conf already has the right paths for reuse after this)
sudo certbot --nginx -d hammasirsite.ir -d www.hammasirsite.ir
```

## Build + deploy (run this from your own machine each release)

```bash
# 1. Build locally
npm run build

# 2. Package exactly what the server needs
RELEASE=$(date +%Y-%m-%d-%H%M)
mkdir -p /tmp/hammasir-release
cp -r .next/standalone/. /tmp/hammasir-release/
cp -r .next/static /tmp/hammasir-release/.next/static
cp -r public /tmp/hammasir-release/public
cp deploy/ecosystem.config.js /tmp/hammasir-release/
mkdir -p /tmp/hammasir-release/deploy
cp deploy/persistent-manifest.txt deploy/link-persistent.sh deploy/verify-persistent.sh /tmp/hammasir-release/deploy/

# 3. Ship it (scp -r, since this is deployed from Windows where rsync isn't available)
scp -r /tmp/hammasir-release/. user@your-vps:/var/www/hammasir/releases/$RELEASE/

# 3b. Verify the transfer actually completed — this session's outbound
# connection has dropped mid-scp before ("Connection reset by peer") with
# scp itself still printing a misleadingly-clean exit. .next/server (the
# thing pages render from) transferred fine, but .next/static (what nginx's
# `^~ /_next/static/` block serves directly — see nginx.conf) was silently
# left ~1/3 complete: pages still returned 200 (server-rendered HTML is
# unaffected), but every JS chunk 404'd, so nothing hydrated and every form
# button stayed permanently disabled. Compare file counts before trusting a
# transfer, especially on a flaky connection:
find /tmp/hammasir-release/.next/static -type f | wc -l
ssh user@your-vps "find /var/www/hammasir/releases/$RELEASE/.next/static -type f | wc -l"
# If they don't match, re-send just that directory (safe to overwrite):
# ssh user@your-vps "rm -rf /var/www/hammasir/releases/$RELEASE/.next/static"
# scp -r /tmp/hammasir-release/.next/static user@your-vps:/var/www/hammasir/releases/$RELEASE/.next/static

# 4. On the VPS: point the persistent data in, verify, then swap the release live
#
# link-persistent.sh reads deploy/persistent-manifest.txt, so the list can no
# longer drift from what the code actually writes, and it verifies every link
# before returning. If anything is wrong it exits non-zero and `set -e` stops
# the deploy here — with `current` still pointing at the previous release, so
# the site keeps serving the old version instead of writing to the wrong place.
ssh user@your-vps <<EOF
  set -e
  cd /var/www/hammasir/releases/$RELEASE
  bash deploy/link-persistent.sh /var/www/hammasir/releases/$RELEASE
  ln -sfn /var/www/hammasir/releases/$RELEASE /var/www/hammasir/current
  cd /var/www/hammasir/current
  # NOTE: pm2 startOrReload does NOT pick up the new script path/cwd for an
  # already-registered app — it silently keeps serving the OLD release
  # (confirmed: static assets added in the new release 404'd while old ones
  # kept working, because the running process was still bound to the
  # previous release directory). delete + start avoids that.
  pm2 delete hammasir || true
  pm2 start ecosystem.config.js
  pm2 save
EOF
```

## First deploy only

Seed the persistent dirs from the repo's current dev data so the site isn't
empty on first boot:

```bash
scp -r "src/data/mentorPortal/." user@your-vps:/var/www/hammasir/persistent/mentorPortal/
```

(The example voice-intro clip shown on the portal's own profile-setup screen is a normal static asset at `public/sample-voice-intro.m4a` — deliberately *not* inside `public/mentors/portal/`, since that path is the persistent-uploads mount and a static asset living inside it caused the incident described above.)

## One-time fix: rescue the study plan before the next deploy

`src/data/progress/progress.json` holds the weekly study plan the founder
edits at `/mentor/admin/plan`. It was never symlinked, so it has been living
inside each release directory — meaning every deploy has been silently
reverting the plan to whatever the repo shipped, and the current live plan
exists **only** inside the release that is running right now.

Run this on the VPS **before the next deploy**, or those edits are gone:

```bash
# Copy the live plan out of the running release into persistent/
cp /var/www/hammasir/current/src/data/progress/progress.json    /var/www/hammasir/persistent/progress.json

# Sanity-check it is the real thing, not the repo placeholder
head -c 300 /var/www/hammasir/persistent/progress.json
```

From then on `link-persistent.sh` keeps it linked like everything else. If the
running release has already been redeployed since the last plan edit, that
edit is unrecoverable — restore from the most recent
`/var/backups/hammasir/` archive if it matters.


## Mentor approval (one-time note, first deploy of this feature)

Self-registered mentors are no longer published by finishing their profile —
they need `approved: true` on their account, granted by the founder at
`/mentor/admin/mentors` (see `MentorAccount.approved`). No new persistent
file: the flag lives in the existing `persistent/mentorPortal/mentors.json`.

At the time this shipped, every one of the 19 accounts in that file was
catalogue-linked (`catalogueId` set), and catalogue-linked accounts were
never published through the portal merge in the first place — so nobody
went dark and no backfill was needed. **If you ever restore an older
`mentors.json` that predates this field and it contains self-registered
(non-`catalogueId`) accounts, those mentors will silently drop off the
site until you re-approve them.** Backfill them instead:

```bash
node -e '
const f="/var/www/hammasir/persistent/mentorPortal/mentors.json";
const m=require(f);
for (const x of m) if (!x.catalogueId && x.approved===undefined) x.approved=true;
require("fs").writeFileSync(f, JSON.stringify(m,null,2)+"
");
'
```

## Sanity checks after each deploy

```bash
bash deploy/verify-persistent.sh /var/www/hammasir/current   # every path linked
curl -I https://hammasirsite.ir/student/home        # 200
pm2 logs hammasir --lines 50                          # no errors
pm2 status                                            # memory well under the 700M restart threshold
```
