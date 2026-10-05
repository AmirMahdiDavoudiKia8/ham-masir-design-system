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
          "عکس یک آدم؛ دانش‌آموز، هم‌مسیر یا هر کاربر دیگری که در هم‌مسیر می‌بینی. بیشتر وقت‌ها که عکسی نیست، حرف اول اسم روی یک پس‌زمینه‌ی ملایم نشان داده می‌شود — همان چیزی که هم‌مسیر تازه‌وارد، پیش از آپلود عکس، می‌بیند. برای sm جای لیست‌های فشرده، md حالت معمول و lg کارت معرفی هم‌مسیر را در نظر بگیر.",
      },
    },
  },
  argTypes: {
    name: { control: "text", description: "اسم — هم برای حرف اولِ fallback، هم alt و aria-label" },
    src: { control: "text", description: "آدرس عکس؛ خالی بگذاری، fallback نشان داده می‌شود" },
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
