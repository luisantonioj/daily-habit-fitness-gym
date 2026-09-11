import { LeadForm } from "@/components/lead-form/lead-form";

const benefits = [
  {
    number: "01",
    title: "Start where you are",
    copy: "No perfect routine required. Take the first step with a plan that fits your real life.",
  },
  {
    number: "02",
    title: "Keep showing up",
    copy: "A good workout matters. A repeatable habit changes what comes next.",
  },
  {
    number: "03",
    title: "Train with purpose",
    copy: "Build confidence one session at a time in a space designed for steady progress.",
  },
];

const pillars = [
  "A clear place to begin",
  "A routine you can return to",
  "A community that keeps it human",
];

const faqs = [
  {
    question: "What happens after I register my interest?",
    answer:
      "Your details are securely recorded for the coach, and you will receive an email confirming that your interest was received. The coach will follow up with the latest visit and membership information.",
  },
  {
    question: "Is this suitable if I am new to the gym?",
    answer:
      "Yes. Daily Habit is positioned as an approachable place to start or restart your fitness routine. You do not need to arrive with everything figured out.",
  },
  {
    question: "Where is the gym and when is it open?",
    answer:
      "The coach-approved address and opening hours will be published here as soon as they are confirmed. Register your interest and we can share the latest details directly.",
  },
  {
    question: "What should I ask about before my first visit?",
    answer:
      "Tell us what you want to work toward, what kind of schedule you have, and any questions about membership or the training environment. That gives the coach a useful starting point.",
  },
];

function ArrowUpRight() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" focusable="false">
      <path d="M3 13 13 3M5 3h8v8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

