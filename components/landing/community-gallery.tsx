"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { communityPhotos } from "@/content/community-photos";

export function CommunityGallery() {
  const [paging, setPaging] = useState({ start: 0, size: 8 });
  const [selected, setSelected] = useState<number | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const gallery = useRef<HTMLDivElement>(null);
  const closeViewer = () => {
    setSelected(null);
    const target = trigger.current?.isConnected ? trigger.current : gallery.current?.querySelector<HTMLButtonElement>(".community-gallery-thumbnail");
    target?.focus({ preventScroll: true });
  };
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
    <div ref={gallery} className="community-gallery" role="region" aria-label="Gym photo gallery">
      <div className="community-gallery-grid">
        {communityPhotos.slice(paging.start, paging.start + paging.size).map((photo, index) => (
          <button type="button" className="community-gallery-thumbnail" key={photo.src} onClick={(event) => { trigger.current = event.currentTarget; setSelected(paging.start + index); }} aria-label={`View photo ${paging.start + index + 1}: ${photo.alt}`} aria-haspopup="dialog">
            <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 900px) 45vw, 25vw" />
          </button>
        ))}
      </div>
      <div className="community-gallery-controls">
        <button type="button" onClick={() => movePage(-1)} aria-label="Previous gallery page">←</button>
        <span role="status">Page {page + 1} of {pages}</span>
        <button type="button" onClick={() => movePage(1)} aria-label="Next gallery page">→</button>
      </div>
      {selected !== null && <PhotoViewer initialIndex={selected} onClose={closeViewer} />}
    </div>
  );
}

function PhotoViewer({ initialIndex, onClose }: { initialIndex: number; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(initialIndex);
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  const photo = communityPhotos[index];
  const move = (direction: number) => {
    setStatus("loading");
    setIndex((current) => (current + direction + communityPhotos.length) % communityPhotos.length);
  };
  useEffect(() => {
    const element = dialog.current!;
    const overflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = overflow;
    };
  }, []);
  const dismiss = () => {
    dialog.current?.close();
    onClose();
  };
  return (
    <dialog ref={dialog} className="community-photo-viewer" aria-label="Gym photo viewer"
      onCancel={(event) => { event.preventDefault(); dismiss(); }}
      onClick={(event) => { if (event.target === event.currentTarget) dismiss(); }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault(); move(event.key === "ArrowLeft" ? -1 : 1);
        }
      }}>
      <div className="community-viewer-toolbar">
        <span aria-live="polite" aria-atomic="true">Photo {index + 1} of {communityPhotos.length}</span>
        <a href={photo.src} target="_blank" rel="noopener noreferrer">Open original<span className="sr-only"> (new tab)</span></a>
        <button type="button" onClick={dismiss} autoFocus aria-label="Close photo viewer">✕</button>
      </div>
      <div className="community-viewer-stage" onClick={(event) => { if (event.target === event.currentTarget) dismiss(); }}>
        <Image key={photo.src} src={photo.src} alt={photo.alt} width={photo.width} height={photo.height}
          unoptimized className="community-viewer-image" onLoad={() => setStatus("loaded")} onError={() => setStatus("error")}
          style={{ visibility: status === "loaded" ? "visible" : "hidden" }} />
        {status !== "loaded" && <p className="community-viewer-message" role="status">{status === "error" ? "This photo could not load. Try another photo or open the original." : "Loading photo…"}</p>}
      </div>
      <div className="community-viewer-navigation">
        <button type="button" onClick={() => move(-1)} aria-label="Previous photo">←</button>
        <button type="button" onClick={() => move(1)} aria-label="Next photo">→</button>
      </div>
    </dialog>
  );
}
