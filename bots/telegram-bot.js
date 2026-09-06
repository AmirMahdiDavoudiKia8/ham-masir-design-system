const { Bot } = require("grammy");
const { setupBot } = require("./shared/bot-logic");

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not set");

const bot = new Bot(token);

setupBot(bot, {
  platform: "telegram",
  adminChatId: process.env.TELEGRAM_ADMIN_CHAT_ID,
  cardNumber: process.env.PAYMENT_CARD_NUMBER,
  cardOwner: process.env.PAYMENT_CARD_OWNER,
  supportHandle: "@hammasirsite",
});

bot.catch((err) => {
  console.error("[telegram-bot] error:", err);
});

bot.start();
console.log("[telegram-bot] running");
