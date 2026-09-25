import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useScrollVideo({
  videoRef,
  triggerRef,
  pinRef,
  scrollDistance = '150vh',
  onProgress,
  disabled = false,
}) {
  const scrollTriggerRef = useRef(null);
  const targetTimeRef = useRef(0);
  const isSeekingRef = useRef(false);
  const durationRef = useRef(0);

  useEffect(() => {
    const video = videoRef?.current;
    const trigger = triggerRef?.current;
    if (!video || !trigger || disabled) return;

    // Ensure video is properly configured
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    // Function to safely update video currentTime
    const applyTargetTime = () => {
      if (!video || isSeekingRef.current) return;
      const duration = durationRef.current || video.duration;
      if (!duration || isNaN(duration)) return;

      const clampedTarget = Math.max(0, Math.min(duration, targetTimeRef.current));
      if (Math.abs(video.currentTime - clampedTarget) > 0.02) {
        isSeekingRef.current = true;
        video.currentTime = clampedTarget;
      }
    };

    const handleSeeked = () => {
      isSeekingRef.current = false;
      const duration = durationRef.current || video.duration;
      if (duration && Math.abs(video.currentTime - targetTimeRef.current) > 0.03) {
        applyTargetTime();
      }
    };

    const handleLoadedMetadata = () => {
      if (video.duration && !isNaN(video.duration)) {
        durationRef.current = video.duration;
        applyTargetTime();
      }
    };

    video.addEventListener('seeked', handleSeeked);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    if (video.readyState >= 1 && video.duration) {
      durationRef.current = video.duration;
    }

    // GSAP ScrollTrigger creation
    const st = ScrollTrigger.create({
      trigger: trigger,
      start: 'top top',
      end: `+=${scrollDistance}`,
      pin: pinRef?.current || trigger,
      pinSpacing: true,
      scrub: 0.5,
      anticipatePin: 1,
      onUpdate: (self) => {
        const progress = Math.max(0, Math.min(1, self.progress));
        const duration = durationRef.current || video.duration || 8;
        targetTimeRef.current = progress * duration;

        applyTargetTime();

        if (onProgress) {
          onProgress(progress, self);
        }
      },
    });

    scrollTriggerRef.current = st;

    // Ticker fallback to ensure smooth sync
    const tickerCallback = () => {
      if (!isSeekingRef.current) {
        applyTargetTime();
      }
    };
    gsap.ticker.add(tickerCallback);

    return () => {
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      gsap.ticker.remove(tickerCallback);
      if (st) {
        st.kill();
      }
    };
  }, [videoRef, triggerRef, pinRef, scrollDistance, onProgress, disabled]);

  return {
    scrollTrigger: scrollTriggerRef.current,
  };
}
