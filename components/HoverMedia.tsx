'use client';
import { useState } from 'react';
import Image from 'next/image';

// Shows the product's static screenshot normally; on hover (or tap, on touch
// devices), fades in a muted looping demo clip on top if the product has one.
// The video only mounts on hover so idle cards never pay for decode/bandwidth.
export default function HoverMedia({
  image, video, alt, sizes,
}: { image: string; video?: string; alt: string; sizes?: string }) {
  const [hovering, setHovering] = useState(false);

  return (
    <div
      style={{ position: 'absolute', inset: 0 }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onTouchStart={() => setHovering(true)}
    >
      <Image src={image} alt={alt} fill style={{ objectFit: 'cover' }} sizes={sizes} />
      {video && hovering && (
        <video
          src={video}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
    </div>
  );
}
