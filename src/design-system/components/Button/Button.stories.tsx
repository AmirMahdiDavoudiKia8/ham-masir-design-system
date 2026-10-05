/**
 * Button.stories — visual review surface. Compare each story against the product.
 *
 * Variant axis → variant (primary | secondary | outline | outline-brand | ghost).
 * Primary (filled gradient) is for the ONE main action per screen.
 * Size axis    → size (md | lg).
 * State axis   → native :hover / :focus-visible / :disabled, never visual-only props.
 * Shape        → pill for standalone CTAs, otherwise rounded-md.
 */
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Button, buttonClasses } from "./Button";

const meta = {
  title: "COMPONENTS/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "هر کاری که کاربر تو هم‌مسیر انجام می‌دهد، از رزرو جلسه تا انصراف، با دکمه شروع می‌شود. فقط حواست باشد هر صفحه بیشتر از یک دکمه‌ی primary نداشته باشد؛ همان پرشده‌ی گرادیانی که برای مهم‌ترین اقدام صفحه کنار گذاشته‌ایم. برای کارهای فرعی سراغ outline یا outline-brand برو، و وقتی اقدام کم‌رنگ‌تر است، ghost. اندازه‌ی md حالت پیش‌فرض است؛ lg را فقط وقتی بگذار که دکمه تمام‌عرض شده، مثل صفحه‌های ورود.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline", "outline-brand", "ghost"],
      description: "ظاهر دکمه",
      table: { defaultValue: { summary: "primary" } },
    },
    size: {
      control: "select",
      options: ["md", "lg"],
      description: "اندازه (md یا lg)",
      table: { defaultValue: { summary: "md" } },
    },
    disabled: {
      control: "boolean",
      description: "غیرفعال، با همان disabled خود مرورگر",
    },
    pill: {
      control: "boolean",
      description: "کاملاً گرد (pill) — برای دکمه‌های مستقل و شاخص",
    },
    children: {
      control: "text",
      description: "متن دکمه",
    },
  },
  args: { children: "رزرو کن", variant: "primary", size: "md", disabled: false },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: "primary", children: "رزرو کن" },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "انصراف" },
};

export const Outline: Story = {
  args: { variant: "outline", children: "پاک کردن فیلترها" },
};

export const OutlineBrand: Story = {
  args: { variant: "outline-brand", children: "مشاهده برنامه" },
};

export const Ghost: Story = {
  args: { variant: "ghost", children: "بعداً" },
};

export const Medium: Story = {
  args: { size: "md", children: "رزرو کن" },
};

export const Large: Story = {
  args: { size: "lg", children: "رزرو کن" },
};

export const Disabled: Story = {
  args: { disabled: true, children: "غیرفعال" },
};

export const Pill: Story = {
  args: { pill: true, children: "شروع کن" },
};

/**
 * همه‌ی حالت‌های تعاملی کنار هم: پیش‌فرض و غیرفعال.
 * هاور (hover) و فوکوس (focus-visible) و فشرده (active) حالت‌های مرورگرند —
 * با موس روی دکمه برو یا با Tab بهش برس تا ببینیشون.
 */
export const InteractionStates: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <Button variant="primary">پیش‌فرض (default)</Button>
      <Button variant="primary" disabled>غیرفعال (disabled)</Button>
      <Button variant="secondary">پیش‌فرض ثانویه</Button>
      <Button variant="secondary" disabled>غیرفعال ثانویه</Button>
      <Button variant="outline">outline</Button>
      <Button variant="outline-brand">outline-brand</Button>
      <Button variant="ghost">ghost</Button>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <Button variant="primary">رزرو کن</Button>
      <Button variant="secondary">انصراف</Button>
      <Button variant="outline">پاک کردن فیلترها</Button>
      <Button variant="outline-brand">مشاهده برنامه</Button>
      <Button variant="primary" disabled>غیرفعال</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Button size="md">رزرو کن</Button>
      <Button size="lg">دکمه بزرگ</Button>
    </div>
  ),
};

/**
 * لینک‌هایی که باید دقیقاً مثل دکمه به نظر برسن (مثلاً CTA داخل کارت) —
 * با buttonClasses ساخته می‌شن تا استایل‌ها دستی تکرار نشن.
 */
export const AsLink: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <a href="#" onClick={(e) => e.preventDefault()} className={buttonClasses("primary", "md", false, undefined, true)}>
        شروع کن
      </a>
      <a href="#" onClick={(e) => e.preventDefault()} className={buttonClasses("outline-brand", "md")}>
        مشاهده برنامه
      </a>
    </div>
  ),
};

export const DarkMode: Story = {
  decorators: [
    (Story) => (
      <div className="dark" style={{ padding: 24, background: "var(--color-background)", borderRadius: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Story />
      </div>
    ),
  ],
  render: () => (
    <>
      <Button variant="primary">رزرو کن</Button>
      <Button variant="secondary">انصراف</Button>
    </>
  ),
};
