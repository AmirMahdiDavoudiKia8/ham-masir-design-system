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
          "تصویر یه نفر — دانش‌آموز، هم‌مسیر، یا هر کاربر دیگه. وقتی عکس نیست، به‌جای آیکون شکسته، حرف اول اسم روی یه پس‌زمینه‌ی ملایم نشون داده می‌شه — برای وقتی که یه هم‌مسیر تازه عضو شده ولی عکس آپلود نکرده. سایزها: sm برای لیست‌های فشرده، md استاندارد، lg برای کارت معرفی.",
      },
    },
  },
  argTypes: {
    name: { control: "text", description: "اسم — برای حرف اول fallback و alt/aria-label" },
    src: { control: "text", description: "آدرس عکس — خالی باشه fallback نشون داده می‌شه" },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
      description: "سایز",
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
