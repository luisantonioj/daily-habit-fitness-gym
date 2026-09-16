import Image from "next/image";
import { HeroSection } from "@/components/landing/hero-section";
import { SiteHeader } from "@/components/landing/site-header";
import { LeadForm } from "@/components/lead-form/lead-form";
import { stitchContent, type MediaAsset } from "@/content/site";

function Icon({ name, className = "" }: { name: string; className?: string }) {
  return <span className={`material-symbols-outlined ${className}`} aria-hidden="true">{name}</span>;
}

function ArrowForward() {
  return <Icon name="arrow_forward" />;
}

function SectionHeader({ eyebrow, title, description, id, centered = false }: { eyebrow: string; title: string; description?: string; id: string; centered?: boolean }) {
  return (
    <div className={`stitch-section-header${centered ? " is-centered" : ""}`}>
      <span className="stitch-eyebrow">{eyebrow}</span>
      <h2 id={id}>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}

function MediaImage({ media, className = "" }: { media: MediaAsset; className?: string }) {
  return <Image className={className} src={media.src} alt={media.alt} fill sizes="(max-width: 900px) 100vw, 50vw" />;
}

export function LandingPage() {
  const { benefits, experience, coaching, tour, memberships, community, faq, location } = stitchContent;

  return (
    <div className="site-frame">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />

      <main id="main-content" className="stitch-page">
        <HeroSection />

        <section className="stitch-section stitch-benefits" id="benefits" aria-labelledby="benefits-title">
          <div className="site-shell">
            <div className="stitch-section-header-row"><SectionHeader id="benefits-title" eyebrow={benefits.eyebrow} title={benefits.title} description={benefits.description} /><span className="stitch-section-index">01 / 04</span></div>
            <div className="stitch-benefit-grid">
              {benefits.cards.map((card) => <article className="stitch-benefit-card" key={card.title}><div className="stitch-card-icon"><Icon name={card.icon} /></div><div className="stitch-card-copy"><h3>{card.title}</h3><p>{card.copy}</p></div><div className="stitch-card-tag">{card.tag}<Icon name="check_circle" /></div></article>)}
            </div>
          </div>
        </section>

        <section className="stitch-section stitch-experience" id="experience-services" aria-labelledby="experience-title">
          <div className="site-shell">
            <SectionHeader id="experience-title" eyebrow={experience.eyebrow} title={experience.title} description={experience.description} centered />
            <div className="stitch-service-grid">
              {experience.cards.map((card, index) => <article className={`stitch-service-card${index === 0 ? " is-featured" : ""}`} key={card.title}><div className="stitch-service-media"><MediaImage media={card.media} /><div className="stitch-service-shade" aria-hidden="true" /><span className="stitch-service-label"><Icon name="fiber_manual_record" />{card.label}</span><span className="stitch-service-corner">{card.corner}</span>{index === 0 ? <span className="stitch-play"><Icon name="play_arrow" /></span> : null}</div><div className="stitch-service-body"><h3>{card.title}</h3><p>{card.copy}</p><ul>{card.chips.map((chip) => <li className={chip === card.chips[card.chips.length - 1] ? "is-accent" : ""} key={chip}>{chip}</li>)}</ul></div></article>)}
            </div>
          </div>
        </section>

        <section className="stitch-section stitch-coaching" id="coaching-media" aria-labelledby="coaching-title">
          <div className="site-shell"><div className="stitch-section-header-row"><SectionHeader id="coaching-title" eyebrow={coaching.eyebrow} title={coaching.title} /><span className="stitch-section-index">02 / 04</span></div><div className="stitch-coach-grid">{coaching.coaches.map((coach) => <article className="stitch-coach-profile" key={coach.name}><div className="stitch-coach-photo"><MediaImage media={coach.media} /><span className="stitch-coach-label">{coach.label}</span></div><div className="stitch-coach-profile-body"><div><span className="stitch-coach-role">{coach.role}</span><h3>{coach.name}</h3></div><p>“{coach.quote}”</p><span className="stitch-coach-note"><Icon name="verified" />{coach.note}</span></div></article>)}</div></div>
        </section>

        <section className="stitch-section stitch-tour" aria-labelledby="tour-title">
          <div className="site-shell stitch-tour-grid"><div className="stitch-tour-copy"><SectionHeader id="tour-title" eyebrow={tour.eyebrow} title={tour.title} description={tour.description} /><a className="stitch-button stitch-button-secondary" href="#location-contact">{tour.cta}<ArrowForward /></a><div className="stitch-tour-features">{tour.features.map((feature) => <span key={feature}><Icon name={feature.includes("Sanitization") ? "sanitizer" : "lock_clock"} />{feature}</span>)}</div></div><div className="stitch-tour-media"><MediaImage media={tour.media} /><div className="stitch-tour-overlay" aria-hidden="true" /><span className="stitch-tour-play"><Icon name="play_arrow" /></span><span className="stitch-tour-duration">{tour.duration}</span></div></div>
        </section>

        <section className="stitch-section stitch-memberships" id="memberships" aria-labelledby="memberships-title">
          <div className="site-shell"><SectionHeader id="memberships-title" eyebrow={memberships.eyebrow} title={memberships.title} description={memberships.description} centered /><div className="stitch-membership-grid">{memberships.tiers.map((tier) => <article className={`stitch-membership-card${tier.featured ? " is-featured" : ""}`} key={tier.name}><span className="stitch-tier-badge">{tier.badge}</span><h3>{tier.name}</h3><p>{tier.description}</p><div className="stitch-tier-price"><strong>{tier.price}</strong>{tier.priceNote ? <span>{tier.priceNote}</span> : null}</div><ul>{tier.features.map((feature) => <li key={feature}><Icon name="check" />{feature}</li>)}{tier.exclusions.map((feature) => <li className="is-excluded" key={feature}><Icon name="remove" />{feature}</li>)}</ul><a className={`stitch-tier-button${tier.featured ? " is-primary" : ""}`} href="#register">Select Plan <ArrowForward /></a>{tier.featured ? <span className="stitch-community-favorite"><Icon name="star" />Community Favorite</span> : null}</article>)}</div><p className="stitch-membership-note"><Icon name="info" />{memberships.note}</p></div>
        </section>

        <section className="stitch-section stitch-community" aria-labelledby="community-title">
          <div className="site-shell"><SectionHeader id="community-title" eyebrow={community.eyebrow} title={community.title} /><div className="stitch-community-grid"><article className="stitch-feed-card"><div className="stitch-feed-image"><MediaImage media={community.feed.media} /><div className="stitch-feed-shade" aria-hidden="true" /></div><div className="stitch-feed-body"><div className="stitch-feed-meta"><b>{community.feed.label}</b><span>{community.feed.timestamp}</span></div><div className="stitch-feed-tags">{community.feed.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><blockquote>“{community.feed.quote}”</blockquote><p>{community.feed.copy}</p><div className="stitch-feed-stats"><span><Icon name="favorite" />{community.feed.celebrations}</span><span><Icon name="chat_bubble" />{community.feed.comments}</span><b>#NoEgoJustHabits</b></div></div></article><div className="stitch-testimonial-list">{community.testimonials.map((testimonial) => <article className="stitch-testimonial" key={testimonial.name}><div className="stitch-testimonial-person"><Image src={testimonial.media.src} alt={testimonial.media.alt} width={96} height={96} /><div><b>{testimonial.name}</b><small>{testimonial.detail}</small></div></div><p>“{testimonial.quote}”</p><span className="stitch-testimonial-star"><Icon name="star" /></span></article>)}</div></div></div>
        </section>

        <section className="stitch-section stitch-faq" id="faq" aria-labelledby="faq-title"><div className="site-shell stitch-faq-grid"><SectionHeader id="faq-title" eyebrow={faq.eyebrow} title={faq.title} description={faq.description} /><div className="stitch-faq-list">{faq.items.map((item) => <details key={item.question}><summary>{item.question}<Icon name="expand_more" /></summary><p>{item.answer}</p></details>)}</div></div></section>

        <section className="stitch-section stitch-location" id="location-contact" aria-labelledby="location-title"><div className="site-shell"><SectionHeader id="location-title" eyebrow={location.eyebrow} title={location.title} /><div className="stitch-location-grid"><div className="stitch-location-cards"><article><div><Icon name="pin_drop" /><h3>{location.addressTitle}</h3></div><strong>{location.address}</strong><p>{location.addressCopy}</p></article><article><div><Icon name="schedule" /><h3>Operating Hours</h3></div><strong>{location.hours}</strong><dl>{location.hoursRows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></article><article><div><Icon name="alternate_email" /><h3>Direct Contact</h3></div><strong>{location.contact}</strong><p>{location.contactCopy}</p></article></div><div className="stitch-map"><div className="stitch-map-art" aria-hidden="true" /><div className="stitch-map-callout"><div><i aria-hidden="true" /><div><b>{location.mapLabel}</b><span>{location.mapSubLabel}</span></div></div><a href="#register">{location.cta}</a></div></div></div></div></section>

        <section className="register-section" id="register" aria-labelledby="register-title"><div className="site-shell"><div className="register-card"><div className="register-card-top"><div className="register-brand-panel"><Image src="/brand/daily-habit-mark.png" alt="" width={1080} height={1080} /></div><div className="register-copy"><p className="eyebrow">Start the conversation</p><h2 id="register-title">Tell us what you want to build.</h2><p>Share your contact details and fitness goal, then the coach can help you find the right starting point.</p></div></div><LeadForm /></div></div></section>
      </main>

      <footer className="site-footer"><div className="site-shell footer-grid"><div className="footer-brand"><Image src="/brand/daily-habit-logo.png" alt="Daily Habit Fitness Gym" width={1200} height={630} /><p>Show up for yourself.<br />Make it a habit.</p></div><div className="footer-links"><span>Explore</span><a href="#benefits">Benefits</a><a href="#experience-services">Experience &amp; services</a><a href="#coaching-media">Coaching &amp; media</a><a href="#memberships">Membership tiers</a></div><div className="footer-links"><span>Member support</span><a href="#faq">FAQ &amp; help center</a><a href="#location-contact">Locker &amp; kiosk access</a><a href="#location-contact">Contact front desk</a><a href="#booking-portal">Session check-in</a></div><div className="footer-facility"><span>Facility</span><p>{stitchContent.footer.facility}</p><p><Icon name="location_on" />{stitchContent.footer.location}</p></div><div className="footer-bottom"><span>{stitchContent.footer.copyright}</span><span><a href="#privacy-policy">Privacy Policy</a> · <a href="#accessibility">Accessibility Statement</a> · <a href="#terms">Terms of Service</a></span></div></div></footer>
    </div>
  );
}
