import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollVideo({
  videoSource,
  scrollDuration = '120vh',
  overlayContent = null,
  className = '',
  poster = '',
  onProgress = null,
}) {
  const containerRef = useRef(null);
  const pinRef = useRef(null);
  const videoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const targetTimeRef = useRef(0);
  const isSeekingRef = useRef(false);
  const durationRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    const pin = pinRef.current;
    if (!video || !container || !pin) return;

    video.muted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    const applyTime = () => {
      if (!video || isSeekingRef.current) return;
      const dur = durationRef.current || video.duration;
      if (!dur || isNaN(dur)) return;

      const target = Math.max(0, Math.min(dur, targetTimeRef.current));
      if (Math.abs(video.currentTime - target) > 0.02) {
        isSeekingRef.current = true;
        video.currentTime = target;
      }
    };

    const handleSeeked = () => {
      isSeekingRef.current = false;
      const dur = durationRef.current || video.duration;
      if (dur && Math.abs(video.currentTime - targetTimeRef.current) > 0.03) {
        applyTime();
      }
    };

    const handleLoadedMetadata = () => {
      if (video.duration && !isNaN(video.duration)) {
        durationRef.current = video.duration;
        setIsLoaded(true);
        applyTime();
      }
    };

    video.addEventListener('seeked', handleSeeked);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('canplay', () => setIsLoaded(true));

    if (video.readyState >= 1 && video.duration) {
      durationRef.current = video.duration;
      setIsLoaded(true);
    }

    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: `+=${scrollDuration}`,
      pin: pin,
      pinSpacing: true,
      scrub: 0.4,
      anticipatePin: 1,
      onUpdate: (self) => {
        const p = Math.max(0, Math.min(1, self.progress));
        const dur = durationRef.current || video.duration || 8;
        targetTimeRef.current = p * dur;
        applyTime();

        if (onProgress) {
          onProgress(p);
        }
      },
    });

    const tickerUpdate = () => {
      if (!isSeekingRef.current) {
        applyTime();
      }
    };
    gsap.ticker.add(tickerUpdate);

    return () => {
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      gsap.ticker.remove(tickerUpdate);
      if (st) st.kill();
    };
  }, [scrollDuration, onProgress]);

  return (
    <div ref={containerRef} className={`scroll-video-wrapper relative w-full ${className}`}>
      <div ref={pinRef} className="scroll-video-viewport relative w-screen h-screen overflow-hidden">
        <video
          ref={videoRef}
          src={videoSource}
          poster={poster}
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover select-none pointer-events-none will-change-transform"
        />
        <div className="scroll-video-overlay absolute inset-0 pointer-events-none">
          {overlayContent}
        </div>
      </div>
    </div>
  );
}
