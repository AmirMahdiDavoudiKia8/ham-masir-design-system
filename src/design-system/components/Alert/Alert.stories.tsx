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
          "اعلان آرام برای پیام‌های محصول؛ مثل تأیید ثبت رزرو یا هشدار عقب‌افتادن. چهار لحن دارد: info، success، alert و danger.",
      },
    },
  },
  argTypes: {
    tone: {
      control: "select",
      options: ["info", "success", "alert", "danger"],
      description: "لحن پیام",
    },
    title: { control: "text", description: "تیتر (اختیاری)" },
  },
  args: { tone: "info", title: "ثبت شد", children: "رزروت ثبت شد؛ برای هماهنگی تایم دقیق باهات تماس می‌گیریم." },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};

export const Success: Story = {
  args: { tone: "success", title: "ثبت شد", children: "رزروت ثبت شد." },
};

export const Warning: Story = {
  args: { tone: "alert", title: "کمی عقب افتادی", children: "امشب فقط یک قدم کوچک بردار." },
};

export const Danger: Story = {
  args: { tone: "danger", title: "خطا", children: "مشکلی پیش اومد؛ دوباره امتحان کن." },
};

export const AllTones: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Alert tone="info" title="Info">پیام خنثی و اطلاع‌رسان.</Alert>
      <Alert tone="success" title="ثبت شد">رزروت ثبت شد.</Alert>
      <Alert tone="alert" title="کمی عقب افتادی">امشب فقط یک قدم کوچک بردار.</Alert>
      <Alert tone="danger" title="خطا">مشکلی پیش اومد؛ دوباره امتحان کن.</Alert>
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
      <Alert tone="success" title="ثبت شد">رزروت ثبت شد.</Alert>
      <Alert tone="alert" title="کمی عقب افتادی">امشب فقط یک قدم کوچک بردار.</Alert>
    </div>
  ),
};
