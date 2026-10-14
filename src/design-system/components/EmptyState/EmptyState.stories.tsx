/**
 * EmptyState.stories — generic empty-state block for lists that come back
 * with nothing. Same implementation the product renders.
 */
import type { Meta, StoryObj } from "@storybook/nextjs";
import { EmptyState } from "./EmptyState";
import { Button } from "../Button";
import { SearchIcon } from "../../icons";

const meta = {
  title: "FEEDBACK/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "وضعیت خالی (Empty State) کامپوننتی است که در زمان عدم وجود داده (مانند نتایج جستجوی صفر یا لیست‌های خالی) نمایش داده می‌شود. هدف این کامپوننت جلوگیری از ایجاد بن‌بست در جریان کار کاربر (User Flow) است. این ساختار از سه بخش اصلی تشکیل شده است: نشانگر بصری (آیکون)، پیام شفاف (تیتر و توضیحات)، و یک اقدام جبرانی (Action) برای هدایت کاربر به گام بعدی.",
      },
    },
  },
  argTypes: {
    title: { control: "text", description: "عنوان اصلی؛ بیانگر دلیل خالی بودن وضعیت." },
    description: { control: "text", description: "توضیحات تکمیلی؛ ارائه زمینه یا راهنمایی به کاربر." },
    action: { description: "گره تعاملی (ReactNode)؛ یک کامپوننت عملیاتی (عموماً Button) جهت خروج کاربر از وضعیت خالی." },
  },
  args: {
    title: "هم‌مسیری با این فیلترها پیدا نشد",
    description: "فیلترها را کمی بازتر کنید و دوباره امتحان کنید.",
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <EmptyState
      {...args}
      icon={<SearchIcon className="h-6 w-6" />}
      action={
        <Button variant="outline" size="md" className="mt-1">
          پاک کردن فیلترها
        </Button>
      }
    />
  ),
};

export const WithoutAction: Story = {
  render: (args) => <EmptyState {...args} icon={<SearchIcon className="h-6 w-6" />} />,
};

export const DarkMode: Story = {
  decorators: [
    (Story) => (
      <div className="dark" style={{ padding: 24, background: "var(--color-background)", borderRadius: 20 }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <EmptyState
      {...args}
      icon={<SearchIcon className="h-6 w-6" />}
      action={
        <Button variant="outline" size="md" className="mt-1">
          پاک کردن فیلترها
        </Button>
      }
    />
  ),
};
