"use client";

import Image from "next/image";
import { useState } from "react";

const fallbackSource = "/brand/daily-habit-mark.png";

type CoachAvatarProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export function CoachAvatar({ src, alt, width, height }: CoachAvatarProps) {
  const [source, setSource] = useState(src);

  return (
    <Image
      src={source}
      alt={alt}
      width={width}
      height={height}
      onError={() => setSource(fallbackSource)}
    />
  );
}
