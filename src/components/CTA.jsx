import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function CTA() {
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', timeframe: 'Immediate' });

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setModalOpen(false);
      }
    };
    if (modalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [modalOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setModalOpen(false);
      setForm({ name: '', email: '', phone: '', timeframe: 'Immediate' });
    }, 2800);
  };

  return (
    <section
      id="contact"
      className="relative w-full min-h-[85vh] sm:min-h-[90vh] py-24 sm:py-40 flex items-center justify-center bg-[#171716] text-[#F3F0EA] overflow-hidden"
    >
      {/* Background Video 4 (Terrace -> Aerial View) */}
      <video
        src="/videos/video4.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover filter brightness-[0.45] contrast-[1.1] pointer-events-none select-none"
      />

      {/* Atmospheric Shading */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(23,23,22,0.4) 0%, rgba(23,23,22,0.75) 60%, rgba(23,23,22,0.95) 100%)',
        }}
      />

      {/* Dramatic Editorial Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <span className="w-6 sm:w-8 h-[1px] bg-[#A38D70]" />
          <span className="font-mono text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.35em] uppercase text-[#A38D70] font-semibold">
            ACQUISITION INQUIRY
          </span>
          <span className="w-6 sm:w-8 h-[1px] bg-[#A38D70]" />
        </div>

        <h2 className="font-serif text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-[0.06em] sm:tracking-[0.08em] text-[#F3F0EA] uppercase leading-[1.1] sm:leading-[1.05] mb-4 sm:mb-6">
          YOUR NEXT ADDRESS
        </h2>

        <p className="font-serif italic text-lg sm:text-3xl text-[#C8BDAA] font-normal tracking-wide mb-8 sm:mb-12">
          Private Viewings Available
        </p>

        {/* Premium Architectural Action Button */}
        <button
          onClick={() => setModalOpen(true)}
          className="group relative inline-flex items-center justify-center px-8 sm:px-14 py-4 sm:py-5 border border-[#C8BDAA]/60 bg-transparent text-[#F3F0EA] overflow-hidden transition-all duration-500 hover:border-[#F3F0EA] focus:outline-none cursor-pointer"
        >
          {/* Button slide hover background */}
          <span className="absolute inset-0 w-full h-full bg-[#F3F0EA] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />

          {/* Button Text */}
          <span className="relative z-10 font-mono text-[11px] sm:text-sm tracking-[0.2em] sm:tracking-[0.25em] uppercase font-medium group-hover:text-[#171716] transition-colors duration-500">
            [ REQUEST A PRIVATE VIEWING ]
          </span>
        </button>

        <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.25em] uppercase text-[#C8BDAA]/60 mt-6 sm:mt-8">
          STRICT CONFIDENTIALITY MAINTAINED &bull; BY APPOINTMENT ONLY
        </span>
      </div>

      {/* Private Viewing Modal (Portal to body at z-[9999]) */}
      {modalOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
            onClick={() => setModalOpen(false)}
          >
            <div
              className="relative w-full max-w-lg bg-[#171716] border border-[#C8BDAA]/30 p-6 sm:p-10 text-[#F3F0EA] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 font-mono text-[10px] sm:text-xs tracking-widest text-[#C8BDAA] hover:text-[#FFFFFF] uppercase px-2 py-1 bg-white/5 border border-white/10"
              >
                [ CLOSE &times; ]
              </button>

              {submitted ? (
                <div className="py-8 sm:py-12 text-center flex flex-col items-center">
                  <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#A38D70] mb-3">
                    INQUIRY RECEIVED
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-light mb-4">
                    Thank You
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-[#C8BDAA] font-light max-w-sm">
                    Our private client advisory will contact you discreetly within 24 hours to coordinate your visit.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6 mt-4 sm:mt-0">
                  <div>
                    <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-[#A38D70]">
                      CONFIDENTIAL DOSSIER
                    </span>
                    <h3 className="font-serif text-xl sm:text-3xl font-light text-[#F3F0EA] mt-1">
                      Request Private Viewing
                    </h3>
                  </div>

                  <div className="flex flex-col gap-3 sm:gap-4">
                    <div>
                      <label className="block font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-[#C8BDAA] mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Lord / Lady / Mr / Ms..."
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full bg-white/[0.05] border border-white/15 px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-sans focus:outline-none focus:border-[#A38D70] text-[#F3F0EA]"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-[#C8BDAA] mb-1">
                        Direct Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="client@advisory.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full bg-white/[0.05] border border-white/15 px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-sans focus:outline-none focus:border-[#A38D70] text-[#F3F0EA]"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-[#C8BDAA] mb-1">
                        Direct Telephone
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+1 (555) 000-0000"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full bg-white/[0.05] border border-white/15 px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-sans focus:outline-none focus:border-[#A38D70] text-[#F3F0EA]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="mt-2 w-full py-3 sm:py-4 bg-[#A38D70] text-[#171716] font-mono text-[11px] sm:text-xs tracking-[0.25em] uppercase font-semibold hover:bg-[#F3F0EA] transition-colors"
                  >
                    TRANSMIT REQUEST
                  </button>
                </form>
              )}
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}
