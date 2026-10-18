import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type FormEvent } from "react";
import { expect, userEvent, within } from "storybook/test";

import { Button } from "../button/button.js";
import { Checkbox } from "../checkbox/checkbox.js";
import { Input } from "../input/input.js";
import { Switch } from "../switch/switch.js";
import { Textarea } from "../textarea/textarea.js";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "./field.js";

const meta = {
  title: "Components/Forms/Field",
  component: Field,
  tags: ["autodocs"],
  decorators: [(Story) => <div className="w-96">{Story()}</div>],
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Field {...args}>
      <FieldLabel htmlFor="f-name">Full name</FieldLabel>
      <Input id="f-name" placeholder="Ada Lovelace" aria-describedby="f-name-hint" />
      <FieldDescription id="f-name-hint">As it should appear on your invoice.</FieldDescription>
    </Field>
  ),
};

export const WithError: Story = {
  render: () => (
    <Field invalid>
      <FieldLabel htmlFor="f-email" required>
        Email
      </FieldLabel>
      <Input
        id="f-email"
        type="email"
        defaultValue="ada@"
        aria-invalid
        aria-required
        aria-describedby="f-email-error"
      />
      <FieldError id="f-email-error">Enter a valid email address.</FieldError>
    </Field>
  ),
};

export const HorizontalChoices: Story = {
  render: () => (
    <FieldSet>
      <FieldLegend>Notifications</FieldLegend>
      <FieldDescription>Choose what you want to hear about.</FieldDescription>
      <FieldGroup className="gap-4">
        <Field orientation="horizontal">
          <Switch id="f-releases" defaultChecked />
          <FieldContent>
            <FieldLabel htmlFor="f-releases">Releases</FieldLabel>
            <FieldDescription>New versions and changelogs.</FieldDescription>
          </FieldContent>
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="f-tokens" />
          <FieldContent>
            <FieldLabel htmlFor="f-tokens">Token changes</FieldLabel>
            <FieldDescription>Renamed or deprecated design tokens.</FieldDescription>
          </FieldContent>
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
};

function ContactFormDemo() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next: Record<string, string> = {};
    if (!String(data.get("name") ?? "").trim()) next.name = "Please tell me your name.";
    if (!/^\S+@\S+\.\S+$/.test(String(data.get("email") ?? "")))
      next.email = "Enter a valid email address.";
    if (String(data.get("message") ?? "").trim().length < 10)
      next.message = "Write at least 10 characters.";
    setErrors(next);
    setSent(Object.keys(next).length === 0);
  }

  return (
    <form noValidate onSubmit={onSubmit} aria-label="Contact" className="grid gap-6">
      <FieldGroup>
        {(["name", "email"] as const).map((name) => (
          <Field key={name} invalid={Boolean(errors[name])}>
            <FieldLabel htmlFor={`c-${name}`} required>
              {name === "name" ? "Name" : "Email"}
            </FieldLabel>
            <Input
              id={`c-${name}`}
              name={name}
              type={name === "email" ? "email" : "text"}
              aria-required
              aria-invalid={errors[name] ? true : undefined}
              aria-describedby={errors[name] ? `c-${name}-error` : undefined}
            />
            <FieldError id={`c-${name}-error`}>{errors[name]}</FieldError>
          </Field>
        ))}
        <Field invalid={Boolean(errors.message)}>
          <FieldLabel htmlFor="c-message" required>
            Message
          </FieldLabel>
          <Textarea
            id="c-message"
            name="message"
            aria-required
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? "c-message-error" : undefined}
          />
          <FieldError id="c-message-error">{errors.message}</FieldError>
        </Field>
      </FieldGroup>
      <FieldSeparator />
      <div className="flex items-center justify-between gap-4">
        <p role="status" className="text-body-sm text-success">
          {sent ? "Thanks — message sent." : ""}
        </p>
        <Button type="submit" variant="gradient">
          Send message
        </Button>
      </div>
    </form>
  );
}

export const ValidationFlow: Story = {
  name: "Validation flow",
  render: () => <ContactFormDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Send message" }));
    await expect(canvas.getByText("Please tell me your name.")).toBeVisible();
    await expect(canvas.getByRole("textbox", { name: /Name/ })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await userEvent.type(canvas.getByRole("textbox", { name: /Name/ }), "Ada");
    await userEvent.type(canvas.getByRole("textbox", { name: /Email/ }), "ada@example.com");
    await userEvent.type(
      canvas.getByRole("textbox", { name: /Message/ }),
      "Let's build a design system.",
    );
    await userEvent.click(canvas.getByRole("button", { name: "Send message" }));
    await expect(canvas.getByRole("status")).toHaveTextContent("Thanks — message sent.");
  },
};
