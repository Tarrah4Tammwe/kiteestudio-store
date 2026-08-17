'use client';
import { useEffect, useState } from 'react';

const ROTATION = [
  { video: '/videos/gym-tracker-loop.mp4', label: 'Gym Tracker' },
  { video: '/videos/plate-quest-loop.mp4', label: 'Plate Quest' },
  { video: '/videos/clientflow-loop.mp4', label: 'Clientflow' },
  { video: '/videos/postplanned-loop.mp4', label: 'PostPlanned' },
  { video: '/videos/the-empress-loop.mp4', label: 'The Empress' },
];

export default function HeroShowcase() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % ROTATION.length), 5500);
    return () => clearInterval(id);
  }, []);

  const current = ROTATION[index];

  return (
    <div className="hero-float">
      <div className="hero-float-glow" />
      <div className="hero-float-phone">
        <div className="hero-float-notch" />
        <video
          key={current.video}
          src={current.video}
          autoPlay loop muted playsInline preload="auto"
          aria-label={`${current.label} app in use`}
        />
      </div>
      <div className="hero-float-tag">
        <span className="dot" /> LIVE PRODUCT — {current.label.toUpperCase()}
      </div>
      <div className="hero-float-dots">
        {ROTATION.map((r, i) => (
          <button
            key={r.video}
            aria-label={`Show ${r.label}`}
            onClick={() => setIndex(i)}
            className={i === index ? 'active' : ''}
          />
        ))}
      </div>
    </div>
  );
}
