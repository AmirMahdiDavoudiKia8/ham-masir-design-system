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
          "فیلد ورودی (Input) کامپوننت اصلی برای دریافت داده‌های متنی از کاربر است. در حالت پیش‌فرض (Default)، فیلد دارای استایل خنثی است و با دریافت فوکوس، خطِ دور (Border) آن به رنگ Primary تغییر می‌کند. در صورت نامعتبر بودن داده‌ها، فیلد وارد وضعیت خطا (Error State) شده و برای رعایت استانداردهای دسترسی‌پذیری (WCAG)، خطا را هم‌زمان از طریق تغییر رنگ، نمایش آیکون هشدار و یک متن راهنمای واضح به کاربر اعلام می‌کند.",
      },
    },
  },
  argTypes: {
    label: { control: "text", description: "برچسب بالای فیلد" },
    hint: { control: "text", description: "متن راهنما — وقتی خطا دارد نمایش داده نمی‌شود" },
    error: { control: "text", description: "متن خطایی که به کاربر نشان داده می‌شود" },
    placeholder: { control: "text", description: "متنی که تا وقتی کاربر چیزی ننویسد داخل فیلد دیده می‌شود" },
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
 * بررسی حالت‌های تعاملی: فیلد ورودی دارای وضعیت‌های پیش‌فرض، غیرفعال (پس‌زمینه Muted و کرسر Not-allowed) و خطا می‌باشد. وضعیت خطا مستقل از رنگ عمل کرده و شامل آیکون و پیام متنی است. همچنین این کامپوننت از حلقه فوکوس استاندارد (focus-visible) برای پیمایش کیبورد پشتیبانی می‌کند.
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

/** الگوی جستجو (Search Pattern) — تعبیه آیکون در اسلات ابتدایی فیلد؛ هماهنگ با ساختار هدر در صفحات کاوش. */
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
