"use client";

import React, { useEffect, useRef } from "react";

const MOBILE_VIDEO = "/videos/daily-habit-video-mobile.mp4";
const DESKTOP_VIDEO = "/videos/daily-habit-video-web.mp4";

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

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

  return (
    <section className="stitch-hero" id="top" aria-labelledby="hero-title">
      <h1 className="sr-only" id="hero-title">Daily Habit Fitness Gym</h1>
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
