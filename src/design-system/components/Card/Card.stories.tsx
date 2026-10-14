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
          "ظرف پایه‌ای که محتوا را در خود جمع می‌کند؛ تقریباً همه‌ی بخش‌های هم‌مسیر بر همین اساس ساخته شده‌اند. Base ظرفی ساده و ساکن است که به کلیک واکنشی نشان نمی‌دهد. اگر قرار است کل کارت قابل کلیک باشد — مانند کارت یک هم‌مسیر — گزینه‌ی Interactive را فعال کنید؛ هنگام هاور، سایه‌ی ملایمی اعمال می‌شود.",
      },
    },
  },
  decorators: [(Story) => <div style={{ width: 340 }}><Story /></div>],
  argTypes: {
    title: { control: "text", description: "تیتر کارت" },
    description: { control: "text", description: "توضیح کوتاه زیر تیتر" },
    interactive: { control: "boolean", description: "حالت هاور ملایم (:hover)" },
  },
  args: {
    title: "عنوان کارت",
    description: "توضیح پشتیبان کارت — کوتاه و آرام.",
    children: "محتوای بدنه اینجاست. از کارت برای گروه‌بندی اطلاعات مرتبط استفاده کنید.",
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
 * کارت کلیک‌پذیر. در این حالت، کل کانتینر به عنوان یک Tap Target یکپارچه عمل کرده و از طریق کلیدهای Enter و Space نیز قابل تعامل است (role=button + tabIndex). در حالت هاور سایه اعمال می‌شود و فوکوس کیبورد (Tab) دارای حلقه‌ی focus-visible است. استفاده از aria-label معنادار الزامی است.
 * قانون دسترس‌پذیری: هرگز دکمه یا اکشن تعاملی (actions) داخل کارت کلیک‌پذیر قرار ندهید — تودرتویی عنصر تعاملی، حباب رویداد و سردرگمی Screen Reader ایجاد می‌کند.
 */
export const Clickable: Story = {
  args: {
    interactive: true,
    onClick: fn(),
    title: "کارت کلیک‌پذیر",
    description: "با ماوس کلیک کنید یا با کلید Tab به آن رسیده و Enter را بفشارید.",
    children: "کل این کارت یک دکمه است — نیازی به دکمه‌ی جداگانه نیست.",
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
        description="هاور سایه می‌گیرد؛ با Tab فوکوس visible دارد."
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
