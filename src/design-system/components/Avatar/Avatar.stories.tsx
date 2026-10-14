/**
 * Avatar.stories — photo or calm fallback initial (mentors join before
 * uploading a photo, so the fallback is a first-class state).
 */
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Avatar } from "./Avatar";

const meta = {
  title: "COMPONENTS/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "آواتار نمایانگر تصویر کاربران در پلتفرم است. در صورت عدم وجود تصویر، حرف اول نام کاربر به عنوان Fallback روی یک پس‌زمینه ملایم نمایش داده می‌شود.",
      },
    },
  },
  argTypes: {
    name: { control: "text", description: "نام — هم برای حرف اول Fallback، هم alt و aria-label" },
    src: { control: "text", description: "آدرس تصویر؛ در صورت خالی بودن، Fallback نمایش داده می‌شود" },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
      description: "اندازه",
      table: { defaultValue: { summary: "md" } },
    },
  },
  args: { name: "سارا", size: "md" },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Fallback: Story = {
  args: { name: "سارا" },
};

export const WithPhoto: Story = {
  args: { name: "سارا", src: "/mentors/sara.jpg" },
};

export const Small: Story = {
  args: { name: "سارا", size: "sm" },
};

export const Medium: Story = {
  args: { name: "علی", size: "md" },
};

export const Large: Story = {
  args: { name: "مریم", size: "lg" },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Avatar name="سارا" size="sm" />
      <Avatar name="علی" size="md" />
      <Avatar name="مریم" size="lg" />
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
    <div style={{ display: "flex", gap: 12 }}>
      <Avatar name="سارا" size="md" />
      <Avatar name="علی" size="md" />
    </div>
  ),
};
