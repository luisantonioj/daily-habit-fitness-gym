"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { communityPhotos } from "@/content/community-photos";

export function CommunityGallery() {
  const [paging, setPaging] = useState({ start: 0, size: 8 });
  useEffect(() => {
    const viewport = window.matchMedia("(max-width: 900px)");
    const update = () => setPaging(({ start }) => {
      const size = viewport.matches ? 4 : 8;
      return { start: Math.floor(start / size) * size, size };
    });
    update();
    viewport.addEventListener("change", update);
    return () => viewport.removeEventListener("change", update);
  }, []);
  const page = Math.floor(paging.start / paging.size);
  const pages = Math.ceil(communityPhotos.length / paging.size);
  const movePage = (direction: number) => setPaging(({ size }) => ({
    size, start: ((page + direction + pages) % pages) * size,
  }));

  return (
    <div className="community-gallery" role="region" aria-label="Gym photo gallery">
      <div className="community-gallery-grid">
        {communityPhotos.slice(paging.start, paging.start + paging.size).map((photo, index) => (
          <a className="community-gallery-thumbnail" key={photo.src} href={photo.src} target="_blank" rel="noopener noreferrer" aria-label={`View photo ${paging.start + index + 1}: ${photo.alt}`}>
            <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 900px) 45vw, 25vw" />
          </a>
        ))}
      </div>
      <div className="community-gallery-controls">
        <button type="button" onClick={() => movePage(-1)} aria-label="Previous gallery page">←</button>
        <span role="status">Page {page + 1} of {pages}</span>
        <button type="button" onClick={() => movePage(1)} aria-label="Next gallery page">→</button>
      </div>
    </div>
  );
}
