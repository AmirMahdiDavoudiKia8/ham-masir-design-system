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
          "برای متن‌های بلندتر — مثل بیوگرافی یه هم‌مسیر یا توضیح یه شکایت از جلسه. همون الگوی حالت‌های Input رو دنبال می‌کنه، با فضای بیشتر برای تایپ.",
      },
    },
  },
  argTypes: {
    label: { control: "text", description: "لیبل بالای فیلد" },
    hint: { control: "text", description: "متن راهنما" },
    error: { control: "text", description: "متن خطای اعتبارسنجی" },
    placeholder: { control: "text", description: "متن پیش‌فرض داخل فیلد" },
    disabled: { control: "boolean", description: "غیرفعال" },
  },
  args: { label: "بیوگرافی", placeholder: "خودت رو معرفی کن..." },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: { error: "این فیلد الزامیه" },
};

/**
 * همه‌ی حالت‌ها کنار هم: پیش‌فرض، غیرفعال، خطا. مثل Input — فوکوس با Tab،
 * خطا همیشه با متن و آیکن (نه فقط رنگ).
 */
export const InteractionStates: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 320 }}>
      <Textarea label="پیش‌فرض (default)" placeholder="خودت رو معرفی کن..." />
      <Textarea label="غیرفعال (disabled)" defaultValue="متن غیرقابل ویرایش" disabled />
      <Textarea label="خطا (error)" error="این فیلد الزامیه" />
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
  render: () => <Textarea label="بیوگرافی" placeholder="خودت رو معرفی کن..." />,
};
