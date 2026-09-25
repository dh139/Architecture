import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const contentRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.playsInline = true;
      video.play().catch(() => {
        // Autoplay may be deferred until user interaction
      });
    }

    // GSAP text reveal
    const ctx = gsap.context(() => {
      gsap.from('.hero-anim-item', {
        y: 40,
        opacity: 0,
        duration: 1.4,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.8,
      });

      // Subtle parallax & fade out on scroll
      gsap.to(contentRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
        y: -100,
        opacity: 0,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const scrollToExplore = () => {
    const el = document.getElementById('project');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-[#171716] flex items-center justify-center text-[#F3F0EA]"
    >
      {/* Background Video (Video 1: Exterior -> Entrance) */}
      <video
        ref={videoRef}
        src="/videos/video1.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none filter brightness-[0.82] contrast-[1.05]"
      />

      {/* Cinematic Vignette & Ambient Gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(23,23,22,0.15) 0%, rgba(23,23,22,0.5) 75%, rgba(23,23,22,0.85) 100%)',
        }}
      />

      {/* Editorial Content Overlay */}
      <div
        ref={contentRef}
        className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center pointer-events-auto"
      >
        <div className="hero-anim-item flex items-center gap-3 mb-4">
          <span className="w-6 h-[1px] bg-[#A38D70]" />
          <span className="font-mono text-xs sm:text-sm tracking-[0.35em] uppercase text-[#C8BDAA]">
            Contemporary Architecture
          </span>
          <span className="w-6 h-[1px] bg-[#A38D70]" />
        </div>

        <h1 className="hero-anim-item font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-[0.12em] text-[#F3F0EA] uppercase leading-[0.95] mb-6">
          AURELIA
          <br />
          <span className="font-extralight tracking-[0.25em] text-[#C8BDAA] text-4xl sm:text-6xl md:text-7xl lg:text-8xl block mt-2">
            RESIDENCE
          </span>
        </h1>

        <p className="hero-anim-item font-serif italic text-lg sm:text-2xl text-[#F3F0EA]/85 font-light tracking-wide max-w-xl mb-10">
          A Private Expression of Modern Living
        </p>

        {/* Subtle architectural coordinates */}
        <div className="hero-anim-item flex items-center gap-6 font-mono text-[11px] tracking-[0.25em] text-[#C8BDAA]/70 uppercase">
          <span>LAT 43° 42&apos; N</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#A38D70]" />
          <span>LONG 7° 16&apos; E</span>
        </div>
      </div>

      {/* Subtle Scroll to Explore Button */}
      <button
        ref={scrollIndicatorRef}
        onClick={scrollToExplore}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 group cursor-pointer focus:outline-none"
      >
        <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#C8BDAA] group-hover:text-[#FFFFFF] transition-colors">
          SCROLL TO EXPLORE &darr;
        </span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-[#A38D70] to-transparent group-hover:h-10 transition-all duration-300" />
      </button>
    </section>
  );
}
