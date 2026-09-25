import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Introduction() {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headlineRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
      });

      gsap.from(bodyRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
          toggleActions: 'play none none reverse',
        },
        y: 40,
        opacity: 0,
        duration: 1.2,
        delay: 0.2,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="project"
      ref={sectionRef}
      className="relative w-full py-28 sm:py-36 md:py-48 px-6 sm:px-12 bg-[#F3F0EA] text-[#171716] flex flex-col justify-center"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Editorial Subheader */}
        <div className="flex items-center gap-4 mb-8">
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#A38D70] font-semibold">
            01 / INTRODUCTION
          </span>
          <span className="w-12 h-[1px] bg-[#A38D70]/40" />
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#77736B]">
            THE RESIDENCE
          </span>
        </div>

        {/* Large Architectural Headline */}
        <h2
          ref={headlineRef}
          className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-[#171716] leading-[1.15] mb-12 sm:mb-16 max-w-4xl"
        >
          A study in light, material, and proportion.
        </h2>

        {/* Two-column Editorial Body */}
        <div
          ref={bodyRef}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 pt-8 border-t border-[#171716]/10"
        >
          <div className="md:col-span-4">
            <span className="font-serif italic text-2xl sm:text-3xl text-[#77736B] block mb-2 font-normal">
              Aurelia Residence
            </span>
            <span className="font-mono text-xs tracking-widest uppercase text-[#A38D70]">
              ESTATE OVERVIEW
            </span>
          </div>

          <div className="md:col-span-8 flex flex-col gap-6">
            <p className="font-sans text-lg sm:text-xl md:text-2xl text-[#171716]/85 font-light leading-relaxed">
              Designed around the relationship between architecture and landscape, Aurelia Residence
              creates a calm and highly considered environment for contemporary living.
            </p>
            <p className="font-sans text-sm sm:text-base text-[#77736B] leading-relaxed max-w-2xl">
              Every vista is orchestrated to frame the Mediterranean horizon, capturing shifting daylight across
              raw travertine surfaces, monolithic concrete elements, and quiet expanses of water.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
