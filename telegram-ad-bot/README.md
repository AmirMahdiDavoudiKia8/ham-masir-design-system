# Ad commenter for @khabari_18

Watches your channel (@khabari_18) for new posts and, after a short random
delay, posts your ad text as the first comment — using your own Telegram
account (logged in once, then unattended).

## One-time setup

1. Go to https://my.telegram.org, log in with your phone number, open "API
   development tools", and create an app (any name/platform works). You'll
   get an `api_id` (a number) and `api_hash` (a string) — these identify
   *this script* to Telegram, not a bot.
2. Install Python 3.9+ if you don't have it, then:
   ```bash
   cd telegram-ad-bot
   pip install -r requirements.txt
   cp .env.example .env
   ```
3. Open `.env` and fill in `API_ID` and `API_HASH` from step 1. Edit
   `CHANNEL` if you ever point this at a different channel you administer.
4. First run — do this interactively (locally, or over SSH on the VPS —
   either works, just needs to be a real terminal so it can ask you things):
   ```bash
   python ad_commenter.py
   ```
   It'll ask for your phone number, then the login code Telegram just sent
   you, and your 2FA password if you have one. After this succeeds, a file
   named `ad_commenter.session` appears next to the script — **that file
   is your login, keep it private and never share it** (anyone with it can
   act as your Telegram account, no password needed). Once it exists, every
   future run skips the phone/code prompt entirely.
5. Leave that first run going — it's now live, watching for new posts. To
   stop it for now, Ctrl+C.

## Running it continuously on the VPS

Same box as the rest of HamMasir works fine. Copy the whole
`telegram-ad-bot/` folder (session file included, once you've done the
one-time login) to the server, then run it under PM2 so it survives
reboots and restarts itself if it crashes:

```bash
# on the VPS, after scp-ing the folder over and pip install -r requirements.txt
pm2 start ecosystem.config.js
pm2 save
```

Check on it any time with `pm2 logs ad-commenter` or by reading
`ad_commenter.log` in this folder — every detected post and comment attempt
is logged with a timestamp.

## Changing the ad text or timing

Edit `AD_TEXT` directly in `ad_commenter.py`, or tweak `MIN_DELAY_SECONDS`
/ `MAX_DELAY_SECONDS` in `.env` (default: comments 20–90 seconds after a
new post, randomized so it doesn't look instant/automated). Restart the
process after any change (`pm2 restart ad-commenter` if running under PM2).

## Notes

- This only ever watches and posts to @khabari_18, which you already
  administer — it never touches any other channel or group.
- If Telegram ever asks you to re-verify (rare, usually after a very long
  idle period or a new device login), delete `ad_commenter.session` and
  redo step 4.
