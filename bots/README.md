# HamMasir payment bots (Telegram + Bale)

Standalone Node process (two, actually — one per platform), separate from
the Next.js app. A student picks a mentor/time/plan on the site as usual;
the site's payment screen creates a pending "payment request" record
(`src/lib/paymentRequests.ts`, exposed to these bots only via
`src/app/api/bot/payment-requests/...`) and hands the student a short code
plus a deep-link into one of these bots. The bot shows the card number,
collects the receipt photo, and forwards it to the admin's chat with
✅/❌ buttons. Tapping one resolves the request on the site and messages the
student back.

## One-time setup

1. `cd bots && npm install`
2. `cp .env.example .env` and fill in:
   - `SITE_URL` — `https://hammasirsite.ir`
   - `BOT_API_SECRET` — any random string; must match `BOT_API_SECRET` in the
     main app's `.env.local` on the server
   - `TELEGRAM_BOT_TOKEN` — from @BotFather (`/newbot`)
   - `BALE_BOT_TOKEN` — from Bale's bot platform
   - `PAYMENT_CARD_NUMBER`, `PAYMENT_CARD_OWNER` — shown to students
   - `TELEGRAM_ADMIN_CHAT_ID`, `BALE_ADMIN_CHAT_ID` — see below
3. To find your admin chat id: start each bot (`node --env-file=.env
   telegram-bot.js`, likewise for bale), message it `/start` with no
   payload from your own account — it replies back with `chat id: ...`.
   Put that into `.env`, then restart.
4. Also set on the main app (`.env.local`, both locally and in
   `persistent/.env.local` on the server):
   - `BOT_API_SECRET` — same value as above
   - `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` — the bot's `@username` without `@`
   - `NEXT_PUBLIC_BALE_BOT_USERNAME` — same, for the Bale bot

## Running

Locally: `node --env-file=.env telegram-bot.js` / `bale-bot.js`.

On the VPS, as its own PM2 pair (independent of the app's release cycle —
only redeploy this folder when the bot logic itself changes):

```bash
scp -r bots/ user@vps:/var/www/hammasir/bots/
ssh user@vps
cd /var/www/hammasir/bots && npm install --omit=dev
pm2 start ecosystem.config.js
pm2 save
```

`data/*.json` (chat-id <-> payment-code state) lives under `bots/data/` on
the server and should NOT be wiped on redeploy — copy it forward, same idea
as `persistent/` for the main app.
