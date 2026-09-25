import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PLATES = [
  {
    number: '01',
    title: 'The Entrance Approach',
    space: 'South-West Facade',
    dimension: '12M Entry Portal',
    detail: 'Monolithic Roman travertine volume framing the reflection pool.',
    image: '/images/facade.jpg',
  },
  {
    number: '02',
    title: 'The Living Pavilion',
    space: 'Double-Height Salon',
    dimension: 'American Walnut',
    detail: 'Cantilevered floating staircase with integrated architectural cove lighting.',
    image: '/images/walnut.jpg',
  },
  {
    number: '03',
    title: 'The Transparent Portal',
    space: 'Acoustic Glass Walls',
    dimension: '3.6M Clear Height',
    detail: 'Motorized pocket glazing that dissolves the threshold between salon and sky.',
    image: '/images/glazing.jpg',
  },
  {
    number: '04',
    title: 'The Grand Salon',
    space: 'Vein-Cut Travertine',
    dimension: 'Tivoli Quarry Selection',
    detail: 'Unbroken stone floor planes extending from interior hearth to the terrace.',
    image: '/images/travertine.jpg',
  },
  {
    number: '05',
    title: 'The Azure Horizon',
    space: 'Cantilevered Pool',
    dimension: '24M Saltwater Pool',
    detail: 'Suspended perimeter aligning water reflections with the Mediterranean horizon.',
    image: '/images/pool.jpg',
  },
  {
    number: '06',
    title: 'The Estate Grounds',
    space: 'Terraced Landscape',
    dimension: '4,200 SQ M Grounds',
    detail: 'Centenarian olive trees and wild lavender set into native limestone.',
    image: '/images/landscape.jpg',
  },
  {
    number: '07',
    title: 'Twilight Choreography',
    space: 'Illumination Design',
    dimension: 'Circadian Calibration',
    detail: 'Concealed linear luminaires programmed to warm evening temperatures.',
    image: '/images/lighting.jpg',
  },
  {
    number: '08',
    title: 'The Promontory',
    space: 'Coastal Sanctuary',
    dimension: '240M Elevation',
    detail: 'Commanding cliffside topography providing absolute privacy and 270° views.',
    image: '/images/aerial.jpg',
  },
];

