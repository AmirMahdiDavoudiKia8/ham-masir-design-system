"""
Watches @khabari_18 for new channel posts and, shortly after each one,
posts the ad text below as the first comment (a reply in the channel's
linked discussion group) — using your own Telegram account, not a bot.

Setup (one-time):
  1. Get api_id + api_hash from https://my.telegram.org (log in with your
     phone, "API development tools", create an app — any name is fine).
  2. pip install -r requirements.txt
  3. Copy .env.example to .env and fill in API_ID / API_HASH.
  4. Run this script once interactively (`python ad_commenter.py`) — it'll
     ask for your phone number, then the login code Telegram sends you,
     and a 2FA password if you have one set. This creates a `.session`
     file next to this script that remembers the login, so every run
     after this first one is unattended (see README.md for running it
     as a background service on the VPS).

Only touches @khabari_18, which you already administer — nothing here
reads, joins, or posts to any channel/group you don't already control.
"""

import asyncio
import logging
import os
import random

from dotenv import load_dotenv
from telethon import TelegramClient, events

load_dotenv()

API_ID = int(os.environ["API_ID"])
API_HASH = os.environ["API_HASH"]
CHANNEL = os.environ.get("CHANNEL", "khabari_18")
SESSION_NAME = os.environ.get("SESSION_NAME", "ad_commenter")

# Random delay before commenting so it reads as a real, organic comment
# rather than an instant bot reply to your own post.
MIN_DELAY_SECONDS = int(os.environ.get("MIN_DELAY_SECONDS", "20"))
MAX_DELAY_SECONDS = int(os.environ.get("MAX_DELAY_SECONDS", "90"))

AD_TEXT = (
    "دارم رزومه میسازم واسه خودم\n"
    "بدون پرداخت یک ریال سایتت رو با هر موضوعی که هست میسازم و بعد از پرداخت و "
    "فقط اگر راضی بودی هرچقدر کرمت بود بزن به کارتم\n"
    "همه چیز کاملا رایگانه. امتحانش ضرری نداره\n"
    "پیوی مسیج بده\U0001FAF6\U0001F3FC"
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
    handlers=[logging.FileHandler("ad_commenter.log"), logging.StreamHandler()],
)
log = logging.getLogger("ad_commenter")

async def main():
    # Built here (inside the running event loop asyncio.run() creates), not
    # at module level — constructing a TelegramClient before a loop exists
    # raises on newer Python/Telethon combinations ("no running event loop").
    client = TelegramClient(SESSION_NAME, API_ID, API_HASH)

    @client.on(events.NewMessage(chats=CHANNEL))
    async def on_new_post(event):
        # Only react to actual channel posts (not, say, a message in a
        # linked discussion group surfacing under the same chat).
        if not event.message.post:
            return

        delay = random.randint(MIN_DELAY_SECONDS, MAX_DELAY_SECONDS)
        log.info("New post %s detected, commenting in %ss", event.message.id, delay)
        await asyncio.sleep(delay)

        try:
            await client.send_message(CHANNEL, AD_TEXT, comment_to=event.message.id)
            log.info("Commented on post %s", event.message.id)
        except Exception:
            log.exception("Failed to comment on post %s", event.message.id)

    await client.start()
    log.info("Logged in — watching @%s for new posts", CHANNEL)
    await client.run_until_disconnected()


if __name__ == "__main__":
    asyncio.run(main())
