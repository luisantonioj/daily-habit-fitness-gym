"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CoachAvatar } from "@/components/landing/coach-avatar";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { stitchContent } from "@/content/site";

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeHref, setActiveHref] = useState<string>(stitchContent.header.nav[0][1]);

  function closeMenu() {
    setIsOpen(false);
  }

  function handleNavClick(href: string) {
    setActiveHref(href);
    closeMenu();
  }

  useEffect(() => {
    const sectionIds = stitchContent.header.nav.map(([, href]) => href.replace(/^#/, ""));

    const handleScroll = () => {
      const headerOffset = 140;
      const scrollPosition = window.scrollY + headerOffset;

      const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60;
      if (isBottom) {
        setActiveHref(`#${sectionIds[sectionIds.length - 1]}`);
        return;
      }

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const element = document.getElementById(id);
        if (element) {
          const top = element.offsetTop;
          if (scrollPosition >= top) {
            setActiveHref(`#${id}`);
            return;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const { coachOnDuty } = stitchContent.header;

  return (
    <header className="site-header stitch-header">
      <div className="site-shell stitch-header-inner">
        <a className="stitch-brand" href="#top" aria-label="Daily Habit Fitness Gym home" onClick={closeMenu}>
          <Image src="/brand/daily-habit-mark.png" alt="Daily Habit Fitness Gym Logo" width={1080} height={1080} priority />
          <span>Daily Habit</span>
        </a>

        <nav id="primary-navigation" className={`stitch-nav${isOpen ? " is-open" : ""}`} aria-label="Primary navigation">
          {stitchContent.header.nav.map(([label, href]) => (
            <a
              className={activeHref === href ? "is-active" : ""}
              href={href}
              key={href}
              onClick={() => handleNavClick(href)}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="stitch-header-actions">
          <div className="coach-status" title={`Coach on duty: ${coachOnDuty.name}`}>
            <CoachAvatar src={coachOnDuty.media.src} alt={coachOnDuty.media.alt} width={64} height={64} />
            <span>
              <b>
                <i aria-hidden="true" />
                {coachOnDuty.name} • On Duty
              </b>
            </span>
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
