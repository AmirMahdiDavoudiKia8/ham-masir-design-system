/**
 * MentorCard.stories — grid + strip tiles with the shared recipe.
 * Same MentorTile the product renders; if it ever looks different here,
 * that is a bug in the product wrapper, not in this file.
 */
import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";
import { MentorCard } from "./MentorCard";

const meta = {
  title: "COMPONENTS/MentorCard",
  component: MentorCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "تایل منتور در دو چیدمان grid (گرید نتایج) و strip (نوار صفحه اصلی). بخش‌های مشترک (MentorTile و mentorCardClasses) همان چیزی است که محصول مصرف می‌کند.",
      },
    },
  },
  args: {
    name: "سارا محمدی",
    photoUrl: "/mentors/sara.jpg",
    subtitle: "پزشکی، تهران",
    rank: "رتبه ۱۲ کنکور ۱۴۰۳",
  },
  // Quarantine: docs typography (right-aligned h3/p) must not restyle the
  // live tile — the tile carries its own centered product styles.
  decorators: [
    (Story) => (
      <div className="mentorcard-docs-scope">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MentorCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Grid: Story = {
  args: { layout: "grid" },
};

export const Strip: Story = {
  args: { layout: "strip" },
};

export const Clickable: Story = {
  args: { layout: "grid", onClick: fn() },
};

export const WithoutPhoto: Story = {
  args: { layout: "grid", name: "هم‌مسیر تازه", photoUrl: undefined },
};

export const DarkMode: Story = {
  args: { layout: "grid" },
  decorators: [
    (Story) => (
      <div className="dark" style={{ padding: 24, background: "var(--color-background)", borderRadius: 20 }}>
        <Story />
      </div>
    ),
  ],
};