function SectionHeading({
  eyebrow,
  title,
  copy,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  dark?: boolean;
}) {
  return (
    <div className={`section-heading${dark ? " section-heading-dark" : ""}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {copy ? <p className="section-heading-copy">{copy}</p> : null}
    </div>
  );
}

export function LandingPage() {
  return (
    <div className="site-frame">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="site-header">
        <div className="site-shell header-inner">
          <a className="brand-lockup" href="#top" aria-label="Daily Habit Fitness Gym home">
            <span className="brand-mark" aria-hidden="true">
              DH
            </span>
            <span className="brand-name">
              Daily Habit
              <small>Fitness Gym</small>
            </span>
          </a>

          <nav className="main-nav" aria-label="Primary navigation">
            <a href="#why">Why us</a>
            <a href="#experience">Experience</a>
            <a href="#faq">FAQ</a>
            <a href="#visit">Visit</a>
          </nav>

          <a className="button button-small button-dark" href="#register">
            Register interest <ArrowUpRight />
          </a>
        </div>
      </header>

      <main id="main-content">
        <section className="hero-section" id="top" aria-labelledby="hero-title">
          <div className="site-shell hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">Make movement a daily habit</p>
              <h1 id="hero-title">
                Build a routine that <em>sticks.</em>
              </h1>
              <p className="hero-lede">
                Daily Habit Fitness Gym is a place to start where you are, train with purpose, and keep showing up for yourself.
              </p>
              <div className="hero-actions">
                <a className="button button-primary" href="#register">
                  Register your interest <ArrowUpRight />
                </a>
                <a className="text-link" href="#why">
                  Explore the gym <span aria-hidden="true">↓</span>
                </a>
              </div>
              <div className="hero-note">
                <span className="note-dot" aria-hidden="true" />
                <span>A more approachable first step starts here.</span>
              </div>
            </div>

            <div className="hero-visual" aria-label="Coach-approved gym media placeholder">
              <div className="hero-media-placeholder">
                <div className="media-grid-lines" aria-hidden="true" />
                <span className="media-label">Coach media</span>
                <strong>Real work.<br />Real momentum.</strong>
                <span className="media-status">Photo or video coming soon</span>
              </div>
              <div className="hero-sticker" aria-hidden="true">
                <span>Show up</span>
                <span>Move well</span>
                <span>Repeat</span>
              </div>
              <div className="hero-index" aria-hidden="true">01 <span>/ 04</span></div>
            </div>
          </div>
        </section>

        <div className="ticker" aria-label="Daily Habit values">
          <div className="ticker-track">
            <span>SHOW UP</span><b aria-hidden="true">✳</b><span>MOVE WELL</span><b aria-hidden="true">✳</b><span>BUILD THE HABIT</span><b aria-hidden="true">✳</b>
            <span aria-hidden="true">SHOW UP</span><b aria-hidden="true">✳</b><span aria-hidden="true">MOVE WELL</span><b aria-hidden="true">✳</b><span aria-hidden="true">BUILD THE HABIT</span>
          </div>
        </div>

        <section className="section section-light" id="why" aria-labelledby="why-title">
          <div className="site-shell">
            <SectionHeading
              eyebrow="A place to begin"
              title="Fitness gets easier when the next step is clear."
              copy="Whether you are starting fresh or finding your way back, the goal is simple: make training feel like something you can keep doing."
            />
            <div className="benefit-grid">
              {benefits.map((benefit) => (
                <article className="benefit-card" key={benefit.number}>
                  <span className="card-number">{benefit.number}</span>
                  <div>
                    <h3>{benefit.title}</h3>
                    <p>{benefit.copy}</p>
                  </div>
                  <span className="card-arrow" aria-hidden="true">↗</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-dark" id="experience" aria-labelledby="experience-title">
          <div className="site-shell experience-grid">
            <div>
              <SectionHeading
                eyebrow="The Daily Habit mindset"
                title="Progress is built in the ordinary days."
                copy="The right environment makes it easier to return, reset, and keep working toward the person you want to become."
                dark
              />
              <a className="button button-light" href="#register">
                Plan your first visit <ArrowUpRight />
              </a>
            </div>
            <div className="pillar-list" aria-label="Daily Habit principles">
              {pillars.map((pillar, index) => (
                <div className="pillar" key={pillar}>
                  <span>0{index + 1}</span>
                  <strong>{pillar}</strong>
                  <span className="pillar-arrow" aria-hidden="true">↗</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-paper" id="media" aria-labelledby="media-title">
          <div className="site-shell">
            <div className="section-heading-row">
              <SectionHeading
                eyebrow="Inside the space"
                title="Bring the real gym into the first impression."
                copy="Approved photos and videos from the coach will replace these media slots before launch."
              />
              <span className="section-aside">Media / 01—04</span>
            </div>
            <div className="media-grid">
              <div className="media-card media-card-large">
                <div className="media-placeholder warm-placeholder">
                  <span>Media slot 01</span>
                  <strong>Gym floor<br />in motion</strong>
                </div>
                <p>Approved gym-floor photo</p>
              </div>
              <div className="media-card">
                <div className="media-placeholder dark-placeholder">
                  <span>Media slot 02</span>
                  <strong>Training<br />in focus</strong>
                </div>
                <p>Coach-approved training image</p>
              </div>
              <div className="media-card">
                <div className="media-placeholder lime-placeholder">
                  <span>Media slot 03</span>
                  <strong>Meet the<br />community</strong>
                </div>
                <p>Member or community image</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section section-accent" id="membership" aria-labelledby="membership-title">
          <div className="site-shell membership-grid">
            <div>
              <p className="eyebrow eyebrow-dark">Membership / your next step</p>
              <h2 id="membership-title">Ready to make your first visit count?</h2>
            </div>
            <div>
              <p className="membership-copy">
                Current rates, inclusions, and membership options will be published after coach confirmation. Register your interest and we will help you find the right starting point.
              </p>
              <a className="button button-dark" href="#register">
                Ask about membership <ArrowUpRight />
              </a>
            </div>
          </div>
        </section>

        <section className="section section-light faq-section" id="faq" aria-labelledby="faq-title">
          <div className="site-shell faq-grid">
            <SectionHeading
              eyebrow="Good to know"
              title="Questions are part of starting."
              copy="If your question is not here, send it through the registration form and the coach can answer it directly."
            />
            <div className="faq-list">
              {faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>
                    <span>{faq.question}</span>
                    <span className="faq-plus" aria-hidden="true">+</span>
                  </summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-paper visit-section" id="visit" aria-labelledby="visit-title">
          <div className="site-shell visit-grid">
            <div className="visit-map-placeholder" aria-label="Location map placeholder">
              <span className="map-cross map-cross-one" aria-hidden="true" />
              <span className="map-cross map-cross-two" aria-hidden="true" />
              <span className="map-pin" aria-hidden="true">+</span>
              <span className="map-label">Location map<br />coming soon</span>
            </div>
            <div className="visit-copy">
              <SectionHeading
                eyebrow="Come as you are"
                title="Make the first visit easy."
                copy="The coach-approved address, opening hours, phone number, and directions link will be added here before launch."
              />
              <div className="visit-details">
                <div><span>Address</span><strong>[OWNER TO CONFIRM]</strong></div>
                <div><span>Opening hours</span><strong>[OWNER TO CONFIRM]</strong></div>
                <div><span>Contact</span><strong>[OWNER TO CONFIRM]</strong></div>
              </div>
              <a className="text-link" href="#register">
                Ask about your first visit <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>

        <section className="register-section" id="register" aria-labelledby="register-title">
          <div className="site-shell">
            <div className="register-card">
              <div className="register-card-top">
                <div className="register-mark" aria-hidden="true">DH</div>
                <div className="register-copy">
                  <p className="eyebrow">Start the conversation</p>
                  <h2 id="register-title">Tell us what you want to build.</h2>
                  <p>Share your contact details and fitness goal, then the coach can help you find the right starting point.</p>
                </div>
              </div>
              <LeadForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-shell footer-grid">
          <div className="footer-brand">
            <span className="brand-mark brand-mark-light" aria-hidden="true">DH</span>
            <p>Daily Habit Fitness Gym</p>
          </div>
          <p className="footer-note">Show up for yourself.<br />Make it a habit.</p>
          <div className="footer-links">
            <a href="#top">Back to top ↑</a>
            <a href="#register">Register interest ↗</a>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Daily Habit Fitness Gym</span>
            <span>[OWNER TO CONFIRM] · Privacy notice</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
