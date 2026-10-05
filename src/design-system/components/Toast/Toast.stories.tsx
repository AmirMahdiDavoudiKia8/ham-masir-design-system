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
          "بنر کوتاه‌مدت موفقیت یا خطا که بالای صفحه ظاهر می‌شود و بعد خودش محو می‌شود؛ مثل پیامی که پس از لغو جلسه می‌بینی. برای نشان دادنش کافی است showToast را صدا بزنی.",
      },
    },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Mounts the real Toast and fires it through the same showToast path the product uses. */
export const Interactive: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <Toast />
      <Button variant="primary" size="md" onClick={() => showToast("جلسه لغو شد.", "success")}>
        نمایش پیام موفقیت
      </Button>
      <Button variant="outline" size="md" onClick={() => showToast("خطایی رخ داد.", "error")}>
        نمایش پیام خطا
      </Button>
    </div>
  ),
};
