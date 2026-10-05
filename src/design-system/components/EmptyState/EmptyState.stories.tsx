/**
 * EmptyState.stories — generic empty-state block for lists that come back
 * with nothing. Same implementation the product renders.
 */
import type { Meta, StoryObj } from "@storybook/nextjs";
import { EmptyState } from "./EmptyState";
import { Button } from "../Button";
import { SearchIcon } from "../../icons";

const meta = {
  title: "Component/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "بلوک دعوت‌کننده برای وقتی که لیستی خالیه — مثل وقتی فیلتری نتیجه‌ای نداره. آیکون، تیتر، توضیح و یک اقدام اختیاری می‌گیره.",
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
