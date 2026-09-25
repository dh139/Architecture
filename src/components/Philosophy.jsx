import React from 'react';

const PRINCIPLES = [
  {
    number: '01',
    concept: 'LIGHT',
    title: 'Ephemeral Radiance',
    description:
      'Natural daylight is treated as a primary structural element. Slotted clerestories and deep cantilevered overhangs choreograph shifting geometric shadows throughout the day.',
    image: '/images/lighting.jpg',
    caption: 'DUSK ILLUMINATION & APERTURE',
  },
  {
    number: '02',
    concept: 'MATERIAL',
    title: 'Textural Authenticity',
    description:
      'Roman vein-cut travertine, hand-planed American walnut, monolithic raw concrete, and low-iron architectural glass establish a tactile, grounded material dialogue.',
    image: '/images/walnut.jpg',
    caption: 'WALNUT JOINERY & TRAVERTINE',
  },
  {
    number: '03',
    concept: 'SPACE',
    title: 'Boundless Horizons',
    description:
      'Continuous interior floor planes flow uninterrupted onto expansive terraces. Oversized pocket doors dissolve the boundary between interior sanctuary and Mediterranean sky.',
    image: '/images/pool.jpg',
    caption: 'TERRACE & INFINITY HORIZON',
  },
];

export default function Philosophy() {
  return (
    <section
      id="philosophy"
      className="relative w-full py-20 sm:py-36 md:py-44 px-4 sm:px-12 bg-[#171716] text-[#F3F0EA] border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-24 gap-6 sm:gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#A38D70] font-medium">
                02 / ARCHITECTURAL PHILOSOPHY
              </span>
              <span className="w-6 sm:w-8 h-[1px] bg-[#A38D70]/40" />
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-7xl font-light tracking-tight text-[#F3F0EA] leading-none">
              Architectural Principles
            </h2>
          </div>
          <p className="font-sans text-xs sm:text-base text-[#C8BDAA]/80 max-w-md font-light leading-relaxed">
            Form is never arbitrary; it is the distilled expression of environmental context, coastal daylight, and quiet permanence.
          </p>
        </div>

        {/* 3-Column Architectural Editorial Grid with Images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 lg:gap-14">
          {PRINCIPLES.map((block) => (
            <div
              key={block.concept}
              className="group relative flex flex-col justify-between pt-8 border-t border-white/15 transition-all duration-500 hover:border-[#A38D70]"
            >
              <div>
                {/* Index & Subtitle */}
                <div className="flex items-baseline justify-between mb-6">
                  <span className="font-mono text-sm tracking-[0.3em] text-[#A38D70]">
                    {block.number}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#C8BDAA]/60 group-hover:text-[#F3F0EA] transition-colors">
                    {block.title}
                  </span>
                </div>

                {/* Principle Image Frame */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40 mb-6 border border-white/10 group-hover:border-white/20 transition-colors">
                  <img
                    src={block.image}
                    alt={block.title}
                    className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-[0.88] group-hover:brightness-100"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171716]/80 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-2.5 left-3">
                    <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#C8BDAA]/90 bg-black/60 px-2 py-0.5 backdrop-blur-sm border border-white/10">
                      {block.caption}
                    </span>
                  </div>
                </div>

                <h3 className="font-serif text-3xl sm:text-4xl font-light tracking-wide text-[#F3F0EA] mb-4 group-hover:text-[#A38D70] transition-colors">
                  {block.concept}
                </h3>

                <p className="font-sans text-sm sm:text-base text-[#C8BDAA]/80 leading-relaxed font-light">
                  {block.description}
                </p>
              </div>

              <div className="mt-10 pt-6 flex items-center justify-between border-t border-white/5">
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#C8BDAA]/40">
                  STUDIO ARCHI
                </span>
                <span className="w-5 h-[1px] bg-[#A38D70] transition-all duration-300 group-hover:w-10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
