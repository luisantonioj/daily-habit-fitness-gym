"use client";

import Image from "next/image";
import { useState } from "react";

const links = [
  ["Benefits", "#benefits"],
  ["Experience", "#experience-services"],
  ["Media", "#coaching-media"],
  ["FAQ", "#faq"],
  ["Visit", "#location-contact"],
] as const;

function ArrowUpRight() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" focusable="false">
      <path d="M3 13 13 3M5 3h8v8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <header className="site-header">
      <div className="site-shell header-inner">
        <a className="brand-lockup" href="#top" aria-label="Daily Habit Fitness Gym home" onClick={closeMenu}>
          <span className="brand-mark-image">
            <Image src="/brand/daily-habit-mark.png" alt="" width={1080} height={1080} priority />
          </span>
          <span className="brand-name">Daily Habit<small>Fitness Gym</small></span>
        </a>

        <button className="menu-toggle" type="button" aria-expanded={isOpen} aria-controls="primary-navigation" onClick={() => setIsOpen((open) => !open)}>
          <span className="sr-only">{isOpen ? "Close" : "Open"} navigation</span>
          <span aria-hidden="true" className="menu-toggle-lines"><i /><i /><i /></span>
        </button>

        <nav id="primary-navigation" className={`main-nav${isOpen ? " is-open" : ""}`} aria-label="Primary navigation">
          {links.map(([label, href]) => <a href={href} key={href} onClick={closeMenu}>{label}</a>)}
        </nav>

        <a className="button button-small button-dark header-cta" href="#register" onClick={closeMenu}>Register interest <ArrowUpRight /></a>
      </div>
    </header>
  );
}
