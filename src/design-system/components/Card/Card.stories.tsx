/**
 * Card.stories — Base · Interactive · TwoButtons · ThreeButtons · DarkMode.
 * Footer: single action, Secondary+Primary pair, or pair + split leading action.
 */
import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";
import { Card } from "./Card";
import { Button } from "../Button/Button";

const meta = {
  title: "COMPONENTS/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "ظرف پایه برای گروه‌بندی محتوا — زیرساخت خیلی از بخش‌های هم‌مسیر. Base یه ظرف ساده و ثابته بدون واکنش به کلیک؛ Interactive وقتی کل کارت قابل‌کلیکه (مثل کارت یه هم‌مسیر)، با یه سایه‌ی ملایم موقع هاور.",
      },
    },
  },
  decorators: [(Story) => <div style={{ width: 340 }}><Story /></div>],
  argTypes: {
    title: { control: "text", description: "تیتر کارت" },
    description: { control: "text", description: "توضیح پشتیبان" },
    interactive: { control: "boolean", description: "هاور ملایم (یه :hover state)" },
  },
  args: {
    title: "عنوان کارت",
    description: "توضیح پشتیبان کارت — کوتاه و آرام.",
    children: "محتوای بدنه اینجاست. از کارت برای گروه‌بندی اطلاعات مرتبط استفاده کن.",
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: { actions: <Button variant="primary" size="md">رزرو کن</Button> },
};

export const Interactive: Story = {
  args: { interactive: true, actions: <Button variant="primary" size="md">رزرو کن</Button> },
};

/**
 * کارت کلیک‌پذیر: کل کارت tap target ـه و با Enter/Space هم کار می‌کنه
 * (role=button + tabIndex). هاور سایه می‌گیره، فوکوس کیبورد (Tab) حلقه‌ی
 * focus-visible داره. برای کارت کلیک‌پذیر حتماً aria-label معنادار بده.
 */
export const Clickable: Story = {
  args: {
    interactive: true,
    onClick: fn(),
    title: "کارت کلیک‌پذیر",
    description: "با موس کلیک کن یا با Tab بیا روش و Enter بزن.",
    children: "کل این کارت یک دکمه‌ست — نیازی به دکمه‌ی جدا نیست.",
  },
};

/** مقایسه‌ی حالت‌ها: ساده (بدون واکنش) در برابر تعاملی (هاور + فوکوس). */
export const InteractionStates: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 340 }}>
      <Card title="ساده (static)" description="بدون hover، بدون فوکوس — فقط ظرف محتوا.">
        محتوای بدنه اینجاست.
      </Card>
      <Card
        interactive
        onClick={fn()}
        title="تعاملی (interactive + clickable)"
        description="هاور سایه می‌گیره؛ با Tab فوکوس visible داره."
      >
        محتوای بدنه اینجاست.
      </Card>
    </div>
  ),
};

export const TwoButtons: Story = {
  args: {
    actions: (
      <>
        <Button variant="secondary" size="md">انصراف</Button>
        <Button variant="primary" size="md">رزرو کن</Button>
      </>
    ),
  },
};

export const ThreeButtons: Story = {
  args: {
    leadingAction: <Button variant="secondary" size="md">جزئیات</Button>,
    actions: (
      <>
        <Button variant="secondary" size="md">انصراف</Button>
        <Button variant="primary" size="md">رزرو کن</Button>
      </>
    ),
  },
};

export const WithoutHeader: Story = {
  args: { title: undefined, description: undefined, children: "کارت بدون سربرگ — فقط بدنه و عمل." },
};

export const DarkMode: Story = {
  args: { actions: <Button variant="primary" size="md">رزرو کن</Button> },
  decorators: [
    (Story) => (
      <div className="dark" style={{ padding: 24, background: "var(--color-background)", borderRadius: 20 }}>
        <Story />
      </div>
    ),
  ],
};
