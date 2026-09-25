import React, { useEffect, useRef, useState } from 'react';

const SECTIONS = [
  {
    id: 'arrival',
    number: '01',
    label: 'ARRIVAL',
    clip: '/videos/video1.mp4',
    eyebrow: 'Exterior → Entrance',
    title: 'An architecture of quiet presence.',
    quote: 'Where monolithic travertine and Mediterranean light establish a timeless dialogue.',
    scroll: 1.5,
    linger: 0.35,
  },
  {
    id: 'interior',
    number: '02',
    label: 'INTERIOR',
    clip: '/videos/video2.mp4',
    eyebrow: 'Entrance → Interior / Living',
    title: 'Spaces shaped by light and proportion.',
    quote: 'Open volumes and carefully framed views connect the interior with the surrounding landscape.',
    scroll: 1.5,
    linger: 0.35,
  },
  {
    id: 'living',
    number: '03',
    label: 'LIVING',
    clip: '/videos/video3.mp4',
    eyebrow: 'Living Room → Terrace / Infinity Pool',
    title: 'Where interior and landscape become one.',
    quote: 'Daylight dances across hand-honed stone into the cantilevered heated saltwater pool.',
    scroll: 1.5,
    linger: 0.35,
  },
  {
    id: 'horizon',
    number: '04',
    label: 'HORIZON',
    clip: '/videos/video4.mp4',
    eyebrow: 'Terrace → Aerial View',
    title: 'A private perspective on modern living.',
    quote: 'Elevated 240 meters above the sea, commanding uninterrupted coastal horizons.',
    scroll: 1.7,
    linger: 0.4,
  },
];

