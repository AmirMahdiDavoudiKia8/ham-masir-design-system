/**
 * Alert.stories — calm notice in four tones. Same implementation used in
 * product surfaces and foundation docs.
 */
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Alert } from "./Alert";

const meta = {
  title: "FEEDBACK/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "کامپوننت اعلان (Alert) برای نمایش پیام‌های سیستمی و بازخوردهای غیرمخرب (Non-blocking Feedback) به کاربر استفاده می‌شود. این کامپوننت دارای چهار وضعیت معنایی (Semantic Tones) است: Info، Success، Warning و Danger.\n**نکته حیاتی دسترسی‌پذیری (WCAG 1.4.1):** جهت جلوگیری از اتکای صرف به رنگ برای انتقال معنا، توصیه می‌شود همیشه از آیکون‌های متناسب با وضعیت (Status Icons) در کنار عنوان پیام استفاده شود.",
      },
    },
  },
  argTypes: {
    tone: {
      control: "select",
      options: ["info", "success", "alert", "danger"],
      description: "وضعیت معنایی (Semantic Tone) اعلان",
    },
    title: { control: "text", description: "عنوان اصلی اعلان (اختیاری)" },
  },
  args: { tone: "info", title: "ثبت شد", children: "رزرو شما ثبت شد؛ برای هماهنگی زمان دقیق با شما تماس می‌گیریم." },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};

export const Success: Story = {
  args: { tone: "success", title: "ثبت شد", children: "رزرو شما ثبت شد." },
};

export const Warning: Story = {
  args: { tone: "alert", title: "هشدار", children: "هشدار سیستم: اتصال به سرور با کندی مواجه است. لطفاً شکیبا باشید." },
};

export const Danger: Story = {
  args: { tone: "danger", title: "خطا", children: "خطای سیستمی: فرآیند ثبت اطلاعات با شکست مواجه شد. لطفاً مجدداً تلاش نمایید." },
};

export const AllTones: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Alert tone="info" title="Info">پیام خنثی و اطلاع‌رسان.</Alert>
      <Alert tone="success" title="ثبت شد">رزرو شما ثبت شد.</Alert>
      <Alert tone="alert" title="هشدار">هشدار سیستم: اتصال به سرور با کندی مواجه است. لطفاً شکیبا باشید.</Alert>
      <Alert tone="danger" title="خطا">خطای سیستمی: فرآیند ثبت اطلاعات با شکست مواجه شد. لطفاً مجدداً تلاش نمایید.</Alert>
    </div>
  ),
};

export const DarkMode: Story = {
  decorators: [
    (Story) => (
      <div className="dark" style={{ padding: 24, background: "var(--color-background)", borderRadius: 20 }}>
        <Story />
      </div>
    ),
  ],
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Alert tone="success" title="ثبت شد">رزرو شما ثبت شد.</Alert>
      <Alert tone="alert" title="هشدار">هشدار سیستم: اتصال به سرور با کندی مواجه است. لطفاً شکیبا باشید.</Alert>
    </div>
  ),
};
