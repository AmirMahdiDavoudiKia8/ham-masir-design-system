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
          "وقتی لیستی خالی برمی‌گردد — مثل وقتی هیچ فیلتری نتیجه‌ای ندارد — این بلوک جای خالی را پر می‌کند. آیکن، تیتر و توضیح دارد و اگر لازم باشد یک اقدام هم کنارش می‌گذارد تا کاربر بداند قدم بعدی چیست.",
      },
    },
  },
  argTypes: {
    title: { control: "text", description: "تیتر" },
    description: { control: "text", description: "توضیح" },
  },
  args: {
    title: "هم‌مسیری با این فیلترها پیدا نشد",
    description: "فیلترهات رو کمی بازتر کن و دوباره امتحان کن.",
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
