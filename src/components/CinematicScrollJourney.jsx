import React, { useEffect, useRef, useState } from 'react';

const SCENES = [
  {
    id: 1,
    src: '/videos/video1.mp4',
    badge: '01 / ARCHITECTURAL APPROACH',
    heroLine1: 'EXPERIENCE',
    heroLine2: 'TIMELESS',
    heroLine3: 'LUXURY',
    subtitle: 'AURELIA RESIDENCE — MONOLITHIC HILLSIDE ESTATE',
  },
  {
    id: 2,
    src: '/videos/video2.mp4',
    badge: '02 / THE GRAND SALON',
    title: 'Spaces shaped by light and proportion.',
    quote: 'Open volumes and carefully framed views connect the interior with the surrounding landscape.',
  },
  {
    id: 3,
    src: '/videos/video3.mp4',
    badge: '03 / THE AZURE HORIZON',
    title: 'Where interior and landscape become one.',
    quote: 'Natural light is treated as an architectural material into the 24-meter cantilevered infinity pool.',
  },
  {
    id: 4,
    src: '/videos/video4.mp4',
    badge: '04 / AERIAL PERSPECTIVE',
    finaleLine1: 'EVERY STAY',
    finaleLine2: 'BECOMES A MEMORY',
    subtitle: 'PRIVATE MEDITERRANEAN ESTATE — CONFIDENTIAL DOSSIER',
  },
];

