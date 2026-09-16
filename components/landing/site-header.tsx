"use client";

import Image from "next/image";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { sampleMedia, stitchContent } from "@/content/site";

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <header className="site-header stitch-header">
      <div className="site-shell stitch-header-inner">
        <a className="stitch-brand" href="#top" aria-label="Daily Habit Fitness Gym home" onClick={closeMenu}>
          <Image src="/brand/daily-habit-mark.png" alt="Daily Habit Fitness Gym Logo" width={1080} height={1080} priority />
          <span>Daily Habit</span>
        </a>

        <nav id="primary-navigation" className={`stitch-nav${isOpen ? " is-open" : ""}`} aria-label="Primary navigation">
          {stitchContent.header.nav.map(([label, href], index) => <a className={index === 0 ? "is-active" : ""} href={href} key={href} onClick={closeMenu}>{label}</a>)}
        </nav>

        <div className="stitch-header-actions">
          <div className="coach-status">
            <Image src={sampleMedia.coachSarah.src} alt="Profile" width={64} height={64} />
            <span><b><i aria-hidden="true" />{stitchContent.header.status}</b></span>
          </div>
          <ThemeToggle />
          <button className="stitch-menu-toggle" type="button" aria-expanded={isOpen} aria-controls="primary-navigation" onClick={() => setIsOpen((open) => !open)}>
            <span className="sr-only">{isOpen ? "Close" : "Open"} navigation</span>
            <span aria-hidden="true" className="menu-toggle-lines"><i /><i /><i /></span>
          </button>
          <a className="stitch-header-cta" href="#register" onClick={closeMenu}>{stitchContent.header.cta}<span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span></a>
        </div>
      </div>
    </header>
  );
}