export default function HorizontalGallery() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const progressBarRef = useRef(null);
  const counterRef = useRef(null);

  const [activeModalPlate, setActiveModalPlate] = useState(null);

  // Keyboard Escape listener and scroll lock when modal is open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveModalPlate(null);
      }
    };

    if (activeModalPlate) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeModalPlate]);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const getScrollAmount = () => {
      return track.scrollWidth - window.innerWidth + 120;
    };

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1.1,
          start: 'top top',
          end: () => `+=${getScrollAmount() * 1.15}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;

            if (progressBarRef.current) {
              progressBarRef.current.style.width = `${Math.min(100, Math.max(0, p * 100))}%`;
            }

            const slideIndex = Math.min(
              PLATES.length,
              Math.max(1, Math.floor(p * PLATES.length) + 1)
            );
            if (counterRef.current) {
              counterRef.current.innerText = `0${slideIndex} / 0${PLATES.length}`;
            }
          },
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="horizontal-gallery"
      className="relative w-full h-[100dvh] bg-[#171716] text-[#F3F0EA] overflow-hidden flex flex-col justify-between pt-16 sm:pt-24 pb-3 sm:pb-6 border-t border-white/10 select-none"
    >
      {/* Refined Minimalist Top Header */}
      <div className="w-full px-4 sm:px-12 flex items-end justify-between border-b border-white/10 pb-2.5 sm:pb-4 shrink-0 z-20 bg-[#171716]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[9px] sm:text-xs tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[#A38D70] font-medium">
              01 &bull; CURATED SPACES
            </span>
            <span className="w-4 sm:w-6 h-[1px] bg-[#A38D70]/40" />
          </div>
          <h2 className="font-serif text-xl sm:text-3xl lg:text-4xl font-light tracking-tight text-[#F3F0EA]">
            Spaces &amp; Horizons
          </h2>
        </div>

        {/* Counter & Status */}
        <div className="flex items-center gap-3 sm:gap-6">
          <span className="hidden sm:inline font-mono text-[10px] tracking-[0.25em] text-[#C8BDAA]/60 uppercase">
            ARCHITECTURAL SEQUENCE
          </span>
          <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1 bg-white/[0.03] border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A38D70]" />
            <span
              ref={counterRef}
              className="font-mono text-[11px] sm:text-xs tracking-widest text-[#F3F0EA]"
            >
              01 / 0{PLATES.length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Track */}
      <div className="relative w-full flex-1 flex items-center overflow-hidden z-10 my-auto">
        <div
          ref={trackRef}
          className="flex flex-nowrap items-center gap-8 sm:gap-10 pl-6 sm:pl-12 will-change-transform"
        >
          {PLATES.map((item) => (
            <div
              key={item.number}
              onClick={() => setActiveModalPlate(item)}
              className="group cursor-pointer shrink-0 w-[78vw] sm:w-[54vw] md:w-[44vw] lg:w-[36vw] xl:w-[32vw] flex flex-col justify-between transition-all duration-400"
            >
              {/* Photo Canvas */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40 border border-white/10 group-hover:border-[#A38D70] transition-colors duration-500 shadow-xl">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-[0.92] group-hover:brightness-100"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <span className="font-mono text-[9px] tracking-widest uppercase text-white bg-black/70 px-2.5 py-1 backdrop-blur-sm border border-white/20">
                    VIEW STILL &plus;
                  </span>
                </div>
              </div>

              {/* Minimalist Editorial Caption */}
              <div className="pt-3 pb-1 flex flex-col justify-between">
                <div className="flex items-baseline justify-between gap-3 mb-1">
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-mono text-xs text-[#A38D70] tracking-wider">
                      {item.number}
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl font-light text-[#F3F0EA] tracking-wide group-hover:text-[#A38D70] transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <span className="font-mono text-[10px] tracking-wider uppercase text-[#C8BDAA]/60 shrink-0">
                    {item.dimension}
                  </span>
                </div>

                <p className="font-sans text-xs text-[#C8BDAA]/75 font-light leading-relaxed line-clamp-2">
                  {item.detail}
                </p>
              </div>
            </div>
          ))}

          {/* Clean Transition Card at the end */}
          <div className="shrink-0 w-[45vw] sm:w-[28vw] lg:w-[20vw] aspect-[16/10] flex flex-col justify-between p-6 border border-white/10 bg-white/[0.02]">
            <div>
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#A38D70]">
                CHAPTER 02
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-light text-[#F3F0EA] mt-2 mb-2">
                Philosophy &amp; Form
              </h3>
              <p className="font-sans text-xs text-[#C8BDAA]/70 font-light leading-relaxed">
                Continue below to explore architectural principles and estate specifications.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[#A38D70] font-mono text-[10px] tracking-widest uppercase">
              <span>EXPLORE BELOW</span>
              <span className="animate-bounce">&darr;</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <div className="w-full px-6 sm:px-12 shrink-0 z-20 bg-[#171716]">
        <div className="relative w-full h-[1px] bg-white/10 mb-2.5 overflow-hidden">
          <div
            ref={progressBarRef}
            className="absolute top-0 left-0 h-full bg-[#A38D70] transition-[width] duration-75 ease-out shadow-[0_0_8px_#A38D70]"
            style={{ width: '0%' }}
          />
        </div>

        <div className="flex items-center justify-between font-mono text-[9px] sm:text-[10px] tracking-[0.25em] text-[#C8BDAA]/60 uppercase">
          <span>AURELIA RESIDENCE &bull; PORTFOLIO</span>
          <span>SCROLL DOWN TO PROGRESS &rarr;</span>
        </div>
      </div>

      {/* Responsive, Proportionate Lightbox Modal */}
      {activeModalPlate && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 md:p-8 animate-fadeIn"
          onClick={() => setActiveModalPlate(null)}
        >
          <div
            className="relative max-w-3xl lg:max-w-4xl w-full max-h-[86vh] flex flex-col justify-between bg-[#171716] border border-white/20 p-4 sm:p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 gap-3 shrink-0">
              <div className="flex items-baseline gap-2.5 min-w-0">
                <span className="font-mono text-xs tracking-wider text-[#A38D70] shrink-0">
                  {activeModalPlate.number}
                </span>
                <h3 className="font-serif text-lg sm:text-xl text-[#F3F0EA] tracking-wide truncate">
                  {activeModalPlate.title}
                </h3>
                <span className="font-mono text-[10px] text-[#C8BDAA]/60 uppercase hidden sm:inline shrink-0">
                  &bull; {activeModalPlate.dimension}
                </span>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setActiveModalPlate(null)}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-[#A38D70] border border-white/30 hover:border-[#A38D70] text-[#F3F0EA] hover:text-[#171716] font-mono text-[11px] tracking-wider uppercase transition-all cursor-pointer shadow-md font-medium"
                title="Close (Esc)"
              >
                <span>CLOSE</span>
                <span className="text-base font-serif leading-none">&times;</span>
              </button>
            </div>

            {/* Proportionate Image Frame - Constrained to 50vh max so it never overflows */}
            <div className="relative w-full max-h-[50vh] sm:max-h-[54vh] my-3 flex items-center justify-center overflow-hidden bg-black/60 border border-white/10 shrink-1">
              <img
                src={activeModalPlate.image}
                alt={activeModalPlate.title}
                className="w-full max-h-[50vh] sm:max-h-[54vh] object-contain sm:object-cover"
              />
            </div>

            {/* Modal Bottom Metadata */}
            <div className="flex items-center justify-between gap-4 pt-1 text-xs text-[#C8BDAA]/80 shrink-0">
              <p className="font-sans font-light truncate max-w-xl">
                {activeModalPlate.detail}
              </p>
              <button
                onClick={() => setActiveModalPlate(null)}
                className="font-mono text-[9px] tracking-widest uppercase text-[#A38D70] hover:text-white transition-colors cursor-pointer shrink-0 hidden sm:inline"
              >
                [ CLICK OUTSIDE OR ESC TO CLOSE ]
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