export default function LetsScrollEngine({ onExploreMore, onOpenInquiry }) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const progressBarRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [scrollHintVisible, setScrollHintVisible] = useState(true);

  const scenesRef = useRef([]);
  const copiesRef = useRef([]);
  const videosRef = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    const isMobile = () => coarse || window.innerWidth <= 860;

    const DIVE_W = 1.5;
    const CROSSFADE = 0.16; // seam dissolve width in vh
    const N = SECTIONS.length;

    const SEGMENTS = SECTIONS.map((s, i) => ({
      si: i,
      clip: s.clip,
      w: s.scroll || DIVE_W,
      linger: s.linger || 0.35,
      start: 0,
      end: 0,
      cur: 0,
      target: 0,
      ready: false,
      visible: false,
    }));
    const NSEG = SEGMENTS.length;

    const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
    const smooth = (x) => {
      x = clamp(x);
      return x * x * (3 - 2 * x);
    };
    const lingerEase = (x, L) => {
      L = clamp(L);
      const c = x - 0.5;
      return (1 - L) * x + L * (4 * c * c * c + 0.5);
    };

    let vh = window.innerHeight;
    let totalW = 0;
    let laidOutW = window.innerWidth;
    let ticking = false;
    let currentActiveIdx = 0;

    function layout() {
      vh = window.innerHeight;
      laidOutW = window.innerWidth;
      let off = 0;
      SEGMENTS.forEach((s) => {
        s.start = off * vh;
        off += s.w;
        s.end = off * vh;
      });
      totalW = off;
      track.style.height = `${totalW * vh + vh}px`;
      read();
    }

    // Initialize videos
    videosRef.current.forEach((v, i) => {
      if (!v) return;
      v.muted = true;
      v.playsInline = true;
      v.setAttribute('playsinline', '');
      v.setAttribute('webkit-playsinline', '');

      const onMeta = () => {
        SEGMENTS[i].ready = true;
        read();
      };
      v.addEventListener('loadedmetadata', onMeta);
      v.addEventListener('canplay', onMeta);
      if (v.readyState >= 1) {
        SEGMENTS[i].ready = true;
      }
    });

    // Touch priming for mobile / iOS
    let userReady = false;
    function primeVideo(v) {
      if (!isMobile() || !v) return;
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
    }

    function onFirstGesture() {
      if (userReady) return;
      userReady = true;
      videosRef.current.forEach((v) => primeVideo(v));
    }
    window.addEventListener('pointerdown', onFirstGesture, { once: true, passive: true });
    window.addEventListener('touchstart', onFirstGesture, { once: true, passive: true });

    function read() {
      const y = window.scrollY || window.pageYOffset;
      const fade = CROSSFADE * vh;

      let ci = 0;
      for (let i = 0; i < NSEG; i++) {
        if (y >= SEGMENTS[i].start) ci = i;
      }

      for (let i = 0; i < NSEG; i++) {
        const s = SEGMENTS[i];
        const local = clamp((y - s.start) / (s.end - s.start), 0, 1);
        s.target = s.linger ? lingerEase(local, s.linger) : local;

        let outside = 0;
        if (y < s.start) outside = s.start - y;
        else if (y > s.end) outside = y - s.end;

        const op = smooth(1 - outside / fade);
        const sceneEl = scenesRef.current[i];
        if (sceneEl) {
          sceneEl.style.opacity = op;
          sceneEl.style.zIndex = i === ci ? '12' : String(10 + Math.round(op * 2));
        }
        s.visible = op > 0.001;
      }

      // Update copy visibility
      for (let i = 0; i < N; i++) {
        const seg = SEGMENTS[i];
        const pr = clamp((y - seg.start) / (seg.end - seg.start), 0, 1);
        const before = y < seg.start;
        const after = y > seg.end;

        let cop;
        if (i === 0) {
          cop = after ? 0 : smooth(1 - pr / 0.65);
        } else if (i === N - 1) {
          cop = before ? 0 : smooth(pr / 0.45);
        } else {
          cop = before || after ? 0 : smooth(1 - Math.abs(pr - 0.5) / 0.5);
        }

        const copyEl = copiesRef.current[i];
        if (copyEl) {
          copyEl.style.opacity = cop;
          copyEl.style.transform = reduce ? 'none' : `translateY(${(0.5 - pr) * 20}px)`;
          copyEl.style.pointerEvents = cop > 0.4 ? 'auto' : 'none';
        }
      }

      // Active section index
      const cur = SEGMENTS[ci];
      const near = clamp(
        (y - cur.start) / (cur.end - cur.start) > 0.5 ? cur.si + 1 : cur.si,
        0,
        N - 1
      );
      if (near !== currentActiveIdx) {
        currentActiveIdx = near;
        setActiveIndex(near);
      }

      const totProg = clamp(y / (totalW * vh));
      setOverallProgress(totProg);
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${totProg})`;
      }

      setScrollHintVisible(y < 0.25 * vh);
      ticking = false;
    }

    // RAF Loop with seek coalescing and lerping
    let rafId;
    function raf() {
      const eps = isMobile() ? 0.02 : 0.008;

      for (let i = 0; i < NSEG; i++) {
        const s = SEGMENTS[i];
        const v = videosRef.current[i];
        if (!v) continue;

        if (v.seeking) continue;
        if (!s.visible && Math.abs(s.cur - s.target) < 0.002) continue;

        s.cur += (s.target - s.cur) * (reduce ? 1 : 0.22);
        const dur = v.duration || 8;
        const t = clamp(s.cur, 0, 0.999) * dur;

        if (Math.abs(v.currentTime - t) > eps) {
          try {
            v.currentTime = t;
          } catch (e) {}
        }
      }

      rafId = requestAnimationFrame(raf);
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(read);
      }
    };

    const onResize = () => {
      if (coarse && window.innerWidth === laidOutW) return;
      layout();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', layout);

    layout();
    rafId = requestAnimationFrame(raf);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', layout);
      window.removeEventListener('pointerdown', onFirstGesture);
      window.removeEventListener('touchstart', onFirstGesture);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const jumpTo = (i) => {
    const vh = window.innerHeight;
    const DIVE_W = 1.5;
    let startY = 0;
    for (let k = 0; k < i; k++) {
      startY += (SECTIONS[k].scroll || DIVE_W) * vh;
    }
    const targetY = startY + 0.3 * (SECTIONS[i].scroll || DIVE_W) * vh;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  return (
    <section ref={containerRef} className="relative w-full bg-[#171716] text-[#F3F0EA] overflow-hidden">
      {/* Top Hairline Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-50 bg-white/10 pointer-events-none">
        <span
          ref={progressBarRef}
          className="block h-full w-full bg-[#A38D70] origin-left transition-transform duration-75"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      {/* FULLSCREEN FIXED STAGE: Crisp, unobstructed video view */}
      <div className="fixed inset-0 w-screen h-screen z-10 pointer-events-none overflow-hidden bg-[#171716]">
        {SECTIONS.map((sec, i) => (
          <div
            key={sec.id}
            ref={(el) => (scenesRef.current[i] = el)}
            className="absolute inset-0 w-full h-full opacity-0 overflow-hidden will-change-transform"
            style={{ zIndex: i === 0 ? 12 : 10 }}
          >
            <video
              ref={(el) => (videosRef.current[i] = el)}
              src={sec.clip}
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none filter brightness-[0.9] contrast-[1.05]"
            />
          </div>
        ))}

        {/* Subtle, delicate bottom vignette to ensure typography legibility without covering the architecture */}
        <div
          className="absolute inset-x-0 bottom-0 h-[45vh] pointer-events-none z-20"
          style={{
            background:
              'linear-gradient(to top, rgba(23,23,22,0.85) 0%, rgba(23,23,22,0.4) 45%, transparent 100%)',
          }}
        />

        {/* Subtle top shade for navigation readability */}
        <div
          className="absolute inset-x-0 top-0 h-32 pointer-events-none z-20"
          style={{
            background:
              'linear-gradient(to bottom, rgba(23,23,22,0.6) 0%, transparent 100%)',
          }}
        />
      </div>

      {/* ELEGANT CORNER OVERLAYS: Clean, architectural, non-intrusive */}
      <div className="fixed inset-0 z-30 pointer-events-none flex flex-col justify-between p-6 sm:p-12">
        {/* Top Spacer for Navbar */}
        <div className="w-full h-12" />

        {/* Bottom Bar: Left Editorial Quote & Right Scrubber */}
        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 pointer-events-none">
          {/* Left Corner: Architectural Scene Title & Quote */}
          <div className="relative max-w-xl">
            {SECTIONS.map((sec, i) => (
              <div
                key={sec.id}
                ref={(el) => (copiesRef.current[i] = el)}
                className={`transition-all duration-500 ${
                  i === 0 ? 'relative' : 'absolute bottom-0 left-0 w-full'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#A38D70] font-medium">
                    0{i + 1} / {sec.label}
                  </span>
                  <span className="w-6 h-[1px] bg-[#A38D70]/40" />
                  <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#C8BDAA]">
                    {sec.eyebrow}
                  </span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#F3F0EA] tracking-wide leading-tight mb-2">
                  {sec.title}
                </h2>

                <p className="font-serif italic text-base sm:text-lg text-[#C8BDAA] font-light max-w-lg leading-relaxed">
                  &ldquo;{sec.quote}&rdquo;
                </p>

                {/* Final scene call to action */}
                {i === SECTIONS.length - 1 && (
                  <div className="mt-5 flex items-center gap-4 pointer-events-auto">
                    <button
                      onClick={() => {
                        if (onOpenInquiry) onOpenInquiry();
                      }}
                      className="font-mono text-xs tracking-[0.25em] uppercase px-7 py-3.5 bg-[#A38D70] text-[#171716] font-semibold hover:bg-[#F3F0EA] transition-all cursor-pointer shadow-lg"
                    >
                      REQUEST PRIVATE VIEWING
                    </button>
                    <button
                      onClick={() => {
                        if (onExploreMore) onExploreMore();
                      }}
                      className="font-mono text-xs tracking-[0.2em] uppercase px-5 py-3.5 border border-[#C8BDAA]/40 text-[#F3F0EA] hover:border-[#FFFFFF] transition-all cursor-pointer"
                    >
                      SPECIFICATIONS &darr;
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Corner: Chapter Tracker & Quick Jump Controls */}
          <div className="flex flex-col items-end gap-3 pointer-events-auto">
            <div className="flex items-center gap-3 bg-[#171716]/60 backdrop-blur-md px-4 py-2 border border-white/10 rounded-full">
              {SECTIONS.map((sec, i) => (
                <button
                  key={sec.id}
                  onClick={() => jumpTo(i)}
                  className={`font-mono text-xs tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                    activeIndex === i
                      ? 'text-[#F3F0EA] font-semibold'
                      : 'text-[#C8BDAA]/50 hover:text-[#F3F0EA]'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      activeIndex === i ? 'bg-[#A38D70] scale-125' : 'bg-white/20'
                    }`}
                  />
                  <span>0{sec.number}</span>
                </button>
              ))}
            </div>

            <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#C8BDAA]/60 flex items-center gap-2">
              <span>CAMERA FLIGHT</span>
              <span>&bull;</span>
              <span>{Math.round(overallProgress * 100)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* SCROLL HINT (Fades out once user begins scrolling) */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none flex flex-col items-center gap-2 transition-opacity duration-500 ${
          scrollHintVisible ? 'opacity-80' : 'opacity-0'
        }`}
      >
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#C8BDAA]">
          SCROLL TO FLY THROUGH ARCHITECTURE
        </span>
        <div className="w-[1px] h-6 bg-gradient-to-b from-[#A38D70] to-transparent animate-pulse" />
      </div>

      {/* TALL SCROLL TRACK THAT MAPS WINDOW SCROLL TO VIDEO PLAYBACK */}
      <div ref={trackRef} className="relative z-0 w-full pointer-events-none" />
    </section>
  );
}
