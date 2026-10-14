/**
 * Toast.stories — fire-and-forget success/error banner.
 * The product mounts a single <Toast/> in the root layout; triggers call
 * showToast from lib/toast. Same implementation, same trigger path.
 */
import type { Meta, StoryObj } from "@storybook/nextjs";
import { showToast } from "@/lib/toast";
import { Button } from "../Button";
import { Toast } from "./Toast";

const meta = {
  title: "FEEDBACK/Toast",
  component: Toast,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "تُست (Toast) یک اعلان گذرا و غیرمخرب (Non-blocking) است که برای ارائه بازخوردِ عملیاتِ کاربر (مانند ذخیره موفقیت‌آمیز یا خطای شبکه) استفاده می‌شود. این کامپوننت به صورت خودکار پس از یک تاخیر زمانی مشخص (Auto-dismiss) از بین می‌رود و نیازی به تعامل مستقیم کاربر برای بستن ندارد.",
      },
    },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

/** معماری یکپارچه (Integrated DX) — این محیط تعاملی، توزیع‌کننده (ToastProvider) واقعی سیستم را در استوری‌بوک Mount کرده است. توسعه‌دهندگان می‌توانند با کلیک روی دکمه‌های زیر، فراخوانی متد `showToast` را دقیقاً با همان مسیر و منطقی که در محصول نهایی (Production) استفاده می‌شود، تست و ارزیابی کنند. */
export const Interactive: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <Toast />
      <Button variant="primary" size="md" onClick={() => showToast("جلسه لغو شد.", "success")}>
        نمایش پیام موفقیت
      </Button>
      <Button variant="secondary" size="md" onClick={() => showToast("خطایی رخ داد.", "error")}>
        نمایش پیام خطا
      </Button>
    </div>
  ),
};
