import React from 'react';

export default function Navbar({ onOpenInquiry }) {
  const scrollToContact = () => {
    if (onOpenInquiry) {
      onOpenInquiry();
    } else {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-40 px-4 sm:px-12 py-3.5 sm:py-6 bg-gradient-to-b from-[#171716]/95 via-[#171716]/40 to-transparent text-[#F3F0EA]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 sm:gap-3 text-left focus:outline-none cursor-pointer group"
        >
          <span className="font-serif text-base sm:text-2xl font-light tracking-[0.2em] sm:tracking-[0.25em] uppercase text-[#F3F0EA]">
            AURELIA
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#A38D70]" />
          <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.25em] text-[#C8BDAA] uppercase">
            RESIDENCE
          </span>
        </button>

        {/* Minimalist Inquire Action */}
        <button
          onClick={scrollToContact}
          className="font-mono text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] uppercase px-3.5 sm:px-5 py-2 sm:py-2.5 bg-[#A38D70] text-[#171716] font-semibold border border-[#A38D70] hover:bg-[#F3F0EA] hover:border-[#F3F0EA] transition-all cursor-pointer shadow-lg"
        >
          INQUIRE
        </button>
      </div>
    </nav>
  );
}
