import React from 'react';

export default function Footer() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative w-full py-14 sm:py-24 px-4 sm:px-12 bg-[#171716] text-[#F3F0EA] border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-10 sm:gap-12">
        {/* Brand */}
        <div>
          <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-[#A38D70] block mb-2">
            PRIVATE COMMISSION
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-light tracking-[0.18em] sm:tracking-[0.2em] uppercase text-[#F3F0EA]">
            AURELIA
            <br />
            <span className="font-extralight text-lg sm:text-2xl text-[#C8BDAA] tracking-[0.25em] sm:tracking-[0.3em]">
              RESIDENCE
            </span>
          </h2>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-10 font-mono text-[11px] sm:text-xs tracking-[0.18em] sm:tracking-[0.2em] uppercase">
          <div className="flex flex-col gap-2.5 sm:gap-3">
            <span className="text-[#A38D70] text-[9px] sm:text-[10px]">DISCIPLINES</span>
            <button
              onClick={() => scrollTo('philosophy')}
              className="text-[#C8BDAA] hover:text-[#FFFFFF] text-left transition-colors"
            >
              Architecture
            </button>
            <button
              onClick={() => scrollTo('features')}
              className="text-[#C8BDAA] hover:text-[#FFFFFF] text-left transition-colors"
            >
              Interiors
            </button>
            <button
              onClick={() => scrollTo('features')}
              className="text-[#C8BDAA] hover:text-[#FFFFFF] text-left transition-colors"
            >
              Landscape
            </button>
          </div>

          <div className="flex flex-col gap-2.5 sm:gap-3">
            <span className="text-[#A38D70] text-[9px] sm:text-[10px]">INQUIRIES</span>
            <button
              onClick={() => scrollTo('contact')}
              className="text-[#C8BDAA] hover:text-[#FFFFFF] text-left transition-colors"
            >
              Contact
            </button>
            <a
              href="#privacy"
              onClick={(e) => {
                e.preventDefault();
                alert('Aurelia Residence operates under strict non-disclosure covenants.');
              }}
              className="text-[#C8BDAA] hover:text-[#FFFFFF] transition-colors"
            >
              Privacy
            </a>
            <button
              onClick={() => scrollTo('hero')}
              className="text-[#A38D70] hover:text-[#FFFFFF] text-left transition-colors"
            >
              Back to Top &uarr;
            </button>
          </div>

          <div className="flex flex-col gap-2.5 sm:gap-3 col-span-2 sm:col-span-1">
            <span className="text-[#A38D70] text-[9px] sm:text-[10px]">LOCATION</span>
            <span className="text-[#C8BDAA] text-[10px] sm:text-[11px] leading-relaxed">
              French Riviera / Ligurian Coast
            </span>
            <span className="text-[#77736B] text-[9px] sm:text-[10px]">
              CONFIDENTIAL ELEVATION
            </span>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto pt-8 sm:pt-12 mt-8 sm:mt-12 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-center sm:text-left">
        <span className="font-mono text-[10px] sm:text-[11px] tracking-wider text-[#77736B]">
          &copy; 2026 Aurelia Residence. All rights reserved.
        </span>
        <span className="font-mono text-[9px] sm:text-[10px] tracking-widest uppercase text-[#A38D70]">
          STUDIO ARCHI &bull; BESPOKE ESTATE MASTERPIECE
        </span>
      </div>
    </footer>
  );
}
