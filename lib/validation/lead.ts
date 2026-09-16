import { z } from "zod";

const optionalText = (max: number) =>
  z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().trim().max(max).optional(),
  );

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100, "Please use a shorter name."),
  email: z.string().trim().email("Please enter a valid email address.").max(254),
  phone: optionalText(30),
  preferredContactMethod: z.enum(["email", "phone", "either"], {
    error: "Please select a preferred contact method.",
  }),
  fitnessGoal: z.string().trim().min(2, "Please tell us what you want to work toward.").max(120),
  message: optionalText(1000),
  consent: z.literal(true, { error: "Please agree to the privacy notice." }),
  honeypot: z.string().max(0, "Invalid submission.").optional().default(""),
  source: z.string().trim().max(80).optional().default("website"),
  utmSource: optionalText(120),
  utmMedium: optionalText(120),
  utmCampaign: optionalText(120),
  idempotencyKey: optionalText(120),
});

export type LeadInput = z.infer<typeof leadSchema>;

export function getLeadFieldErrors(error: z.ZodError<LeadInput>) {
  return error.issues.reduce<Record<string, string[]>>((errors, issue) => {
    const field = issue.path[0];
    if (typeof field !== "string") return errors;
    errors[field] = [...(errors[field] ?? []), issue.message];
    return errors;
  }, {});
}