export default function CinematicScrollJourney({ onOpenInquiry, onOpenDossier }) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [scrollHintVisible, setScrollHintVisible] = useState(true);

  // Video refs
  const videoRefs = useRef([]);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const scrollTimeoutRef = useRef(null);
  const isUserScrollingRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // 6.4vh: Generous, balanced scroll distance for full 4-video flight and smooth dissolve
    const TOTAL_SCROLL_VH = 6.4;
    const vh = window.innerHeight;

    track.style.height = `${TOTAL_SCROLL_VH * vh}px`;

    // Initialize all 4 videos
    SCENES.forEach((sec, idx) => {
      const v = videoRefs.current[idx];
      if (!v) return;

      v.muted = true;
      v.playsInline = true;
      v.setAttribute('playsinline', '');
      v.setAttribute('webkit-playsinline', '');
      v.src = sec.src;
      v.load();
    });

    // Touch / gesture priming for instant GPU decode on all 4 videos
    const primeAll = () => {
      videoRefs.current.forEach((v) => {
        if (!v) return;
        try {
          const p = v.play();
          if (p && p.then) {
            p.then(() => {
              try {
                v.pause();
              } catch (e) {}
            }).catch(() => {});
          }
        } catch (e) {}
      });
    };
    window.addEventListener('pointerdown', primeAll, { once: true, passive: true });
    window.addEventListener('touchstart', primeAll, { once: true, passive: true });

    // Track scroll position
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const totalTrackH = TOTAL_SCROLL_VH * vh;
      const rawProg = Math.max(0, Math.min(1, scrollY / totalTrackH));
      targetProgressRef.current = rawProg;

      lastScrollYRef.current = scrollY;
      isUserScrollingRef.current = true;

      setScrollHintVisible(scrollY < 0.2 * vh);

      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        isUserScrollingRef.current = false;
        videoRefs.current.forEach((vid) => {
          if (vid && !vid.paused) vid.pause();
        });
      }, 140);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // 60FPS Hardware-Accelerated Animation Loop
    let rafId;
    const updateLoop = () => {
      const targetP = targetProgressRef.current;
      const currentP = currentProgressRef.current;

      // Silky smooth interpolation
      const lerpFactor = reduce ? 1 : 0.22;
      const nextP = currentP + (targetP - currentP) * lerpFactor;
      currentProgressRef.current = nextP;

      setOverallProgress(nextP);

      // Determine active scene
      let activeIdx = 0;
      if (nextP >= 0.66) activeIdx = 3;
      else if (nextP >= 0.44) activeIdx = 2;
      else if (nextP >= 0.22) activeIdx = 1;

      setActiveSceneIndex(activeIdx);

      // Smooth fade-out of the entire video flight when scrolling into the portfolio below
      if (stageRef.current) {
        if (nextP > 0.93) {
          const stageOp = Math.max(0, 1 - (nextP - 0.93) / 0.06);
          stageRef.current.style.opacity = stageOp;
          stageRef.current.style.pointerEvents = stageOp < 0.1 ? 'none' : 'auto';
        } else {
          stageRef.current.style.opacity = 1;
        }
      }

      // Process all 4 videos
      for (let i = 0; i < 4; i++) {
        const vid = videoRefs.current[i];
        if (!vid) continue;

        // Scene local progress (0 to 1)
        let localP = 0;
        if (i === 0) localP = Math.max(0, Math.min(1, nextP / 0.22));
        else if (i === 1) localP = Math.max(0, Math.min(1, (nextP - 0.22) / 0.22));
        else if (i === 2) localP = Math.max(0, Math.min(1, (nextP - 0.44) / 0.22));
        else if (i === 3) localP = Math.max(0, Math.min(1, (nextP - 0.66) / 0.25));

        // Seamless 4% crossfade window between scenes
        let opacity = 0;
        if (i === 0) {
          if (nextP < 0.20) opacity = 1;
          else if (nextP <= 0.24) opacity = 1 - (nextP - 0.20) / 0.04;
          else opacity = 0;
        } else if (i === 1) {
          if (nextP < 0.20) opacity = 0;
          else if (nextP < 0.24) opacity = (nextP - 0.20) / 0.04;
          else if (nextP <= 0.42) opacity = 1;
          else if (nextP <= 0.46) opacity = 1 - (nextP - 0.42) / 0.04;
          else opacity = 0;
        } else if (i === 2) {
          if (nextP < 0.42) opacity = 0;
          else if (nextP < 0.46) opacity = (nextP - 0.42) / 0.04;
          else if (nextP <= 0.64) opacity = 1;
          else if (nextP <= 0.68) opacity = 1 - (nextP - 0.64) / 0.04;
          else opacity = 0;
        } else if (i === 3) {
          // Scene 4: fades in at 0.64-0.68, plays full flight to 0.93, then smoothly dissolves
          if (nextP < 0.64) opacity = 0;
          else if (nextP < 0.68) opacity = (nextP - 0.64) / 0.04;
          else if (nextP <= 0.93) opacity = 1;
          else opacity = Math.max(0, 1 - (nextP - 0.93) / 0.06);
        }

        vid.style.opacity = opacity;

        // Hide inactive videos to free up GPU decoder pipelines
        if (opacity <= 0.001) {
          vid.style.visibility = 'hidden';
          if (!vid.paused) vid.pause();
          continue;
        }

        vid.style.visibility = 'visible';
        vid.style.zIndex = i === activeIdx ? '12' : String(10 + Math.round(opacity * 2));

        // Precision Playback & Scrubbing
        const dur = vid.duration || 8;
        const targetTime = Math.max(0, Math.min(dur - 0.06, localP * dur));
        const timeDiff = targetTime - vid.currentTime;

        // Forward scroll: hardware 60fps play
        if (isUserScrollingRef.current && (targetP >= currentP) && localP < 0.98) {
          if (vid.paused) {
            vid.play().catch(() => {});
          }
          if (timeDiff > 0.4) {
            vid.playbackRate = 1.4;
          } else if (timeDiff < -0.2) {
            vid.playbackRate = 0.85;
          } else {
            vid.playbackRate = 1.0;
          }
        } else {
          // Backward scroll, paused, or settled
          if (!vid.paused) {
            vid.pause();
          }
          if (!vid.seeking && Math.abs(timeDiff) > 0.035) {
            vid.currentTime = targetTime;
          }
        }
      }

      rafId = requestAnimationFrame(updateLoop);
    };

    rafId = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pointerdown', primeAll);
      window.removeEventListener('touchstart', primeAll);
      cancelAnimationFrame(rafId);
      clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  return (
    <section ref={containerRef} className="relative w-full bg-[#171716] text-[#F3F0EA] select-none">
      {/* FULLSCREEN FIXED STAGE: Dissolves seamlessly into portfolio below when flight finishes */}
      <div
        ref={stageRef}
        className="fixed inset-0 w-screen h-screen z-10 overflow-hidden bg-[#171716] transition-opacity duration-300"
      >
        {/* Videos Container */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          {SCENES.map((sec, i) => (
            <video
              key={sec.id}
              ref={(el) => (videoRefs.current[i] = el)}
              src={sec.src}
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none will-change-transform filter brightness-[0.88] contrast-[1.05]"
              style={{ opacity: i === 0 ? 1 : 0, zIndex: i === 0 ? 12 : 10 }}
            />
          ))}

          {/* Subtle cinematic vignette */}
          <div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(23,23,22,0.1) 0%, rgba(23,23,22,0.45) 75%, rgba(23,23,22,0.85) 100%)',
            }}
          />

          {/* Delicate bottom gradient for subtitle readability */}
          <div
            className="absolute inset-x-0 bottom-0 h-44 pointer-events-none z-20"
            style={{
              background:
                'linear-gradient(to top, rgba(23,23,22,0.85) 0%, rgba(23,23,22,0.25) 50%, transparent 100%)',
            }}
          />
        </div>

        {/* DYNAMIC SCENE TEXT OVERLAYS */}
        <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between p-6 sm:p-12">
          <div className="w-full h-16" />

          {/* SCENE 1 HERO CENTER OVERLAY: "EXPERIENCE TIMELESS LUXURY" */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 transition-all duration-700 pointer-events-none ${
              activeSceneIndex === 0 && overallProgress < 0.18
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-95 -translate-y-6 pointer-events-none'
            }`}
          >
            <span className="font-mono text-[10px] sm:text-sm tracking-[0.3em] sm:tracking-[0.35em] uppercase text-[#A38D70] mb-3 sm:mb-4">
              AURELIA RESIDENCE
            </span>
            <h1 className="font-serif text-3xl sm:text-6xl md:text-8xl lg:text-9xl font-light tracking-[0.1em] sm:tracking-[0.14em] uppercase text-[#F3F0EA] leading-[1.02] drop-shadow-2xl">
              EXPERIENCE
              <br />
              <span className="font-extralight tracking-[0.16em] sm:tracking-[0.24em] text-[#C8BDAA] block mt-1">
                TIMELESS
              </span>
              <span className="tracking-[0.12em] sm:tracking-[0.18em] block mt-1">LUXURY</span>
            </h1>
            <p className="font-serif italic text-sm sm:text-2xl text-[#C8BDAA]/90 font-light mt-4 sm:mt-6 tracking-wide">
              A Private Expression of Modern Living
            </p>
          </div>

          {/* SCENE 2 LEFT OVERLAY: "02 / THE GRAND SALON" */}
          <div
            className={`absolute left-4 sm:left-14 right-4 sm:right-auto bottom-16 sm:bottom-28 max-w-xs sm:max-w-lg transition-all duration-700 pointer-events-none ${
              activeSceneIndex === 1
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            <span className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#A38D70] font-medium block mb-1.5">
              02 / THE GRAND SALON
            </span>
            <h2 className="font-serif text-2xl sm:text-5xl md:text-6xl font-light text-[#F3F0EA] tracking-wide leading-tight mb-2 sm:mb-3 drop-shadow-lg">
              Spaces shaped by light and proportion.
            </h2>
            <p className="font-serif italic text-xs sm:text-xl text-[#C8BDAA] font-light leading-relaxed">
              &ldquo;Open volumes and carefully framed views connect the interior with the surrounding landscape.&rdquo;
            </p>
          </div>

          {/* SCENE 3 LEFT OVERLAY: "03 / THE AZURE HORIZON" */}
          <div
            className={`absolute left-4 sm:left-14 right-4 sm:right-auto bottom-16 sm:bottom-28 max-w-xs sm:max-w-lg transition-all duration-700 pointer-events-none ${
              activeSceneIndex === 2
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            <span className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#A38D70] font-medium block mb-1.5">
              03 / THE AZURE HORIZON
            </span>
            <h2 className="font-serif text-2xl sm:text-5xl md:text-6xl font-light text-[#F3F0EA] tracking-wide leading-tight mb-2 sm:mb-3 drop-shadow-lg">
              Where interior and landscape become one.
            </h2>
            <p className="font-serif italic text-xs sm:text-xl text-[#C8BDAA] font-light leading-relaxed">
              &ldquo;Natural light is treated as an architectural material into the 24-meter cantilevered infinity pool.&rdquo;
            </p>
          </div>

          {/* SCENE 4 FINALE CENTER OVERLAY: "EVERY STAY BECOMES A MEMORY" */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 transition-all duration-700 ${
              activeSceneIndex === 3 && overallProgress >= 0.7 && overallProgress <= 0.94
                ? 'opacity-100 scale-100 pointer-events-auto'
                : 'opacity-0 scale-95 translate-y-6 pointer-events-none'
            }`}
          >
            <span className="font-mono text-[10px] sm:text-sm tracking-[0.3em] sm:tracking-[0.35em] uppercase text-[#A38D70] mb-3 sm:mb-4">
              04 / AERIAL PERSPECTIVE
            </span>
            <h2 className="font-serif text-3xl sm:text-6xl md:text-8xl font-light tracking-[0.1em] sm:tracking-[0.14em] uppercase text-[#F3F0EA] leading-[1.08] drop-shadow-2xl mb-6 sm:mb-8">
              EVERY STAY
              <br />
              <span className="font-extralight text-[#C8BDAA] tracking-[0.16em] sm:tracking-[0.2em] block mt-1">
                BECOMES A MEMORY
              </span>
            </h2>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto px-4 pointer-events-auto">
              <button
                onClick={() => {
                  if (onOpenInquiry) onOpenInquiry();
                }}
                className="w-full sm:w-auto font-mono text-[11px] sm:text-sm tracking-[0.2em] sm:tracking-[0.25em] uppercase px-6 sm:px-12 py-3.5 sm:py-5 bg-[#A38D70] text-[#171716] font-semibold hover:bg-[#F3F0EA] transition-all cursor-pointer shadow-2xl"
              >
                REQUEST VIEWING
              </button>

              <button
                onClick={() => {
                  if (onOpenDossier) onOpenDossier();
                  else {
                    const el = document.getElementById('details');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full sm:w-auto font-mono text-[11px] sm:text-sm tracking-[0.2em] uppercase px-6 sm:px-10 py-3.5 sm:py-5 border border-white/30 text-[#F3F0EA] hover:border-[#FFFFFF] hover:bg-white/5 transition-all cursor-pointer backdrop-blur-sm"
              >
                EXPLORE DOSSIER &darr;
              </button>
            </div>
          </div>

          {/* BOTTOM BAR: SCENE BADGE ON LEFT, SCROLL CUE ON RIGHT */}
          <div className="w-full flex items-end justify-between pointer-events-none pb-2 sm:pb-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#A38D70]" />
              <span className="font-mono text-[9px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.25em] text-[#C8BDAA]/80 uppercase">
                {SCENES[activeSceneIndex].badge}
              </span>
            </div>

            {/* Mobile Scroll Indicator (Right aligned) */}
            <div
              className={`sm:hidden flex items-center gap-1 font-mono text-[8px] tracking-wider text-[#A38D70] transition-opacity duration-500 ${
                scrollHintVisible ? 'opacity-85' : 'opacity-0'
              }`}
            >
              <span>SCROLL</span>
              <span className="animate-bounce">&darr;</span>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP CENTERED SCROLL CUE */}
      <div
        className={`hidden sm:flex fixed bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex-col items-center gap-2 transition-opacity duration-500 ${
          scrollHintVisible ? 'opacity-85' : 'opacity-0'
        }`}
      >
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#C8BDAA]">
          SCROLL TO EXPLORE
        </span>
        <div className="w-[1px] h-6 bg-gradient-to-b from-[#A38D70] to-transparent animate-pulse" />
      </div>

      {/* TALL SCROLL TRACK SPACER */}
      <div ref={trackRef} className="relative z-0 w-full pointer-events-none" />
    </section>
  );
}
