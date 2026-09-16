import Image from "next/image";
import { SiteHeader } from "@/components/landing/site-header";
import { LeadForm } from "@/components/lead-form/lead-form";
import { HeroSection } from "@/components/landing/hero-section";

const benefits = [
  { icon: "tune", title: "Start where you are", copy: "No perfect routine required. Take the first step with a plan that fits your real life.", note: "Zero-ego floor" },
  { icon: "repeat", title: "Keep showing up", copy: "A repeatable habit makes movement easier to return to, one session at a time.", note: "Small wins count" },
  { icon: "support_agent", title: "Train with purpose", copy: "Ask questions, find your footing, and build confidence without the pressure to perform.", note: "Beginner-friendly" },
];

const experienceCards = [
  { icon: "fitness_center", title: "Training options", copy: "Explore the routines, programs, or access options that fit your goals. Details are coming after coach confirmation." },
  { icon: "calendar_month", title: "A schedule you can keep", copy: "Share your availability and the coach can help you identify a realistic way to make training part of your week." },
  { icon: "groups", title: "A space that feels human", copy: "Daily Habit is designed to welcome people who are starting fresh or finding their way back to movement." },
];

const faqs = [
  { question: "What happens after I register my interest?", answer: "Your details are securely recorded for the coach, and you will receive an email confirming that your interest was received. The coach will follow up with the latest visit and membership information." },
  { question: "Is this suitable if I am new to the gym?", answer: "Yes. Daily Habit is positioned as an approachable place to start or restart your fitness routine. You do not need to arrive with everything figured out." },
  { question: "Where is the gym and when is it open?", answer: "The coach-approved address and opening hours will be published here as soon as they are confirmed. Register your interest and we can share the latest details directly." },
  { question: "What should I ask about before my first visit?", answer: "Tell us what you want to work toward, what kind of schedule you have, and any questions about membership or the training environment. That gives the coach a useful starting point." },
];

function ArrowUpRight() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" focusable="false">
      <path d="M3 13 13 3M5 3h8v8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

function MaterialIcon({ name }: { name: string }) {
  return <span className="material-icon" aria-hidden="true">{name}</span>;
}

