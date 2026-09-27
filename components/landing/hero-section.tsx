"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

const MOBILE_VIDEO = "/videos/daily-habit-video-mobile.mp4";
const DESKTOP_VIDEO = "/videos/daily-habit-video-web.mp4";

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showBrandBar, setShowBrandBar] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const viewport = window.matchMedia("(min-width: 640px)");
    const selectVideo = () => {
      const src = viewport.matches ? DESKTOP_VIDEO : MOBILE_VIDEO;
      if (video.getAttribute("src") === src) return;

      video.src = src;
      video.load();
      void video.play().catch(() => {
        // Autoplay may be blocked by browser settings; keep the hero control-free.
      });
    };

    selectVideo();
    viewport.addEventListener("change", selectVideo);
    return () => viewport.removeEventListener("change", selectVideo);
  }, []);

  useEffect(() => {
    const updateBrandBar = () => setShowBrandBar(window.scrollY <= 24);
    updateBrandBar();
    window.addEventListener("scroll", updateBrandBar, { passive: true });
    window.addEventListener("pageshow", updateBrandBar);
    window.addEventListener("popstate", updateBrandBar);
    window.addEventListener("hashchange", updateBrandBar);

    return () => {
      window.removeEventListener("scroll", updateBrandBar);
      window.removeEventListener("pageshow", updateBrandBar);
      window.removeEventListener("popstate", updateBrandBar);
      window.removeEventListener("hashchange", updateBrandBar);
    };
  }, []);

  return (
    <section className="stitch-hero" id="top" aria-labelledby="hero-title">
      <h1 className="sr-only" id="hero-title">Daily Habit Fitness Gym</h1>
      <div
        className={`stitch-hero-brandbar${showBrandBar ? " is-visible" : ""}`}
        aria-hidden={!showBrandBar}
        inert={!showBrandBar}
      >
        <a className="stitch-hero-brand" href="#top" aria-label="Daily Habit Fitness Gym home">
          <Image src="/brand/daily-habit-mark.png" alt="" width={1080} height={1080} priority />
          <span>Daily Habit</span>
        </a>
        <a className="stitch-hero-cta" href="#register">
          Get Started
          <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
        </a>
      </div>
      <video
        ref={videoRef}
        className="stitch-hero-video"
        aria-hidden="true"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
    </section>
  );
}
