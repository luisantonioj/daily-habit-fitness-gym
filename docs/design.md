# Design System and UX Guidelines

## Design direction

Use the supplied Stitch reference as the exact layout and interaction source: a confident, energetic, editorial gym landing page with bold athletic typography, dark surfaces, high-contrast yellow actions, compact information cards, generous spacing, and a welcoming tone for beginners. The sample content is intentionally copied into the current build as temporary official-site content at the owner's request, including its claims, names, metrics, rates/placeholders, testimonials, amenities, contact details, and remote mock imagery. No additional facts should be invented beyond the sample.

Use the sample's remote media URLs for this adaptation. The coach must verify image availability, rights, accuracy, and final production suitability before launch. Do not make the visitor feel that they must already be fit to belong.

## Design tokens and themes

Keep these values in CSS variables so the future mockup can replace them without rewriting components:

```css
[data-theme="dark"] {
  --color-ink: #111416;
  --color-ink-soft: #252a2d;
  --color-surface-high: #32383e;
  --color-paper: #ffffff;
  --color-paper-muted: #d9d4c2;
  --color-accent: #fff200;
  --color-accent-text: #fff200;
  --color-on-accent: #111416;
  --color-border: rgb(255 255 255 / 0.14);
  --color-muted: #b7b9b6;
}

[data-theme="light"] {
  --color-ink: #111416;
  --color-ink-soft: #ffffff;
  --color-surface-high: #e7e5de;
  --color-paper: #f3f0e9;
  --color-paper-muted: #dedbd2;
  --color-accent: #fff200;
  --color-accent-text: #5d6200;
  --color-on-accent: #111416;
  --color-border: rgb(17 20 22 / 0.14);
  --color-muted: #526066;
}

:root {
  --color-danger: #b64238;
  --color-focus: #2859c5;
  --radius-card: 1.25rem;
  --radius-pill: 999px;
  --shadow-card: 0 1.5rem 4rem rgb(17 20 22 / 0.12);
  --content-max: 76rem;
}
```

Dark mode is the default because it reflects the supplied brand reference. Light mode keeps the same black, white, yellow, and slate-gray brand family while using warm paper backgrounds and a darker olive accent text token where yellow would not meet contrast. The bright accent must always be paired with dark text. Body text must meet WCAG AA contrast. Focus styling must remain visible against both themes.

The theme toggle sets `data-theme` on `<html>` and persists the value under the `daily-habit-theme` local-storage key. The server-rendered default is dark; a small pre-paint initialization script applies a saved choice before the page becomes visible. The toggle must expose its state through `aria-pressed` and a useful accessible label.

Approved local brand assets are stored at `public/brand/daily-habit-logo.png` for the full lockup and `public/brand/daily-habit-mark.png` for the kettlebell/lightning mark. Use the exact sample remote images from `lh3.googleusercontent.com` for temporary content and keep their alt text and display roles in the typed content model.

## Page structure

1. **Header** — logo/name, section links, and a high-visibility registration CTA.
2. **Hero** — clear beginner-friendly promise, primary CTA, supporting proof point, and approved hero media.
3. **Why Daily Habit** — three to four benefits focused on support, consistency, practical access, and community.
4. **Training environment** — equipment, facilities, coaching, or programs using only confirmed facts.
5. **Media gallery** — approved photos and video with responsive crops and poster images.
6. **Membership or rates** — published prices only when confirmed; otherwise a clear “ask about membership” CTA.
7. **Social proof** — testimonials, member quotes, or approved community evidence.
8. **FAQ** — beginner concerns, what to bring, first visit, schedule, and membership questions.
9. **Visit the gym** — address, hours, phone, map/directions link, and social links.
10. **Registration form** — contact and fitness intent fields with consent and clear expectations.
11. **Footer** — privacy notice link, social links, copyright, and secondary contact CTA.

## Component expectations

- `SiteHeader`: responsive navigation with an accessible menu button on small screens, the supplied mark/full lockup, and a dark/light theme toggle.
- `HeroSection`: one primary action and one optional secondary action.
- `BenefitGrid`: short, scannable benefit cards with simple icon or text treatment.
- `FacilitySection`: factual content paired with media.
- `MediaGallery`: responsive image grid and optional video card.
- `OfferSection`: rates or membership prompt with an owner-confirmation boundary.
- `TestimonialSection`: quote, name/descriptor, and permission status.
- `FaqSection`: native disclosure behavior where possible.
- `VisitSection`: practical visit details and directions CTA.
- `LeadForm`: labeled fields, inline errors, loading state, success state, and retryable failure state.
- `SiteFooter`: policy and contact links.

## Responsive behavior

- Design mobile-first for social traffic.
- Keep the primary CTA visible in the first viewport and repeat it after major decision points.
- Use a single-column layout on small screens and progressively introduce two- and three-column grids.
- Avoid horizontal scrolling, tiny tap targets, and text over busy imagery.
- Keep form fields full-width on mobile and place related fields side by side only when space permits.
- Ensure hero media has a defined aspect ratio to avoid layout shifts.
- Keep the header compact without hiding the primary CTA behind unnecessary interaction.
- In light mode, keep the yellow CTA and dark logo backing visually intentional rather than introducing unrelated brand colors.

## Interaction states

Every interactive component must define:

- Default state.
- Hover state where applicable.
- Keyboard focus state.
- Pressed/active state where applicable.
- Disabled state.
- Loading state.
- Error state.
- Success state.

The lead form must preserve entered values after recoverable errors and prevent duplicate clicks while submitting.

## Media requirements

- Preserve the sample's remote assets for the temporary adaptation and keep their source URLs centralized.
- Confirm remote image availability and usage permission before production publication.
- Provide responsive crops or object-position guidance for hero images.
- Provide poster images, captions, and a text alternative for video.
- Use descriptive alt text for informative images and empty alt text for decorative images.
- Compress images and use modern formats where supported.
- Do not autoplay video with sound.
- Respect reduced-motion preferences for video, carousels, and animated entrances.

## Accessibility

- Use landmarks: `header`, `nav`, `main`, `section`, and `footer`.
- Maintain a logical heading hierarchy with one page-level `h1`.
- Associate every form control with a visible label.
- Announce validation and submission status through accessible live regions.
- Preserve keyboard access to navigation, accordions, media controls, and the form.
- Provide a visible, high-contrast focus indicator.
- Keep touch targets at least 44px where practical.
- Do not rely on color alone to communicate errors or status.
- Ensure the theme toggle is reachable by keyboard and announces its current mode.
- Test at narrow mobile width, large desktop width, zoomed text, and reduced motion.
- Check keyboard flow and automated accessibility findings before launch.

## Content rules

- Prefer plain English and short paragraphs.
- Use encouraging language without promising guaranteed physical results.
- Keep calls to action specific: “Ask about membership”, “Plan your first visit”, or “Register your interest”.
- Preserve the sample's exact content during this adaptation, including any sample placeholders.
- Before production launch, require coach verification of prices, opening hours, address details, coach credentials, testimonials, metrics, amenities, and contact details.