function SectionHeading({ eyebrow, title, copy, dark = false, id }: { eyebrow: string; title: string; copy?: string; dark?: boolean; id?: string }) {
  return (
    <div className={`section-heading${dark ? " section-heading-dark" : ""}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      {copy ? <p className="section-heading-copy">{copy}</p> : null}
    </div>
  );
}

export function LandingPage() {
  return (
    <div className="site-frame">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />

      <main id="main-content">
        <HeroSection />

        <div className="ticker" aria-label="Daily Habit values"><div className="ticker-track"><span>SHOW UP</span><b aria-hidden="true">✳</b><span>MOVE WELL</span><b aria-hidden="true">✳</b><span>BUILD THE HABIT</span><b aria-hidden="true">✳</b><span aria-hidden="true">SHOW UP</span><b aria-hidden="true">✳</b><span aria-hidden="true">MOVE WELL</span><b aria-hidden="true">✳</b><span aria-hidden="true">BUILD THE HABIT</span></div></div>

        <section className="section section-light" id="benefits" aria-labelledby="benefits-title">
          <div className="site-shell">
            <SectionHeading id="benefits-title" eyebrow="Why Daily Habit" title="Fitness gets easier when the next step is clear." copy="Whether you are starting fresh or finding your way back, the goal is simple: make training feel like something you can keep doing." />
            <div className="benefit-grid">
              {benefits.map((benefit, index) => <article className="benefit-card" key={benefit.title}><div className="card-topline"><span className="card-number">0{index + 1}</span><MaterialIcon name={benefit.icon} /></div><div><h3>{benefit.title}</h3><p>{benefit.copy}</p></div><div className="card-footer"><span>{benefit.note}</span><span aria-hidden="true">↗</span></div></article>)}
            </div>
          </div>
        </section>

        <section className="section section-dark" id="experience-services" aria-labelledby="experience-title">
          <div className="site-shell">
            <div className="experience-intro"><SectionHeading id="experience-title" eyebrow="The Daily Habit experience" title="Built for the days you actually have." copy="Find a practical starting point, ask what you need to know, and build momentum in an environment that keeps it human." dark /><a className="button button-light" href="#register">Plan your first visit <ArrowUpRight /></a></div>
            <div className="experience-card-grid">{experienceCards.map((card, index) => <article className="experience-card" key={card.title}><span className="experience-number">0{index + 1}</span><MaterialIcon name={card.icon} /><h3>{card.title}</h3><p>{card.copy}</p><span className="card-arrow" aria-hidden="true">↗</span></article>)}</div>
          </div>
        </section>

        <section className="section section-paper" id="coaching-media" aria-labelledby="media-title">
          <div className="site-shell"><div className="section-heading-row"><SectionHeading id="media-title" eyebrow="Inside the space" title="Bring the real gym into the first impression." copy="Approved photos and videos from the coach will replace these media slots before launch." /><span className="section-aside">Media / 01—04</span></div><div className="media-grid"><figure className="media-card media-card-large"><div className="media-placeholder warm-placeholder"><span>Media slot 01</span><strong>Gym floor<br />in motion</strong><MaterialIcon name="play_circle" /></div><figcaption>Approved gym-floor photo or video poster</figcaption></figure><figure className="media-card"><div className="media-placeholder dark-placeholder"><span>Media slot 02</span><strong>Training<br />in focus</strong></div><figcaption>Coach-approved training image</figcaption></figure><figure className="media-card"><div className="media-placeholder lime-placeholder"><span>Media slot 03</span><strong>Meet the<br />community</strong></div><figcaption>Approved member or community image</figcaption></figure></div></div>
        </section>

        <section className="section section-light offer-section" id="memberships" aria-labelledby="membership-title">
          <div className="site-shell offer-grid"><div className="offer-label"><span className="offer-number">04</span><span>Membership / your next step</span></div><div><SectionHeading id="membership-title" eyebrow="Find your fit" title="Ready to make your first visit count?" copy="Current rates, inclusions, and membership options will be published after coach confirmation. Register your interest and we will help you find the right starting point." /><a className="button button-dark" href="#register">Ask about membership <ArrowUpRight /></a></div></div>
        </section>

        <section className="section testimonial-section" aria-labelledby="social-proof-title"><div className="site-shell testimonial-grid"><div className="testimonial-mark" aria-hidden="true">“</div><div><p className="eyebrow">Social proof</p><h2 id="social-proof-title">Real voices belong here.</h2><p className="testimonial-copy">Coach-approved member stories and testimonials will be added here with permission before launch.</p><span className="testimonial-source">[OWNER TO CONFIRM] · Member story</span></div></div></section>

        <section className="section section-paper faq-section" id="faq" aria-labelledby="faq-title"><div className="site-shell faq-grid"><SectionHeading id="faq-title" eyebrow="Good to know" title="Questions are part of starting." copy="If your question is not here, send it through the registration form and the coach can answer it directly." /><div className="faq-list">{faqs.map((faq) => <details key={faq.question}><summary><span>{faq.question}</span><span className="faq-plus" aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}</div></div></section>

        <section className="section section-light visit-section" id="location-contact" aria-labelledby="visit-title"><div className="site-shell visit-grid"><div className="visit-copy"><SectionHeading id="visit-title" eyebrow="Come as you are" title="Make the first visit easy." copy="The coach-approved address, opening hours, phone number, and directions link will be added here before launch." /><div className="visit-details"><div><span>Main studio location</span><strong>[OWNER TO CONFIRM]</strong></div><div><span>Operating hours</span><strong>[OWNER TO CONFIRM]</strong></div><div><span>Direct contact</span><strong>[OWNER TO CONFIRM]</strong></div></div><a className="text-link" href="#register">Ask about your first visit <span aria-hidden="true">↗</span></a></div><div className="visit-map-placeholder" aria-label="Location map placeholder"><span className="map-cross map-cross-one" aria-hidden="true" /><span className="map-cross map-cross-two" aria-hidden="true" /><span className="map-pin" aria-hidden="true"><MaterialIcon name="location_on" /></span><span className="map-label">Map and directions<br />coming soon</span></div></div></section>

        <section className="register-section" id="register" aria-labelledby="register-title"><div className="site-shell"><div className="register-card"><div className="register-card-top"><div className="register-brand-panel"><Image src="/brand/daily-habit-mark.png" alt="" width={1080} height={1080} /></div><div className="register-copy"><p className="eyebrow">Start the conversation</p><h2 id="register-title">Tell us what you want to build.</h2><p>Share your contact details and fitness goal, then the coach can help you find the right starting point.</p></div></div><LeadForm /></div></div></section>
      </main>

      <footer className="site-footer"><div className="site-shell footer-grid"><div className="footer-brand"><Image src="/brand/daily-habit-logo.png" alt="Daily Habit Fitness Gym" width={1200} height={630} /><p>Show up for yourself.<br />Make it a habit.</p></div><div className="footer-links"><span>Explore</span><a href="#benefits">Benefits</a><a href="#experience-services">Experience &amp; services</a><a href="#coaching-media">Coaching &amp; media</a><a href="#faq">FAQ</a></div><div className="footer-links"><span>Next step</span><a href="#memberships">Memberships</a><a href="#location-contact">Location &amp; contact</a><a href="#register">Register interest ↗</a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Daily Habit Fitness Gym</span><span>[OWNER TO CONFIRM] · Privacy notice</span></div></div></footer>
    </div>
  );
}
