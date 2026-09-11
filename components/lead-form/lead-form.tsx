"use client";

import { FormEvent, useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

type ApiResponse =
  | { ok: true; leadId: string }
  | { ok: false; error?: string; fieldErrors?: Record<string, string[]> };

const goals = [
  "Build a consistent workout routine",
  "Get stronger",
  "Improve my energy and movement",
  "Return to exercise",
  "Something else",
];

export function LeadForm() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");
    setFieldErrors({});

    const form = event.currentTarget;
    const formData = new FormData(form);
    const currentUrl = new URL(window.location.href);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      preferredContactMethod: formData.get("preferredContactMethod"),
      fitnessGoal: formData.get("fitnessGoal"),
      message: formData.get("message"),
      consent: formData.get("consent") === "on",
      honeypot: formData.get("company"),
      source: currentUrl.searchParams.get("utm_source") ? "campaign" : "website",
      utmSource: currentUrl.searchParams.get("utm_source"),
      utmMedium: currentUrl.searchParams.get("utm_medium"),
      utmCampaign: currentUrl.searchParams.get("utm_campaign"),
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as ApiResponse;

      if (!response.ok || !result.ok) {
        setState("error");
        setMessage(result.ok ? "Please try again." : result.error ?? "Please check the form and try again.");
        setFieldErrors(result.ok ? {} : result.fieldErrors ?? {});
        return;
      }

      form.reset();
      setState("success");
      setMessage("Thanks — your interest is on its way to the coach. Check your inbox for confirmation.");
    } catch {
      setState("error");
      setMessage("We could not connect right now. Please check your connection and try again.");
    }
  }

  const getError = (field: string) => fieldErrors[field]?.[0];
  const describedBy = (field: string) => (getError(field) ? `${field}-error` : undefined);

  if (state === "success") {
    return (
      <div className="form-success" role="status" aria-live="polite">
        <span className="success-icon" aria-hidden="true">✓</span>
        <div>
          <strong>Your first step is logged.</strong>
          <p>{message}</p>
        </div>
        <button className="form-reset" type="button" onClick={() => setState("idle")}>
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <form className="lead-form" onSubmit={handleSubmit} noValidate>
      <div className="form-heading">
        <p className="form-kicker">Registration of interest</p>
        <p>Share a little about where you are starting. The coach will follow up with the latest details.</p>
      </div>

      <div className="form-grid form-grid-two">
        <div className="field-group">
          <label htmlFor="lead-name">Name <span aria-hidden="true">*</span></label>
          <input id="lead-name" name="name" type="text" autoComplete="name" placeholder="Your name" aria-invalid={Boolean(getError("name"))} aria-describedby={describedBy("name")} required />
          {getError("name") ? <span className="field-error" id="name-error">{getError("name")}</span> : null}
        </div>
        <div className="field-group">
          <label htmlFor="lead-email">Email <span aria-hidden="true">*</span></label>
          <input id="lead-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" aria-invalid={Boolean(getError("email"))} aria-describedby={describedBy("email")} required />
          {getError("email") ? <span className="field-error" id="email-error">{getError("email")}</span> : null}
        </div>
      </div>

      <div className="form-grid form-grid-two">
        <div className="field-group">
          <label htmlFor="lead-phone">Phone <span className="optional-label">Optional</span></label>
          <input id="lead-phone" name="phone" type="tel" autoComplete="tel" placeholder="09XX XXX XXXX" aria-invalid={Boolean(getError("phone"))} aria-describedby={describedBy("phone")} />
          {getError("phone") ? <span className="field-error" id="phone-error">{getError("phone")}</span> : null}
        </div>
        <div className="field-group">
          <label htmlFor="lead-contact">Preferred contact</label>
          <select id="lead-contact" name="preferredContactMethod" defaultValue="email" aria-invalid={Boolean(getError("preferredContactMethod"))} aria-describedby={describedBy("preferredContactMethod")}>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="either">Either is fine</option>
          </select>
          {getError("preferredContactMethod") ? <span className="field-error" id="preferredContactMethod-error">{getError("preferredContactMethod")}</span> : null}
        </div>
      </div>

      <div className="field-group">
        <label htmlFor="lead-goal">What do you want to work toward?</label>
        <select id="lead-goal" name="fitnessGoal" defaultValue="" aria-invalid={Boolean(getError("fitnessGoal"))} aria-describedby={describedBy("fitnessGoal")} required>
          <option value="" disabled>Select a starting point</option>
          {goals.map((goal) => <option key={goal} value={goal}>{goal}</option>)}
        </select>
        {getError("fitnessGoal") ? <span className="field-error" id="fitnessGoal-error">{getError("fitnessGoal")}</span> : null}
      </div>

      <div className="field-group">
        <label htmlFor="lead-message">Anything you want us to know? <span className="optional-label">Optional</span></label>
        <textarea id="lead-message" name="message" rows={3} placeholder="Questions, schedule, or goals..." aria-invalid={Boolean(getError("message"))} aria-describedby={describedBy("message")} />
        {getError("message") ? <span className="field-error" id="message-error">{getError("message")}</span> : null}
      </div>

      <div className="honeypot" aria-hidden="true">
        <label htmlFor="lead-company">Company</label>
        <input id="lead-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="form-consent">
        <input id="lead-consent" name="consent" type="checkbox" aria-invalid={Boolean(getError("consent"))} aria-describedby={describedBy("consent")} required />
        <label htmlFor="lead-consent">I agree that Daily Habit Fitness Gym may use these details to respond to my inquiry. <span aria-hidden="true">*</span></label>
      </div>
      {getError("consent") ? <span className="field-error" id="consent-error">{getError("consent")}</span> : null}

      {state === "error" ? <p className="form-alert" role="alert">{message}</p> : null}

      <div className="form-submit-row">
        <button className="button button-primary form-submit" type="submit" disabled={state === "submitting"}>
          {state === "submitting" ? "Sending..." : "Send my interest"}
          <span aria-hidden="true">↗</span>
        </button>
        <p>Required fields are marked <span aria-hidden="true">*</span>. No medical information needed.</p>
      </div>
    </form>
  );
}
