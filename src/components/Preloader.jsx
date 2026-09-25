import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Preloader({ onComplete }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const lineRef = useRef(null);
  const percentRef = useRef(null);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    let progress = { value: 0 };

    // Simulate luxury asset preloading sequence
    const tl = gsap.timeline({
      onComplete: () => {
        // Fade out animation
        gsap.to(containerRef.current, {
          yPercent: -100,
          duration: 1.1,
          ease: 'power4.inOut',
          onComplete: () => {
            if (onComplete) onComplete();
          },
        });
      },
    });

    tl.to(progress, {
      value: 100,
      duration: 1.8,
      ease: 'power2.out',
      onUpdate: () => {
        setPercent(Math.round(progress.value));
        if (lineRef.current) {
          lineRef.current.style.width = `${progress.value}%`;
        }
      },
    });

    tl.to(
      textRef.current,
      {
        opacity: 0,
        y: -20,
        duration: 0.6,
        ease: 'power3.in',
      },
      '+=0.2'
    );

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#171716] text-[#F3F0EA] select-none"
    >
      <div ref={textRef} className="flex flex-col items-center text-center">
        <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-[#A38D70] mb-3">
          ARCHITECTURAL RESIDENCE
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-[0.25em] text-[#F3F0EA] uppercase mb-1">
          AURELIA
        </h1>
        <span className="font-serif text-lg sm:text-xl font-extralight tracking-[0.4em] text-[#C8BDAA] uppercase mb-8">
          RESIDENCE
        </span>

        {/* Loading bar */}
        <div className="w-40 sm:w-48 h-[1px] bg-white/10 relative overflow-hidden mb-3">
          <div
            ref={lineRef}
            className="absolute left-0 top-0 h-full bg-[#A38D70] transition-all duration-75"
            style={{ width: `${percent}%` }}
          />
        </div>

        <span ref={percentRef} className="font-mono text-xs tracking-widest text-[#C8BDAA]/60">
          {percent.toString().padStart(3, '0')} / 100
        </span>
      </div>
    </div>
  );
}
