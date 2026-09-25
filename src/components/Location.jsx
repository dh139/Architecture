import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const DISTANCES = [
  { time: '08 MIN', destination: 'WATERFRONT', description: 'Private deep-water marina & beach club' },
  { time: '15 MIN', destination: 'CITY CENTER', description: 'Historic arts district & Michelin dining' },
  { time: '20 MIN', destination: 'INTERNATIONAL AIRPORT', description: 'Private aviation terminal & heliport' },
];

export default function Location() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.loc-anim-item', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        y: 40,
        opacity: 0,
        duration: 1.1,
        stagger: 0.15,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="location"
      ref={sectionRef}
      className="relative w-full py-20 sm:py-36 md:py-44 px-4 sm:px-12 bg-[#171716] text-[#F3F0EA] overflow-hidden"
    >
      {/* Background Architectural Topographical / Vector Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg
          className="w-full h-full object-cover"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 600"
          preserveAspectRatio="none"
        >
          {/* Subtle Topographical Elevation Contours */}
          <path
            d="M0,150 Q250,90 500,200 T1000,120"
            fill="none"
            stroke="#A38D70"
            strokeWidth="0.8"
            strokeDasharray="4,6"
          />
          <path
            d="M0,280 Q300,200 600,320 T1000,240"
            fill="none"
            stroke="#C8BDAA"
            strokeWidth="0.8"
          />
          <path
            d="M0,420 Q200,360 500,450 T1000,380"
            fill="none"
            stroke="#A38D70"
            strokeWidth="0.6"
            strokeDasharray="2,4"
          />
          <circle cx="500" cy="280" r="140" fill="none" stroke="#C8BDAA" strokeWidth="0.4" strokeDasharray="3,3" />
          <circle cx="500" cy="280" r="280" fill="none" stroke="#A38D70" strokeWidth="0.4" />
          {/* Estate Marker Pin */}
          <circle cx="500" cy="280" r="6" fill="#A38D70" />
          <circle cx="500" cy="280" r="14" fill="none" stroke="#A38D70" strokeWidth="1" className="animate-ping" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="loc-anim-item flex items-center gap-3 mb-6">
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#A38D70] font-semibold">
            05 / GEOGRAPHY
          </span>
          <span className="w-10 h-[1px] bg-[#A38D70]/40" />
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#C8BDAA]/70">
            STRATEGIC LOCATION
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Heading and Estate Title */}
          <div className="loc-anim-item lg:col-span-6">
            <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-[#F3F0EA] mb-4">
              AURELIA
              <br />
              <span className="text-[#C8BDAA] font-extralight tracking-wider">RESIDENCE</span>
            </h2>

            <p className="font-serif italic text-xl sm:text-2xl text-[#A38D70] mb-8 font-light">
              Private Hillside Estate
            </p>

            <p className="font-sans text-sm sm:text-base text-[#C8BDAA]/80 font-light leading-relaxed max-w-lg mb-8">
              Perched securely on a protected coastal promontory, the estate commands complete privacy while remaining minutes from premier nautical, cultural, and international transport hubs.
            </p>

            <div className="inline-flex items-center gap-4 py-3 px-5 border border-white/10 bg-white/[0.02]">
              <span className="w-2 h-2 rounded-full bg-[#A38D70]" />
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#C8BDAA]">
                ELEVATION: 240M ABOVE SEA LEVEL
              </span>
            </div>
          </div>

          {/* Right Column: Key Transit Metrics */}
          <div className="loc-anim-item lg:col-span-6 flex flex-col gap-6">
            {DISTANCES.map((item) => (
              <div
                key={item.destination}
                className="group p-8 bg-white/[0.03] border border-white/10 hover:border-[#A38D70] transition-all duration-400 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="font-mono text-xs tracking-[0.25em] uppercase text-[#A38D70] mb-1">
                    {item.destination}
                  </div>
                  <div className="font-serif text-3xl sm:text-4xl font-light text-[#F3F0EA]">
                    {item.time}
                  </div>
                  <div className="font-sans text-xs text-[#C8BDAA]/70 font-light mt-1">
                    {item.description}
                  </div>
                </div>

                <div className="sm:self-center font-mono text-xs text-[#A38D70] tracking-widest uppercase flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                  <span>TRANSIT</span>
                  <span>&rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
