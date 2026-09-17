"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";

const COMMUNITY_IMAGES = [
  "/community/758943992_122141134251037327_5010473453814190939_n.jpg",
  "/community/759188565_122141134365037327_1345578931517261496_n.jpg",
  "/community/759446277_122141132805037327_3385502209316736841_n.jpg",
  "/community/759574978_122141134395037327_8915329877897624501_n.jpg",
  "/community/759676777_122141134287037327_1260004703654148033_n.jpg",
  "/community/759699088_122141132235037327_1541514122630773473_n.jpg",
  "/community/759751888_122141134383037327_7548055067097278665_n.jpg",
  "/community/759776435_122141134263037327_5415490341244688358_n.jpg",
  "/community/762689107_122141132193037327_3250914026991169031_n.jpg",
  "/community/762689114_122141134275037327_5705763408412922426_n.jpg",
  "/community/763103502_122141399133037327_1904067227630839993_n.jpg",
  "/community/763103961_122141532867037327_6049716992967530715_n.jpg",
  "/community/764036707_122141662077037327_7831426034565454972_n.jpg",
  "/community/764807230_122141617257037327_7292343092147195330_n.jpg",
  "/community/768577272_122142015903037327_8738003056376443812_n.jpg",
  "/community/770866085_122142413073037327_3921031107020591659_n.jpg",
  "/community/774720142_122142771825037327_6705174697246841390_n.jpg",
  "/community/775425558_122142868719037327_4501656173225632622_n.jpg",
  "/community/776453554_122142793719037327_83165172549291269_n.jpg",
  "/community/777851700_122143031079037327_4941502125097865959_n.jpg",
  "/community/778852855_122143183347037327_2263873333676950718_n.jpg",
  "/community/778852859_122143031127037327_7712243740628494776_n.jpg",
  "/community/778899169_122143106571037327_7337831460364411922_n.jpg",
  "/community/780672415_122143031169037327_8754127048675798529_n.jpg",
  "/community/780727429_122143250037037327_8332981717857236924_n.jpg",
  "/community/783508049_122143117095037327_5476971409932878889_n.jpg",
  "/community/786287931_122143431153037327_180196123362225453_n.jpg",
  "/community/790317974_122144143233037327_4722978643517778671_n.jpg",
  "/community/790491092_122144143209037327_6975535096608940031_n.jpg",
  "/community/791399129_122143974279037327_618878300845259010_n.jpg",
  "/community/793901201_122144386425037327_7154282034448703086_n.jpg",
  "/community/794026443_122144386953037327_505880573677408848_n.jpg",
  "/community/799844179_122144708067037327_5172626937709324859_n.jpg",
  "/community/800051323_122145560343037327_7271821124907947489_n.jpg",
  "/community/800924818_122144983329037327_1519970811928088266_n.jpg",
  "/community/800993866_122144904867037327_4470378823947894615_n.jpg",
  "/community/810246539_122145355755037327_895268919420147989_n.jpg",
  "/community/813841679_122145603345037327_4417491096589110867_n.jpg",
];

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + COMMUNITY_IMAGES.length) % COMMUNITY_IMAGES.length);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % COMMUNITY_IMAGES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % COMMUNITY_IMAGES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const currentImage = COMMUNITY_IMAGES[currentIndex];
  const nextImage = COMMUNITY_IMAGES[(currentIndex + 1) % COMMUNITY_IMAGES.length];

  return (
    <section className="stitch-hero" id="top" aria-labelledby="hero-title">
      {/* Background carousel with centered community photo */}
      <div className="stitch-hero-carousel" aria-hidden="true">
        <div className="stitch-hero-image-wrap">
          <Image
            key={currentImage}
            className="stitch-hero-image stitch-hero-fade"
            src={currentImage}
            alt=""
            fill
            sizes="100vw"
            priority
          />
          {/* Preload next image quietly for seamless 5s rotation */}
          <div className="stitch-hero-preload" style={{ display: "none" }}>
            <Image src={nextImage} alt="" width={1} height={1} priority />
          </div>
        </div>
        {/* Left and right framing gradients */}
        <div className="stitch-hero-gradient stitch-hero-gradient-left" />
        <div className="stitch-hero-gradient stitch-hero-gradient-right" />
        <div className="stitch-hero-gradient stitch-hero-gradient-vertical" />
      </div>

      {/* Navigation Arrows */}
      <button
        type="button"
        onClick={goToPrevious}
        className="stitch-hero-arrow stitch-hero-arrow-prev"
        aria-label="Previous community photo"
      >
        <span className="material-symbols-outlined" aria-hidden="true">chevron_left</span>
      </button>

      <button
        type="button"
        onClick={goToNext}
        className="stitch-hero-arrow stitch-hero-arrow-next"
        aria-label="Next community photo"
      >
        <span className="material-symbols-outlined" aria-hidden="true">chevron_right</span>
      </button>

      {/* Content Overlay */}
      <div className="site-shell stitch-hero-grid">
        <div className="stitch-hero-copy">
          <h1 id="hero-title" className="stitch-hero-title">
            Build the Habit That <span>Changes</span> Everything.
          </h1>
          <p className="stitch-hero-description">
            An approachable fitness community for beginners and everyday progress. No judgment—just consistent daily habits.
          </p>
          <div className="stitch-hero-actions">
            <a className="stitch-button stitch-button-primary" href="#experience-services">
              Explore Gym Services
              <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
