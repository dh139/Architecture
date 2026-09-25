import React, { useState } from 'react';

export default function DossierDrawer({ isOpen, onClose, initialTab = 'specs', onOpenInquiry }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md transition-all duration-500 animate-fadeIn">
      {/* Backdrop Click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-full sm:max-w-2xl h-full bg-[#171716] border-l border-white/10 p-5 sm:p-10 overflow-y-auto text-[#F3F0EA] flex flex-col justify-between shadow-2xl">
        <div>
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-4 sm:pb-6 mb-6 sm:mb-8 border-b border-white/10 gap-3">
            <div>
              <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[#A38D70]">
                CONFIDENTIAL ARCHITECTURAL DOSSIER
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#F3F0EA] tracking-wide mt-1">
                Aurelia Residence
              </h2>
            </div>
            <button
              onClick={onClose}
              className="font-mono text-[11px] sm:text-xs tracking-wider uppercase px-2.5 sm:px-3 py-1.5 border border-white/20 hover:border-white text-[#C8BDAA] hover:text-white transition-colors cursor-pointer shrink-0"
            >
              [ CLOSE &times; ]
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-6 mb-8 pb-3 border-b border-white/5 font-mono text-xs tracking-wider uppercase">
            {[
              { id: 'specs', label: 'SPECIFICATIONS' },
              { id: 'philosophy', label: 'PHILOSOPHY' },
              { id: 'location', label: 'LOCATION' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`transition-colors cursor-pointer relative pb-1 ${
                  activeTab === tab.id
                    ? 'text-[#F3F0EA] font-semibold'
                    : 'text-[#C8BDAA]/50 hover:text-[#F3F0EA]'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#A38D70]" />
                )}
              </button>
            ))}
          </div>

          {/* Tab 1: Specifications */}
          {activeTab === 'specs' && (
            <div className="flex flex-col gap-6">
              <div className="relative aspect-[16/9] w-full overflow-hidden border border-white/10">
                <img
                  src="/images/facade.jpg"
                  alt="Aurelia Residence Exterior"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-3 font-mono text-[9px] tracking-widest text-[#F3F0EA] bg-black/60 px-2 py-0.5 backdrop-blur-sm">
                  PLATE 01 &bull; EXTERIOR ARCHITECTURE
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-5 bg-white/[0.02] border border-white/10">
                <div>
                  <span className="font-mono text-[10px] tracking-widest text-[#A38D70] uppercase">
                    CONDITIONED AREA
                  </span>
                  <div className="font-serif text-2xl sm:text-3xl text-[#F3F0EA] mt-1">850 SQ M</div>
                </div>
                <div>
                  <span className="font-mono text-[10px] tracking-widest text-[#A38D70] uppercase">
                    TOTAL GROUNDS
                  </span>
                  <div className="font-serif text-2xl sm:text-3xl text-[#F3F0EA] mt-1">4,200 SQ M</div>
                </div>
                <div>
                  <span className="font-mono text-[10px] tracking-widest text-[#A38D70] uppercase">
                    SUITES
                  </span>
                  <div className="font-serif text-2xl sm:text-3xl text-[#F3F0EA] mt-1">4 EN-SUITE</div>
                </div>
                <div>
                  <span className="font-mono text-[10px] tracking-widest text-[#A38D70] uppercase">
                    INFINITY POOL
                  </span>
                  <div className="font-serif text-2xl sm:text-3xl text-[#F3F0EA] mt-1">24 METERS</div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="font-serif text-xl font-light text-[#F3F0EA]">
                  Craft &amp; Systems
                </h3>
                <p className="font-sans text-sm text-[#C8BDAA]/80 font-light leading-relaxed">
                  Engineered with motorized floor-to-ceiling acoustic glazing that slides flush into wall cavities, creating complete indoor-outdoor continuity. Finished in hand-selected Roman vein-cut travertine and custom American black walnut joinery.
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: Philosophy */}
          {activeTab === 'philosophy' && (
            <div className="flex flex-col gap-6">
              <div className="relative aspect-[16/9] w-full overflow-hidden border border-white/10">
                <img
                  src="/images/travertine.jpg"
                  alt="Aurelia Residence Living Salon"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-3 font-mono text-[9px] tracking-widest text-[#F3F0EA] bg-black/60 px-2 py-0.5 backdrop-blur-sm">
                  PLATE 02 &bull; THE GRAND SALON &bull; TRAVERTINE &amp; WALNUT
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="border-l border-[#A38D70] pl-4">
                  <h4 className="font-serif text-xl font-light text-[#F3F0EA] mb-1">LIGHT</h4>
                  <p className="font-sans text-xs sm:text-sm text-[#C8BDAA]/80 font-light leading-relaxed">
                    Natural daylight is choreographed through deep overhangs and slotted clerestories, transforming textures throughout the day.
                  </p>
                </div>
                <div className="border-l border-[#A38D70] pl-4">
                  <h4 className="font-serif text-xl font-light text-[#F3F0EA] mb-1">MATERIAL</h4>
                  <p className="font-sans text-xs sm:text-sm text-[#C8BDAA]/80 font-light leading-relaxed">
                    Unadorned travertine, walnut, concrete, and glass age gracefully and root the architecture in Mediterranean geology.
                  </p>
                </div>
                <div className="border-l border-[#A38D70] pl-4">
                  <h4 className="font-serif text-xl font-light text-[#F3F0EA] mb-1">SPACE</h4>
                  <p className="font-sans text-xs sm:text-sm text-[#C8BDAA]/80 font-light leading-relaxed">
                    Boundless floor planes dissolve the threshold between private living chambers and the open horizon.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Location */}
          {activeTab === 'location' && (
            <div className="flex flex-col gap-6">
              <div className="relative aspect-[16/9] w-full overflow-hidden border border-white/10">
                <img
                  src="/images/aerial.jpg"
                  alt="Aurelia Residence Aerial Promontory"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-3 font-mono text-[9px] tracking-widest text-[#F3F0EA] bg-black/60 px-2 py-0.5 backdrop-blur-sm">
                  PLATE 03 &bull; COASTAL CLIFFSIDE PROMONTORY
                </div>
              </div>

              <div className="p-5 bg-white/[0.02] border border-white/10 flex flex-col gap-3 font-mono text-xs">
                <div className="flex justify-between pb-2 border-b border-white/10">
                  <span className="text-[#A38D70]">WATERFRONT &amp; MARINA</span>
                  <span className="text-[#F3F0EA]">08 MIN</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-white/10">
                  <span className="text-[#A38D70]">HISTORIC CITY CENTER</span>
                  <span className="text-[#F3F0EA]">15 MIN</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A38D70]">INTERNATIONAL AIRPORT</span>
                  <span className="text-[#F3F0EA]">20 MIN</span>
                </div>
              </div>
              <p className="font-sans text-xs sm:text-sm text-[#C8BDAA]/80 font-light leading-relaxed">
                Positioned securely on an elevated hillside promontory at 240 meters above sea level, providing complete privacy with immediate access to private aviation and coastal marinas.
              </p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-6 mt-6 border-t border-white/10">
          <button
            onClick={() => {
              onClose();
              if (onOpenInquiry) onOpenInquiry();
            }}
            className="w-full py-4 bg-[#A38D70] text-[#171716] font-mono text-xs tracking-[0.25em] uppercase font-semibold hover:bg-[#F3F0EA] transition-all cursor-pointer shadow-lg"
          >
            REQUEST CONFIDENTIAL VIEWING
          </button>
        </div>
      </div>
    </div>
  );
}
