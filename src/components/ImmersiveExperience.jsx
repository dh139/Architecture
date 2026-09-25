import React, { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SCENES = [
  {
    id: 1,
    tag: '01 / ARRIVAL',
    title: 'ARRIVAL',
    subtitle: 'Exterior → Entrance',
    quote: 'An architecture of quiet presence.',
    src: '/videos/video1.mp4',
    startProgress: 0.0,
    endProgress: 0.25,
  },
  {
    id: 2,
    tag: '02 / INTERIOR',
    title: 'INTERIOR',
    subtitle: 'Entrance → Interior / Living Room',
    quote: 'Spaces shaped by light and proportion.',
    src: '/videos/video2.mp4',
    startProgress: 0.25,
    endProgress: 0.5,
  },
  {
    id: 3,
    tag: '03 / LIVING',
    title: 'LIVING',
    subtitle: 'Living Room → Terrace / Infinity Pool',
    quote: 'Where interior and landscape become one.',
    src: '/videos/video3.mp4',
    startProgress: 0.5,
    endProgress: 0.75,
  },
  {
    id: 4,
    tag: '04 / HORIZON',
    title: 'HORIZON',
    subtitle: 'Terrace → Aerial View',
    quote: 'A private perspective on modern living.',
    src: '/videos/video4.mp4',
    startProgress: 0.75,
    endProgress: 1.0,
  },
];

export default function ImmersiveExperience() {
  const containerRef = useRef(null);
  const pinRef = useRef(null);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);

  // References to the 4 video elements
  const v1Ref = useRef(null);
  const v2Ref = useRef(null);
  const v3Ref = useRef(null);
  const v4Ref = useRef(null);

  // Video state tracking without triggering React re-renders
  const videoStateRef = useRef([
    { ref: v1Ref, duration: 8, targetTime: 0, isSeeking: false, isReady: false },
    { ref: v2Ref, duration: 8, targetTime: 0, isSeeking: false, isReady: false },
    { ref: v3Ref, duration: 8, targetTime: 0, isSeeking: false, isReady: false },
    { ref: v4Ref, duration: 8, targetTime: 0, isSeeking: false, isReady: false },
  ]);

  const activeIndexRef = useRef(0);

  // Safe seek function for a given video index
  const safeSeek = useCallback((index, targetTime) => {
    const item = videoStateRef.current[index];
    const video = item?.ref?.current;
    if (!video) return;

    item.targetTime = targetTime;
    if (item.isSeeking) return;

    const dur = item.duration || video.duration || 8;
    const clamped = Math.max(0, Math.min(dur, targetTime));

    if (Math.abs(video.currentTime - clamped) > 0.025) {
      item.isSeeking = true;
      video.currentTime = clamped;
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const pin = pinRef.current;
    if (!container || !pin) return;

    const videos = [v1Ref.current, v2Ref.current, v3Ref.current, v4Ref.current];

    // Setup video elements
    videos.forEach((vid, i) => {
      if (!vid) return;
      vid.muted = true;
      vid.playsInline = true;
      vid.setAttribute('playsinline', '');
      vid.setAttribute('webkit-playsinline', '');

      const onMeta = () => {
        if (vid.duration && !isNaN(vid.duration)) {
          videoStateRef.current[i].duration = vid.duration;
          videoStateRef.current[i].isReady = true;
        }
      };

      const onSeeked = () => {
        videoStateRef.current[i].isSeeking = false;
        const item = videoStateRef.current[i];
        const dur = item.duration || vid.duration || 8;
        if (dur && Math.abs(vid.currentTime - item.targetTime) > 0.035) {
          item.isSeeking = true;
          vid.currentTime = Math.max(0, Math.min(dur, item.targetTime));
        }
      };

      vid.addEventListener('loadedmetadata', onMeta);
      vid.addEventListener('seeked', onSeeked);

      if (vid.readyState >= 1 && vid.duration) {
        videoStateRef.current[i].duration = vid.duration;
        videoStateRef.current[i].isReady = true;
      }
    });

    // Helper to calculate opacity and scrub for all 4 videos
    const updatePlayback = (progress) => {
      // Boundaries & crossfades
      // Scene 1: 0.00 -> 0.25 (Crossfade 1->2 between 0.22 and 0.26)
      // Scene 2: 0.25 -> 0.50 (Crossfade 2->3 between 0.47 and 0.51)
      // Scene 3: 0.50 -> 0.75 (Crossfade 3->4 between 0.72 and 0.76)
      // Scene 4: 0.75 -> 1.00

      // Calculate video 1 local progress and opacity
      const p1 = Math.min(1, Math.max(0, progress / 0.24));
      let op1 = 1;
      if (progress >= 0.21 && progress <= 0.26) {
        op1 = 1 - (progress - 0.21) / 0.05;
      } else if (progress > 0.26) {
        op1 = 0;
      }

      // Calculate video 2 local progress and opacity
      const p2 = Math.min(1, Math.max(0, (progress - 0.235) / 0.25));
      let op2 = 0;
      if (progress >= 0.21 && progress < 0.26) {
        op2 = (progress - 0.21) / 0.05;
      } else if (progress >= 0.26 && progress <= 0.47) {
        op2 = 1;
      } else if (progress > 0.47 && progress <= 0.52) {
        op2 = 1 - (progress - 0.47) / 0.05;
      } else {
        op2 = 0;
      }

      // Calculate video 3 local progress and opacity
      const p3 = Math.min(1, Math.max(0, (progress - 0.495) / 0.25));
      let op3 = 0;
      if (progress >= 0.47 && progress < 0.52) {
        op3 = (progress - 0.47) / 0.05;
      } else if (progress >= 0.52 && progress <= 0.72) {
        op3 = 1;
      } else if (progress > 0.72 && progress <= 0.77) {
        op3 = 1 - (progress - 0.72) / 0.05;
      } else {
        op3 = 0;
      }

      // Calculate video 4 local progress and opacity
      const p4 = Math.min(1, Math.max(0, (progress - 0.745) / 0.255));
      let op4 = 0;
      if (progress >= 0.72 && progress < 0.77) {
        op4 = (progress - 0.72) / 0.05;
      } else if (progress >= 0.77) {
        op4 = 1;
      }

      // Apply opacities
      if (v1Ref.current) v1Ref.current.style.opacity = op1;
      if (v2Ref.current) v2Ref.current.style.opacity = op2;
      if (v3Ref.current) v3Ref.current.style.opacity = op3;
      if (v4Ref.current) v4Ref.current.style.opacity = op4;

      // Intelligent seek updates for active / visible videos
      if (op1 > 0 || progress < 0.3) {
        const d1 = videoStateRef.current[0].duration;
        safeSeek(0, p1 * d1);
      }
      if (op2 > 0 || (progress >= 0.18 && progress <= 0.55)) {
        const d2 = videoStateRef.current[1].duration;
        safeSeek(1, p2 * d2);
      }
      if (op3 > 0 || (progress >= 0.42 && progress <= 0.8)) {
        const d3 = videoStateRef.current[2].duration;
        safeSeek(2, p3 * d3);
      }
      if (op4 > 0 || progress >= 0.68) {
        const d4 = videoStateRef.current[3].duration;
        safeSeek(3, p4 * d4);
      }

      // Scene index tracking
      let nextIndex = 0;
      if (progress >= 0.75) nextIndex = 3;
      else if (progress >= 0.5) nextIndex = 2;
      else if (progress >= 0.25) nextIndex = 1;

      if (nextIndex !== activeIndexRef.current) {
        activeIndexRef.current = nextIndex;
        setActiveSceneIndex(nextIndex);
      }
    };

    // Create GSAP ScrollTrigger pinning the experience across 500vh
    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: '+=500vh',
      pin: pin,
      pinSpacing: true,
      scrub: 0.35,
      anticipatePin: 1,
      onUpdate: (self) => {
        const p = Math.max(0, Math.min(1, self.progress));
        setOverallProgress(p);
        updatePlayback(p);
      },
    });

    // Run initial frame layout
    updatePlayback(0);

    return () => {
      st.kill();
    };
  }, [safeSeek]);

  // Jump to specific scene when clicking an indicator
  const scrollToScene = (index) => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const startY = container.offsetTop;
    const totalDistance = window.innerHeight * 5.0; // 500vh
    const targetY = startY + index * 0.25 * totalDistance + 10;
    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    });
  };

  const currentScene = SCENES[activeSceneIndex];

  return (
    <section
      id="experience"
      ref={containerRef}
      className="relative w-full bg-[#171716] text-[#F3F0EA]"
      style={{ minHeight: '600vh' }}
    >
      <div
        ref={pinRef}
        className="relative w-screen h-screen overflow-hidden select-none bg-[#171716]"
      >
        {/* Four Stacked Architectural Videos */}
        <div className="absolute inset-0 w-full h-full bg-[#171716] overflow-hidden">
          <video
            ref={v1Ref}
            src="/videos/video1.mp4"
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover will-change-transform"
            style={{ opacity: 1, zIndex: 10 }}
          />
          <video
            ref={v2Ref}
            src="/videos/video2.mp4"
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover will-change-transform"
            style={{ opacity: 0, zIndex: 11 }}
          />
          <video
            ref={v3Ref}
            src="/videos/video3.mp4"
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover will-change-transform"
            style={{ opacity: 0, zIndex: 12 }}
          />
          <video
            ref={v4Ref}
            src="/videos/video4.mp4"
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover will-change-transform"
            style={{ opacity: 0, zIndex: 13 }}
          />
        </div>

        {/* Cinematic Vignette Overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(23,23,22,0.1) 0%, rgba(23,23,22,0.45) 80%, rgba(23,23,22,0.7) 100%)',
          }}
        />

        {/* Architectural Subtle Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none z-20 opacity-15">
          <div className="w-full h-full grid grid-cols-4 pointer-events-none border-x border-[#F3F0EA]/15">
            <div className="border-r border-[#F3F0EA]/15 h-full" />
            <div className="border-r border-[#F3F0EA]/15 h-full" />
            <div className="border-r border-[#F3F0EA]/15 h-full" />
          </div>
        </div>

        {/* TOP LEFT: Architectural Tag & Project Coordinates */}
        <div className="absolute top-24 left-6 sm:left-12 z-30 pointer-events-none flex flex-col gap-1">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#C8BDAA]/90">
            CINEMATIC WALKTHROUGH
          </span>
          <div className="flex items-center gap-3">
            <span className="font-serif text-lg tracking-widest text-[#F3F0EA]">
              AURELIA RESIDENCE
            </span>
            <span className="text-[#C8BDAA]/40 text-xs">/</span>
            <span className="font-mono text-xs tracking-wider text-[#A38D70]">
              {Math.round(overallProgress * 100)}% COMPLETE
            </span>
          </div>
        </div>

        {/* TOP RIGHT: Scene Navigation Pips */}
        <div className="absolute top-24 right-6 sm:right-12 z-30 flex items-center gap-2 sm:gap-4 bg-[#171716]/60 backdrop-blur-md px-4 py-2 border border-white/10 rounded-full">
          {SCENES.map((scene, idx) => (
            <button
              key={scene.id}
              onClick={() => scrollToScene(idx)}
              className={`group flex items-center gap-2 py-1 px-2 text-xs font-mono tracking-wider transition-all duration-300 ${
                activeSceneIndex === idx
                  ? 'text-[#F3F0EA]'
                  : 'text-[#C8BDAA]/50 hover:text-[#F3F0EA]'
              }`}
              title={`Jump to ${scene.title}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  activeSceneIndex === idx
                    ? 'bg-[#A38D70] scale-125'
                    : 'bg-white/20 group-hover:bg-white/50'
                }`}
              />
              <span className="hidden sm:inline font-mono text-[11px] tracking-widest">
                0{scene.id}
              </span>
            </button>
          ))}
        </div>

        {/* BOTTOM LEFT: Scene Title & Architectural Quote */}
        <div className="absolute bottom-16 sm:bottom-20 left-6 sm:left-12 z-30 max-w-xl pointer-events-none">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-xs tracking-[0.25em] text-[#A38D70] uppercase font-medium">
              {currentScene.tag}
            </span>
            <span className="w-8 h-[1px] bg-[#A38D70]/40" />
            <span className="font-mono text-[11px] tracking-[0.15em] text-[#C8BDAA]/80 uppercase hidden sm:inline">
              {currentScene.subtitle}
            </span>
          </div>

          <h2
            key={currentScene.title}
            className="font-serif text-3xl sm:text-5xl md:text-6xl font-light tracking-wide text-[#F3F0EA] mb-3 transition-opacity duration-700 leading-none"
          >
            {currentScene.title}
          </h2>

          <p
            key={currentScene.quote}
            className="font-serif italic text-base sm:text-xl md:text-2xl text-[#C8BDAA] font-normal tracking-wide max-w-lg transition-opacity duration-700 leading-relaxed"
          >
            &ldquo;{currentScene.quote}&rdquo;
          </p>
        </div>

        {/* BOTTOM RIGHT: Interactive Scroll Prompt / Indicator */}
        <div className="absolute bottom-16 sm:bottom-20 right-6 sm:right-12 z-30 flex flex-col items-end pointer-events-none">
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#C8BDAA]/70 mb-1">
            SCROLL PROGRESSION
          </span>
          <div className="flex items-baseline gap-1 font-serif text-2xl text-[#F3F0EA]">
            <span>0{activeSceneIndex + 1}</span>
            <span className="text-[#A38D70] text-sm font-mono">/ 04</span>
          </div>
          <div className="w-32 h-[2px] bg-white/10 mt-3 relative overflow-hidden">
            <div
              className="h-full bg-[#A38D70] transition-all duration-150 ease-out"
              style={{ width: `${overallProgress * 100}%` }}
            />
          </div>
        </div>

        {/* Center Bottom: Scroll Prompt */}
        <div
          className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center transition-opacity duration-500 ${
            overallProgress > 0.03 && overallProgress < 0.96 ? 'opacity-30' : 'opacity-85'
          }`}
        >
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#C8BDAA]">
            {overallProgress >= 0.98 ? 'SCROLL TO CONTINUE' : 'SCROLL TO EXPLORE ARCHITECTURE'}
          </span>
          <div className="w-[1px] h-6 bg-gradient-to-b from-[#A38D70] to-transparent mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
