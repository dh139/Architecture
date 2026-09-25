import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const FEATURES = [
  {
    number: '01',
    title: 'Floor-to-Ceiling Glazing',
    detail: 'Motorized triple-glazed acoustic panels engineered to slide flush into concealed structural wall pockets.',
    dimension: '3.6M CLEAR HEIGHT',
    tag: 'FAÇADE ENGINEERING',
    image: '/images/glazing.jpg',
    aspect: 'PORTAL VIEW',
  },
  {
    number: '02',
    title: 'Roman Vein-Cut Travertine',
    detail: 'Hand-selected travertine slabs running uninterrupted from interior living salons onto the open pool terrace.',
    dimension: 'DIRECT TIVOLI QUARRY',
    tag: 'MINERAL TACTILITY',
    image: '/images/travertine.jpg',
    aspect: 'LIVING SALON',
  },
  {
    number: '03',
    title: 'Bespoke American Walnut',
    detail: 'Custom architectural joinery, floating staircase treads, and monolithic pivot doors in warm black walnut.',
    dimension: 'CUSTOM MILLWORK',
    tag: 'WOOD JOINERY',
    image: '/images/walnut.jpg',
    aspect: 'STAIR & ATRIUM',
  },
  {
    number: '04',
    title: '24m Cantilevered Pool',
    detail: 'Heated saltwater infinity pool cantilevered over the cliffside with honed black basalt coping and underwater illumination.',
    dimension: '24M CANTILEVER',
    tag: 'AQUATIC ARCHITECTURE',
    image: '/images/pool.jpg',
    aspect: 'TERRACE HORIZON',
  },
  {
    number: '05',
    title: 'Mediterranean Grounds',
    detail: 'Drought-tolerant native flora, centenarian olive trees, and fragrant coastal flora terraced on local limestone.',
    dimension: '4,200 SQ M GROUNDS',
    tag: 'BOTANICAL CURATION',
    image: '/images/landscape.jpg',
    aspect: 'ESTATE GARDENS',
  },
  {
    number: '06',
    title: 'Integrated Lighting',
    detail: 'Concealed linear luminaires and dimmable circadian temperature systems calibrated to natural Mediterranean daylight.',
    dimension: 'CIRCADIAN CALIBRATION',
    tag: 'AMBIENT LUXURY',
    image: '/images/lighting.jpg',
    aspect: 'DUSK CHOREOGRAPHY',
  },
];

export default function Features() {
  const [activeModalImage, setActiveModalImage] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveModalImage(null);
    };
    if (activeModalImage) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeModalImage]);

  return (
    <section
      id="features"
      className="relative w-full py-20 sm:py-36 px-4 sm:px-12 bg-[#171716] border-t border-white/10 text-[#F3F0EA]"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-20 gap-4 sm:gap-6">
          <div>
            <div className="flex items-center gap-2.5 mb-2.5">
              <span className="font-mono text-[10px] sm:text-xs tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[#A38D70] font-medium">
                04 / DETAILS &amp; CRAFTSMANSHIP
              </span>
              <span className="w-6 sm:w-8 h-[1px] bg-[#A38D70]/40" />
            </div>
            <h2 className="font-serif text-2xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#F3F0EA]">
              Craft &amp; Specifications
            </h2>
          </div>
          <p className="font-sans text-xs sm:text-base text-[#C8BDAA]/70 max-w-md font-light leading-relaxed">
            Every material, joint, and surface has been custom-commissioned to establish a dialogue of permanence, quiet elegance, and tactile intimacy.
          </p>
        </div>

        {/* 6-Card Architectural Image & Spec Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {FEATURES.map((item) => (
            <div
              key={item.number}
              onClick={() => setActiveModalImage(item)}
              className="group cursor-pointer bg-white/[0.02] border border-white/10 hover:border-[#A38D70] transition-all duration-500 flex flex-col justify-between overflow-hidden"
            >
              {/* Image Frame */}
              <div className="relative aspect-[16/11] w-full overflow-hidden bg-black/40">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-[0.92] group-hover:brightness-100"
                  loading="lazy"
                />
                
                {/* Vignette Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#171716] via-transparent to-black/20 opacity-80 group-hover:opacity-60 transition-opacity duration-500" />

                {/* Top Badge Overlay */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <span className="font-mono text-[10px] tracking-[0.25em] uppercase px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/15 text-[#A38D70]">
                    {item.number} &bull; {item.tag}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase px-2 py-1 bg-black/60 backdrop-blur-md text-[#C8BDAA]/80 border border-white/10">
                    {item.aspect}
                  </span>
                </div>

                {/* Hover Quick-Inspect Prompt */}
                <div className="absolute bottom-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#F3F0EA] bg-[#A38D70]/80 px-2 py-0.5 backdrop-blur-sm">
                    VIEW STILL +
                  </span>
                </div>
              </div>

              {/* Text & Specs */}
              <div className="p-6 sm:p-7 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#A38D70]">
                      {item.dimension}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-2xl font-light text-[#F3F0EA] mb-3 group-hover:text-[#A38D70] transition-colors">
                    {item.title}
                  </h3>

                  <p className="font-sans text-xs sm:text-sm text-[#C8BDAA]/75 font-light leading-relaxed">
                    {item.detail}
                  </p>
                </div>

                <div className="mt-6 pt-4 flex items-center justify-between border-t border-white/5">
                  <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#C8BDAA]/50">
                    ARCHITECTURAL DETAIL
                  </span>
                  <span className="text-[#A38D70] font-mono text-sm transition-transform duration-300 group-hover:translate-x-1.5">
                    &rarr;
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal for High-Resolution Architectural Inspection */}
      {activeModalImage && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 md:p-8 animate-fadeIn"
          onClick={() => setActiveModalImage(null)}
        >
          <div
            className="relative max-w-3xl lg:max-w-4xl w-full max-h-[86vh] flex flex-col justify-between bg-[#171716] border border-white/20 p-4 sm:p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 gap-3 shrink-0">
              <div className="flex items-baseline gap-2.5 min-w-0">
                <span className="font-mono text-xs tracking-wider text-[#A38D70] shrink-0">
                  {activeModalImage.number}
                </span>
                <span className="font-serif text-lg sm:text-xl text-[#F3F0EA] tracking-wide truncate">
                  {activeModalImage.title}
                </span>
                <span className="text-[#C8BDAA]/40 hidden sm:inline">&bull;</span>
                <span className="font-mono text-[10px] text-[#C8BDAA]/70 uppercase hidden sm:inline shrink-0">
                  {activeModalImage.dimension}
                </span>
              </div>
              <button
                onClick={() => setActiveModalImage(null)}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-[#A38D70] border border-white/30 hover:border-[#A38D70] text-[#F3F0EA] hover:text-[#171716] font-mono text-[11px] tracking-wider uppercase transition-all cursor-pointer shadow-md font-medium"
              >
                <span>CLOSE</span>
                <span className="text-base font-serif leading-none">&times;</span>
              </button>
            </div>

            <div className="relative w-full max-h-[50vh] sm:max-h-[54vh] my-3 flex items-center justify-center overflow-hidden bg-black/60 border border-white/10 shrink-1">
              <img
                src={activeModalImage.image}
                alt={activeModalImage.title}
                className="w-full max-h-[50vh] sm:max-h-[54vh] object-contain sm:object-cover"
              />
            </div>

            <div className="flex items-center justify-between gap-4 pt-1 text-xs text-[#C8BDAA]/80 shrink-0">
              <p className="font-sans font-light truncate max-w-xl">
                {activeModalImage.detail}
              </p>
              <button
                onClick={() => setActiveModalImage(null)}
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
