import React from 'react';

const STATS = [
  { value: '02', label: 'LEVELS', detail: 'Cascading hillside architecture' },
  { value: '850', label: 'SQ M', detail: 'Conditioned interior living space' },
  { value: '04', label: 'BEDROOMS', detail: 'Private en-suite oceanview suites' },
  { value: '01', label: 'INFINITY POOL', detail: '24m cantilevered perimeter' },
];

export default function ProjectStats() {
  return (
    <section className="relative w-full py-20 sm:py-36 px-4 sm:px-12 bg-[#171716] border-t border-white/10 text-[#F3F0EA]">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-10 sm:mb-16 pb-3 sm:pb-4 border-b border-white/10">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="font-mono text-[10px] sm:text-xs tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[#A38D70] font-medium">
              03 / DIMENSIONS
            </span>
            <span className="text-[#C8BDAA]/40">&bull;</span>
            <span className="font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#C8BDAA]">
              ESTATE SPECIFICATIONS
            </span>
          </div>
          <span className="font-serif italic text-xs sm:text-sm text-[#C8BDAA]/60 hidden sm:inline">
            Architectural Dossier &bull; Vol. I
          </span>
        </div>

        {/* 4 Statistics Columns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 lg:gap-8 mb-12 sm:mb-24">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col justify-between pt-4 sm:pt-6 border-t border-white/15 hover:border-[#A38D70] transition-colors duration-400 group"
            >
              <div>
                <div className="font-serif text-4xl sm:text-7xl lg:text-8xl font-light tracking-tight text-[#F3F0EA] leading-none mb-2 sm:mb-4 group-hover:text-[#A38D70] transition-colors">
                  {stat.value}
                </div>
                <div className="font-mono text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] uppercase text-[#A38D70] font-medium mb-1 sm:mb-2">
                  {stat.label}
                </div>
              </div>
              <p className="font-sans text-[11px] sm:text-sm text-[#C8BDAA]/70 font-light leading-relaxed pt-2 sm:pt-3 border-t border-white/5 mt-2 sm:mt-4">
                {stat.detail}
              </p>
            </div>
          ))}
        </div>

        {/* Panoramic Architectural Elevation Plate */}
        <div className="relative w-full border border-white/10 overflow-hidden bg-black/40 group">
          <div className="relative aspect-[16/10] sm:aspect-[24/9] w-full overflow-hidden">
            <img
              src="/images/aerial.jpg"
              alt="Aurelia Residence Panoramic Coastal Elevation"
              className="w-full h-full object-cover object-center transform transition-transform duration-1000 ease-out group-hover:scale-105 filter brightness-[0.88] group-hover:brightness-95"
              loading="lazy"
            />
            {/* Subtle Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#171716] via-transparent to-black/30" />

            {/* Architectural Blueprint HUD Overlay */}
            <div className="absolute top-3 left-3 sm:top-6 sm:left-6 flex items-center gap-2 sm:gap-3">
              <span className="font-mono text-[8px] sm:text-[10px] tracking-[0.25em] sm:tracking-[0.3em] uppercase px-2 py-0.5 sm:px-3 sm:py-1 bg-black/75 backdrop-blur-md border border-white/15 text-[#A38D70]">
                CLIFF ELEVATION
              </span>
              <span className="hidden sm:inline font-mono text-[9px] tracking-[0.2em] uppercase text-[#C8BDAA]/70 bg-black/50 px-2.5 py-1 backdrop-blur-sm border border-white/10">
                ALTITUDE: 240M ASL
              </span>
            </div>

            <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4">
              <div>
                <span className="font-mono text-[8px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.25em] text-[#A38D70] uppercase block mb-0.5 sm:mb-1">
                  PLATE 04 &bull; INTEGRATED CLIFFSIDE GEOMETRY
                </span>
                <h3 className="font-serif text-base sm:text-2xl md:text-3xl font-light text-[#F3F0EA] leading-tight">
                  Harmonized with the Mediterranean Horizon
                </h3>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 font-mono text-[8px] sm:text-[10px] text-[#C8BDAA]/60">
                <span>LAT 43°42&apos;N</span>
                <span>LON 7°18&apos;E</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
