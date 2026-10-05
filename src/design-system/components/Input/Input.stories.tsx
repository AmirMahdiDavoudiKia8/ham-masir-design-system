/**
 * Input.stories — label + field + error. Focus is a native browser event
 * (never a prop); error is a prop (comes from validation logic).
 */
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Input } from "./Input";

const meta = {
  title: "FORMS/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "فیلد ورودی متن، برای جاهایی مثل شماره تلفن یا نام. Default حالت عادیه؛ Focus وقتی کاربر کلیک می‌کنه حاشیه رنگ primary می‌گیره؛ Error وقتی ورودی نامعتبره حاشیه قرمز می‌شه و یه پیام کوتاه و بدون لحن سرزنش‌گر زیرش توضیح می‌ده چی اشتباهه.",
      },
    },
  },
  argTypes: {
    label: { control: "text", description: "لیبل بالای فیلد" },
    hint: { control: "text", description: "متن راهنما (وقتی خطا هست نشون داده نمی‌شه)" },
    error: { control: "text", description: "متن خطای اعتبارسنجی" },
    placeholder: { control: "text", description: "متن پیش‌فرض داخل فیلد" },
    disabled: { control: "boolean", description: "غیرفعال" },
  },  args: { label: "شماره تلفن", placeholder: "09xxxxxxxxx" },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Focus: Story = {
  render: (args) => <Input {...args} autoFocus />,
};

export const WithHint: Story = {
  args: { hint: "کد تأیید به همین شماره پیامک می‌شود" },
};

export const WithError: Story = {
  args: { defaultValue: "0912", error: "شماره معتبر نیست" },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "09123456789" },
};

/**
 * همه‌ی حالت‌های ورودی کنار هم: پیش‌فرض، غیرفعال (پس‌زمینه‌ی muted و کرسر
 * ممنوعه — فقط با رنگ نشون داده نمی‌شه)، و خطا (حاشیه‌ی قرمز + آیکن + پیام
 * متنی، نه فقط رنگ). فوکوس حالت مرورگره: با Tab به فیلد برس تا حلقه‌ی
 * focus-visible رو ببینی.
 */
export const InteractionStates: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 320 }}>
      <Input label="پیش‌فرض (default)" placeholder="09xxxxxxxxx" />
      <Input label="غیرفعال (disabled)" defaultValue="09123456789" disabled />
      <Input label="خطا (error)" defaultValue="0912" error="شماره معتبر نیست" />
    </div>
  ),
};

/** Search pattern — magnifier slot, mirrors the discovery header. */
export const Search: Story = {
  args: { placeholder: "جست‌وجو بین نام، رشته یا دانشگاه" },
  render: (args) => (
    <Input
      {...args}
      startIcon={
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
          <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.8" />
          <path d="m13.5 13.5 3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      }
    />
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
  render: () => <Input label="شماره تلفن" placeholder="09xxxxxxxxx" />,
};
