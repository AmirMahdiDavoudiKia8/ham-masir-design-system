/**
 * ProgressBar.stories — thin progress track for multi-step flows.
 * Same implementation the discovery, onboarding and planner flows render.
 */
import type { Meta, StoryObj } from "@storybook/nextjs";
import { ProgressBar } from "./ProgressBar";

const meta = {
  title: "FEEDBACK/ProgressBar",
  component: ProgressBar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "نوار پیشرفت (Progress Bar) یک کامپوننت بازخوردی و مینیمال است که برای نمایش میزان پیشرفت کاربر در فرآیندهای چندمرحله‌ای استفاده می‌شود. مقدار دریافتیِ آن (value) به صورت اکید بین بازه ۰ تا ۱۰۰ محدود شده است.\n\n**الزام دسترسی‌پذیری (WCAG):** با توجه به حذف برچسب‌های بصری، پاس دادن یک `aria-label` معنادار به این کامپوننت جهت خوانایی برای ابزارهای کمکی (Screen Readers) کاملاً اجباری است.",
      },
    },
  },
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "درصد پیشرفت — داخل کامپوننت بین ۰ تا ۱۰۰ محدود می‌شود",
    },
    ariaLabel: {
      control: "text",
      description: "نام دسترس‌پذیر نوار (اجباری — برچسب بصری وجود ندارد)",
    },
  },
  args: { value: 40, ariaLabel: "پیشرفت ثبت‌نام" },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: 40, ariaLabel: "پیشرفت ثبت‌نام" },
};

export const Empty: Story = {
  args: { value: 0, ariaLabel: "پیشرفت ثبت‌نام" },
};

export const Complete: Story = {
  args: { value: 100, ariaLabel: "تکمیل فرآیند" },
};

export const Clamped: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "مقدار خارج از بازه (۱۵۰) داخل کامپوننت به ۱۰۰ محدود می‌شود — نوار هرگز از ترک بیرون نمی‌زند.",
      },
    },
  },
  args: { value: 150, ariaLabel: "پیشرفت ثبت‌نام" },
};

export const DarkMode: Story = {
  args: { value: 60, ariaLabel: "پیشرفت ثبت‌نام" },
  decorators: [
    (Story) => (
      <div className="dark" style={{ padding: 24, background: "var(--color-background)", borderRadius: 20 }}>
        <Story />
      </div>
    ),
  ],
};
