// Shared conversation logic for both the Telegram and Bale bots — grammY's
// API is (deliberately) identical for both once the client's apiRoot points
// at the right server, so the same handlers work for either platform.
const siteApi = require("./site-api");
const store = require("./store");

const WELCOME_MESSAGE =
  "سلام. من امیرمهدیم، کسی که هم‌مسیر رو ساخته. همشو. دست تنها و با پول تو جیبیام اوردم بالا و هنوز پولی واسه خرید درگاه پرداخت ندارم :) چند دقیقه بعد از پرداخت باهات تماس میگیرم تا تایم دقیق جلسه رو مشخص کنیم. مرسی که درک میکنی";

/**
 * @param {import("grammy").Bot} bot
 * @param {{ platform: "telegram" | "bale", adminChatId: string, cardNumber: string, cardOwner: string, supportHandle: string }} config
 */
function setupBot(bot, config) {
  const { platform, adminChatId, cardNumber, cardOwner, supportHandle } = config;

  bot.command("start", async (ctx) => {
    const code = (ctx.match ?? "").toString().trim().toUpperCase();

    if (!code) {
      await ctx.reply(
        `${WELCOME_MESSAGE}\n\nبرای پرداخت، از داخل سایت هم‌مسیر روی دکمه‌ی «پرداخت در تلگرام/بله» بزن تا مستقیم با رزروت به اینجا وصل بشی.\n\nchat id: ${ctx.chat.id}`,
      );
      return;
    }

    const request = await siteApi.getPaymentRequest(code);
    if (!request) {
      await ctx.reply("این کد پیدا نشد یا منقضی شده. از داخل سایت هم‌مسیر دوباره امتحان کن.");
      return;
    }

    store.setPendingCode(platform, ctx.chat.id, code);

    await ctx.reply(WELCOME_MESSAGE);

    const lines = [
      "رزرو شما:",
      `هم‌مسیر: ${request.mentorName}`,
      `طرح: ${request.planTitle}`,
      `زمان: ${request.slot}`,
    ];
    if (request.price) lines.push(`مبلغ: ${request.price}`);
    lines.push("", "مبلغ رو به شماره کارت زیر واریز کن:", cardNumber, `به نام: ${cardOwner}`);
    lines.push("", "بعد از واریز، عکس رسید رو همینجا بفرست.");

    await ctx.reply(lines.join("\n"));
  });

  bot.on("message:photo", async (ctx) => {
    const code = store.getPendingCode(platform, ctx.chat.id);
    if (!code) {
      await ctx.reply("اول باید از داخل سایت هم‌مسیر وارد این بات بشی تا رزروت مشخص بشه.");
      return;
    }

    const request = await siteApi.getPaymentRequest(code);
    if (!request) {
      await ctx.reply("این رزرو دیگه معتبر نیست، از داخل سایت دوباره امتحان کن.");
      return;
    }
    if (request.status !== "pending") {
      await ctx.reply("این رزرو قبلاً بررسی شده.");
      return;
    }

    const photos = ctx.message.photo;
    const largest = photos[photos.length - 1];

    const caption = [
      "🧾 رسید پرداخت جدید",
      `کد: ${code}`,
      `نام: ${request.name}`,
      `موبایل: ${request.phone}`,
      `هم‌مسیر: ${request.mentorName}`,
      `طرح: ${request.planTitle}`,
      `زمان: ${request.slot}`,
      request.price ? `مبلغ: ${request.price}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    await ctx.api.sendPhoto(adminChatId, largest.file_id, {
      caption,
      reply_markup: {
        inline_keyboard: [
          [
            { text: "✅ تایید", callback_data: `approve:${code}` },
            { text: "❌ رد", callback_data: `reject:${code}` },
          ],
        ],
      },
    });

    store.rememberStudentChat(platform, code, ctx.chat.id);
    await ctx.reply("رسیدت برای بررسی ارسال شد. بعد از تایید بهت خبر می‌دیم ✅");
  });

  bot.on("callback_query:data", async (ctx) => {
    const [action, code] = (ctx.callbackQuery.data ?? "").split(":");
    if (action !== "approve" && action !== "reject") return;

    if (String(ctx.chat?.id) !== String(adminChatId)) {
      await ctx.answerCallbackQuery({ text: "فقط ادمین می‌تونه این کارو کنه." });
      return;
    }

    const status = action === "approve" ? "approved" : "rejected";
    const request = await siteApi.resolvePaymentRequest(code, status);
    await ctx.answerCallbackQuery();

    const originalCaption = ctx.callbackQuery.message?.caption ?? "";
    const mark = !request ? "⚠️ رزرو پیدا نشد." : status === "approved" ? "✅ تایید شد" : "❌ رد شد";
    await ctx.editMessageCaption({ caption: `${originalCaption}\n\n${mark}` }).catch(() => {});

    if (!request) return;

    const studentChatId = store.getStudentChat(platform, code);
    if (!studentChatId) return;

    const text =
      status === "approved"
        ? "پرداختت تایید شد ✅ جلسه‌ت نهایی شد، هم‌مسیرت به‌زودی باهات هماهنگ می‌کنه."
        : `متأسفانه رسیدت تایید نشد ❌ لطفاً دوباره بررسی کن یا با پشتیبانی تماس بگیر: ${supportHandle}`;
    await ctx.api.sendMessage(studentChatId, text).catch(() => {});
  });
}

module.exports = { setupBot };
