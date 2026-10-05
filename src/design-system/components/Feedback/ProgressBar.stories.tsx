/**
 * ProgressBar.stories — thin progress track for multi-step flows.
 * Same implementation the discovery, onboarding and planner flows render.
 */
import type { Meta, StoryObj } from "@storybook/nextjs";
import { ProgressBar } from "./Feedback";

const meta = {
  title: "FEEDBACK/ProgressBar",
  component: ProgressBar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "نوار پیشرفت باریک بالای فرم‌های چندمرحله‌ای — آزمون تطبیق دیسکاور، آنبوردینگ و ساخت برنامه‌ی پلنر از همین استفاده می‌کنن. فقط مقدار ۰ تا ۱۰۰ می‌گیره؛ برچسب و استایل اضافه نداره.",
      },
    },
  },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 5 }, description: "پیشرفت (۰ تا ۱۰۰)" },
  },
  args: { value: 40 },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: { value: 0 },
};

export const Complete: Story = {
  args: { value: 100 },
};

export const DarkMode: Story = {
  decorators: [
    (Story) => (
      <div className="dark" style={{ padding: 24, background: "var(--color-background)", borderRadius: 20 }}>
        <Story />
      </div>
    ),
  ],
};
