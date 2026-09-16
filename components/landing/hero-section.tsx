import Image from "next/image";
import { sampleMedia, stitchContent } from "@/content/site";

function ArrowForward() {
  return <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>;
}

export function HeroSection() {
  const { hero } = stitchContent;
  const [titleBefore, titleAfter = ""] = hero.title.split("Changes");

  return (
    <section className="stitch-hero" id="top" aria-labelledby="hero-title">
      <div className="stitch-ambient-orb stitch-ambient-orb-one" aria-hidden="true" />
      <div className="stitch-ambient-orb stitch-ambient-orb-two" aria-hidden="true" />
      <div className="site-shell stitch-hero-grid">
        <div className="stitch-hero-copy">
          <div className="stitch-badge"><i aria-hidden="true" /><span>{hero.badge}</span></div>
          <h1 id="hero-title">{titleBefore}<span>Changes</span>{titleAfter}</h1>
          <p>{hero.description}</p>
          <div className="stitch-hero-actions">
            <a className="stitch-button stitch-button-primary" href="#register">{hero.primaryCta}<ArrowForward /></a>
            <a className="stitch-button stitch-button-secondary" href="#experience-services">{hero.secondaryCta}</a>
          </div>
          <div className="stitch-hero-metrics">
            {hero.metrics.map((metric) => <div className="stitch-metric" key={metric.title}><span className="material-symbols-outlined" aria-hidden="true">{metric.icon}</span><div><b>{metric.title}</b><small>{metric.detail}</small></div></div>)}
          </div>
        </div>

        <div className="stitch-hero-visual">
          <div className="stitch-hero-card">
            <div className="stitch-hero-image-wrap">
              <Image className="stitch-hero-image" src={sampleMedia.hero.src} alt={sampleMedia.hero.alt} fill sizes="(max-width: 900px) 100vw, 40vw" priority />
              <div className="stitch-hero-image-gradient" aria-hidden="true" />
              <div className="stitch-live-label"><i aria-hidden="true" />{hero.liveLabel}</div>
            </div>
            <div className="stitch-coach-card">
              <div className="stitch-coach-identity"><Image src={sampleMedia.coachSarah.src} alt={sampleMedia.coachSarah.alt} width={96} height={96} /><div><b>{hero.coachName}</b><small>{hero.coachRole}</small></div></div>
              <span className="stitch-floor-status">{hero.coachStatus}</span>
            </div>
            <div className="stitch-streak-card"><div><span>{hero.streakLabel}</span><b>{hero.streakValue}</b></div><div className="stitch-progress"><i /></div><p>{hero.streakCopy}</p></div>
          </div>
        </div>
      </div>
    </section>
  );
}
