/**
 * Textarea.stories — same contract as Input (label + error-as-prop),
 * with more room to type.
 */
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Textarea } from "./Textarea";

const meta = {
  title: "FORMS/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "فیلد متنی چندخطی (Textarea) برای دریافت داده‌های متنی طولانی (مانند بیوگرافی یا توضیحات تکمیلی) استفاده می‌شود. این کامپوننت از نظر رفتار تعاملی و مدیریت خطا، به طور کامل از معماری کامپوننت Input ارث‌بری می‌کند تا یکپارچگی سیستم (System Consistency) حفظ شود. تغییر سایز این فیلد توسط کاربر، برای جلوگیری از شکستن چیدمان، صرفاً در محور عمودی (Vertical Resize) مجاز است.",
      },
    },
  },
  argTypes: {
    label: { control: "text", description: "برچسب بالای فیلد" },
    hint: { control: "text", description: "متن راهنما" },
    error: { control: "text", description: "پیام خطای اعتبارسنجی؛ همراه با تغییر وضعیت فیلد به حالت Error نمایش داده می‌شود." },
    placeholder: { control: "text", description: "متن نگه‌دارنده؛ راهنمای موقتی که پیش از ورود داده نمایش داده می‌شود." },
    disabled: { control: "boolean", description: "غیرفعال" },
  },
  args: { label: "بیوگرافی", placeholder: "خودتان را معرفی کنید..." },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: { error: "تکمیل این فیلد الزامی است." },
};

/**
 * بررسی حالت‌های تعاملی: فیلد Textarea از الگوی رفتاری کامپوننت Input پیروی می‌کند. وضعیت خطا شامل آیکون و پیام متنی است (رعایت WCAG 1.4.1) و حلقه فوکوس استاندارد (focus-visible) برای پیمایش با کلید Tab تعبیه شده است.
 */
export const InteractionStates: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 320 }}>
      <Textarea label="پیش‌فرض (default)" placeholder="خودتان را معرفی کنید..." />
      <Textarea label="غیرفعال (disabled)" defaultValue="متن غیرقابل ویرایش" disabled />
      <Textarea label="خطا (error)" error="تکمیل این فیلد الزامی است." />
    </div>
  ),
};

export const DarkMode: Story = {
  decorators: [
    (Story) => (
      <div className="dark" style={{ padding: 24, background: "var(--color-background)", borderRadius: 20, width: 320 }}>
        <Story />
      </div>
    ),
  ],
  render: () => <Textarea label="بیوگرافی" placeholder="خودتان را معرفی کنید..." />,
};
