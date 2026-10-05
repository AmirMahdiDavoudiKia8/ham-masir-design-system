/**
 * Spinner.stories — calm loading primitives. Prefer Skeleton placeholders
 * over anxious spinners for loading states.
 */
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Skeleton, Spinner } from "./Feedback";

const meta = {
  title: "FEEDBACK/Spinner & Skeleton",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "نشانه‌های بارگذاری آروم — حلقه‌ی چرخان برای انتظارهای کوتاه و اسکلت محو برای جای متن و کارت.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const SpinnerDefault: Story = {
  render: () => <Spinner />,
};

export const SkeletonLines: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 280 }}>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  ),
};

export const SkeletonCard: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center", width: 320 }}>
      <Skeleton className="h-16 w-16 rounded-full" />
      <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
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
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Spinner />
      <Skeleton className="h-4 w-48" />
    </div>
  ),
};
