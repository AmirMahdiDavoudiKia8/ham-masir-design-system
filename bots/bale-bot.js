const { Bot } = require("grammy");
const { setupBot } = require("./shared/bot-logic");

const token = process.env.BALE_BOT_TOKEN;
if (!token) throw new Error("BALE_BOT_TOKEN is not set");

// Bale's Bot API is a same-shaped clone of Telegram's, just served from a
// different host — grammY only needs to know where to send requests.
const bot = new Bot(token, { client: { apiRoot: "https://tapi.bale.ai" } });

setupBot(bot, {
  platform: "bale",
  adminChatId: process.env.BALE_ADMIN_CHAT_ID,
  cardNumber: process.env.PAYMENT_CARD_NUMBER,
  cardOwner: process.env.PAYMENT_CARD_OWNER,
  supportHandle: "@hammasirsite",
});

bot.catch((err) => {
  console.error("[bale-bot] error:", err);
});

bot.start();
console.log("[bale-bot] running");
