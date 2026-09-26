import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
  const stageRef = useRef(null);
  const trackRef = useRef(null);
  const videoRefs = useRef([]);

  // Active scene index for UI highlights (only updated when scene boundary crosses)
  const [activeScene, setActiveScene] = useState(0);
  const [scrollHint, setScrollHint] = useState(true);

  // Overlay refs for hardware-accelerated transforms
  const heroRef = useRef(null);
  const scene2Ref = useRef(null);
  const scene3Ref = useRef(null);
  const scene4Ref = useRef(null);
  const badgeRef = useRef(null);

  // Scroll and video coordination refs
  const progressRef = useRef(0);
  const targetTimesRef = useRef([0, 0, 0, 0]);
  const lastProgressRef = useRef(0);

  const videoMeta = useRef([
    { duration: 8, isReady: false, isSeeking: false },
    { duration: 8, isReady: false, isSeeking: false },
    { duration: 8, isReady: false, isSeeking: false },
    { duration: 8, isReady: false, isSeeking: false },
  ]);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;

    // Set generous scroll track height (600vh) without layout jumping
    const TRACK_VH = 6.0;
    track.style.height = `${TRACK_VH * 100}vh`;

    // 1. Initialize all 4 videos
    videoRefs.current.forEach((vid, idx) => {
      if (!vid) return;

      vid.muted = true;
      vid.playsInline = true;
      vid.setAttribute('playsinline', '');
      vid.setAttribute('webkit-playsinline', '');

      const onMeta = () => {
        if (vid.duration && !isNaN(vid.duration)) {
          videoMeta.current[idx].duration = vid.duration;
          videoMeta.current[idx].isReady = true;
        }
      };

      const onSeeking = () => {
        videoMeta.current[idx].isSeeking = true;
      };

      const onSeeked = () => {
        videoMeta.current[idx].isSeeking = false;
        const target = targetTimesRef.current[idx];
        if (Math.abs(target - vid.currentTime) > 0.02 && !vid.seeking) {
          vid.currentTime = target;
        }
      };

      vid.addEventListener('loadedmetadata', onMeta);
      vid.addEventListener('seeking', onSeeking);
      vid.addEventListener('seeked', onSeeked);

      if (vid.readyState >= 1 && vid.duration) {
        onMeta();
      }
    });

    // 2. Gesture priming for mobile GPU decoders
    const primeVideos = () => {
      videoRefs.current.forEach((vid) => {
        if (vid && vid.paused) {
          try {
            const p = vid.play();
            if (p && p.then) {
              p.then(() => vid.pause()).catch(() => {});
            }
          } catch (e) {}
        }
      });
    };
    window.addEventListener('pointerdown', primeVideos, { once: true, passive: true });
    window.addEventListener('touchstart', primeVideos, { once: true, passive: true });

    // 3. GSAP ScrollTrigger with scrub: 0.4 for silky physics-based momentum
    let lastSceneIdx = 0;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: track,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4, // Requirement 10: scrub 0.3-0.5
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          progressRef.current = self.progress;

          // Update scroll cue visibility
          if (self.progress > 0.03 && scrollHint) {
            setScrollHint(false);
          } else if (self.progress <= 0.03 && !scrollHint) {
            setScrollHint(true);
          }
        },
      });
    }, containerRef);

    // 4. 60FPS requestAnimationFrame update loop
    let rafId;
    const updateLoop = () => {
      const p = progressRef.current;
      const isForward = p >= lastProgressRef.current;
      lastProgressRef.current = p;

      // Determine active scene (only trigger React state when boundary crossed!)
      let activeIdx = 0;
      if (p >= 0.74) activeIdx = 3;
      else if (p >= 0.49) activeIdx = 2;
      else if (p >= 0.24) activeIdx = 1;

      if (activeIdx !== lastSceneIdx) {
        lastSceneIdx = activeIdx;
        setActiveScene(activeIdx);
        if (badgeRef.current) {
          badgeRef.current.textContent = SCENES[activeIdx].badge;
        }
      }

      // --- ZERO-DIP LAYERED CROSSFADES ---
      // Video 0: base layer (zIndex 10)
      // Video 1: zIndex 11 (fades in 0.19 -> 0.24 over Video 0, stays until 0.49)
      // Video 2: zIndex 12 (fades in 0.44 -> 0.49 over Video 1, stays until 0.74)
      // Video 3: zIndex 13 (fades in 0.69 -> 0.74 over Video 2, stays until 0.94, exit fade to 1.0)

      let op0 = 0;
      if (p <= 0.24) op0 = 1;
      else op0 = 0;

      let op1 = 0;
      if (p < 0.19) op1 = 0;
      else if (p <= 0.24) op1 = (p - 0.19) / 0.05;
      else if (p <= 0.49) op1 = 1;
      else op1 = 0;

      let op2 = 0;
      if (p < 0.44) op2 = 0;
      else if (p <= 0.49) op2 = (p - 0.44) / 0.05;
      else if (p <= 0.74) op2 = 1;
      else op2 = 0;

      let op3 = 0;
      if (p < 0.69) op3 = 0;
      else if (p <= 0.74) op3 = (p - 0.69) / 0.05;
      else if (p <= 0.94) op3 = 1;
      else op3 = Math.max(0, 1 - (p - 0.94) / 0.06);

      const opacities = [op0, op1, op2, op3];

      // Local progress for each video
      const localP0 = Math.min(1, Math.max(0, p / 0.24));
      const localP1 = Math.min(1, Math.max(0, (p - 0.19) / 0.28));
      const localP2 = Math.min(1, Math.max(0, (p - 0.44) / 0.28));
      const localP3 = Math.min(1, Math.max(0, (p - 0.69) / 0.24));
      const localProgress = [localP0, localP1, localP2, localP3];

      // Preload next video before current ends (Requirement 7)
      const shouldWarm = [
        p <= 0.30,              // Video 0 kept warm for reverse
        p >= 0.12 && p <= 0.55, // Video 1 preloaded at 0.12
        p >= 0.37 && p <= 0.80, // Video 2 preloaded at 0.37
        p >= 0.62,              // Video 3 preloaded at 0.62
      ];

      // Video playback & seeking control
      for (let i = 0; i < 4; i++) {
        const vid = videoRefs.current[i];
        const meta = videoMeta.current[i];
        if (!vid) continue;

        const op = opacities[i];
        const isWarm = shouldWarm[i];

        vid.style.opacity = op;
        vid.style.zIndex = String(10 + i);

        if (op <= 0.001 && !isWarm) {
          if (!vid.paused) vid.pause();
          continue;
        }

        const dur = meta.duration || 8;
        const targetTime = Math.max(0, Math.min(dur - 0.05, localProgress[i] * dur));
        targetTimesRef.current[i] = targetTime;
        const timeDiff = Math.abs(targetTime - vid.currentTime);

        // Keep video paused — pure 60fps scroll scrubbing without play/pause stutter
        if (!vid.paused) {
          vid.pause();
        }

        // Only seek if video is currently visible or warming up
        if (op > 0.001 || isWarm) {
          if (meta.isSeeking && !vid.seeking) {
            meta.isSeeking = false;
          }
          // Seek threshold: 0.02s (~1 frame at 60fps)
          if (!meta.isSeeking && timeDiff > 0.02) {
            meta.isSeeking = true;
            vid.currentTime = targetTime;
          }
        }
      }

      // --- TEXT OVERLAYS HARDWARE ACCELERATION ---
      // Scene 1 Hero
      if (heroRef.current) {
        if (p <= 0.12) {
          heroRef.current.style.opacity = 1;
          heroRef.current.style.transform = 'translateY(0px)';
        } else if (p < 0.18) {
          const t = (p - 0.12) / 0.06;
          heroRef.current.style.opacity = 1 - t;
          heroRef.current.style.transform = `translateY(-${t * 24}px)`;
        } else {
          heroRef.current.style.opacity = 0;
        }
      }

      // Scene 2 Left Card (Grand Salon)
      if (scene2Ref.current) {
        if (p >= 0.24 && p <= 0.43) {
          let s2Op = 1;
          if (p < 0.28) s2Op = (p - 0.24) / 0.04;
          else if (p > 0.39) s2Op = 1 - (p - 0.39) / 0.04;
          scene2Ref.current.style.opacity = s2Op;
          scene2Ref.current.style.transform = `translateY(${(1 - s2Op) * 16}px)`;
        } else {
          scene2Ref.current.style.opacity = 0;
        }
      }

      // Scene 3 Left Card (Azure Horizon)
      if (scene3Ref.current) {
        if (p >= 0.49 && p <= 0.68) {
          let s3Op = 1;
          if (p < 0.53) s3Op = (p - 0.49) / 0.04;
          else if (p > 0.64) s3Op = 1 - (p - 0.64) / 0.04;
          scene3Ref.current.style.opacity = s3Op;
          scene3Ref.current.style.transform = `translateY(${(1 - s3Op) * 16}px)`;
        } else {
          scene3Ref.current.style.opacity = 0;
        }
      }

      // Scene 4 Finale
      if (scene4Ref.current) {
        if (p >= 0.74 && p <= 0.94) {
          let s4Op = 1;
          if (p < 0.79) s4Op = (p - 0.74) / 0.05;
          scene4Ref.current.style.opacity = s4Op;
          scene4Ref.current.style.transform = `translateY(${(1 - s4Op) * 20}px)`;
          scene4Ref.current.style.pointerEvents = s4Op >= 0.5 ? 'auto' : 'none';
        } else {
          scene4Ref.current.style.opacity = 0;
          scene4Ref.current.style.pointerEvents = 'none';
        }
      }

      // Entire Stage Dissolve into Portfolio Below
      if (stageRef.current) {
        if (p > 0.93) {
          const stageOp = Math.max(0, 1 - (p - 0.93) / 0.06);
          stageRef.current.style.opacity = stageOp;
          stageRef.current.style.pointerEvents = stageOp < 0.1 ? 'none' : 'auto';
        } else {
          stageRef.current.style.opacity = 1;
          stageRef.current.style.pointerEvents = 'auto';
        }
      }

      rafId = requestAnimationFrame(updateLoop);
    };

    rafId = requestAnimationFrame(updateLoop);

    // 5. Cleanup
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointerdown', primeVideos);
      window.removeEventListener('touchstart', primeVideos);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={containerRef} className="relative w-full bg-[#171716] text-[#F3F0EA] select-none">
      {/* FIXED 100% STAGE (No pin-spacer layout jumps) */}
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

          {/* SCENE 1 HERO CENTER OVERLAY */}
          <div
            ref={heroRef}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 pointer-events-none transition-transform will-change-transform"
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

          {/* SCENE 2 LEFT OVERLAY */}
          <div
            ref={scene2Ref}
            className="absolute left-4 sm:left-14 right-4 sm:right-auto bottom-16 sm:bottom-28 max-w-xs sm:max-w-lg pointer-events-none opacity-0 will-change-transform"
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

          {/* SCENE 3 LEFT OVERLAY */}
          <div
            ref={scene3Ref}
            className="absolute left-4 sm:left-14 right-4 sm:right-auto bottom-16 sm:bottom-28 max-w-xs sm:max-w-lg pointer-events-none opacity-0 will-change-transform"
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

          {/* SCENE 4 FINALE CENTER OVERLAY */}
          <div
            ref={scene4Ref}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 opacity-0 will-change-transform pointer-events-none"
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

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto px-4">
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
              <span
                ref={badgeRef}
                className="font-mono text-[9px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.25em] text-[#C8BDAA]/80 uppercase"
              >
                {SCENES[activeScene].badge}
              </span>
            </div>

            {/* Mobile Scroll Indicator (Right aligned) */}
            <div
              className={`sm:hidden flex items-center gap-1 font-mono text-[8px] tracking-wider text-[#A38D70] transition-opacity duration-300 ${
                scrollHint ? 'opacity-85' : 'opacity-0'
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
        className={`hidden sm:flex fixed bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex-col items-center gap-2 transition-opacity duration-300 ${
          scrollHint ? 'opacity-85' : 'opacity-0'
        }`}
      >
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#C8BDAA]">
          SCROLL TO EXPLORE
        </span>
        <div className="w-[1px] h-6 bg-gradient-to-b from-[#A38D70] to-transparent animate-pulse" />
      </div>

      {/* TALL SCROLL TRACK SPACER (Ensures zero pin-spacer layout jumps) */}
      <div ref={trackRef} className="relative z-0 w-full pointer-events-none" />
    </section>
  );
}
