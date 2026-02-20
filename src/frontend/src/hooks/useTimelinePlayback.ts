import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimationSettings, Keyframe } from './useAnimationSettings';
import { interpolateSettings } from '../utils/interpolation';

export function useTimelinePlayback(settings: AnimationSettings) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);

  const play = useCallback(() => {
    setIsPlaying(true);
    lastTimeRef.current = performance.now();
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (animationFrameRef.current !== undefined) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  const seek = useCallback((time: number) => {
    setCurrentTime(Math.max(0, Math.min(time, settings.duration)));
  }, [settings.duration]);

  const reset = useCallback(() => {
    setCurrentTime(0);
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const animate = (timestamp: number) => {
      const deltaTime = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      setCurrentTime((prev) => {
        const newTime = prev + deltaTime;
        if (newTime >= settings.duration) {
          setIsPlaying(false);
          return settings.duration;
        }
        return newTime;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, settings.duration]);

  const interpolatedSettings = interpolateSettings(settings, currentTime);

  return {
    isPlaying,
    currentTime,
    play,
    pause,
    seek,
    reset,
    interpolatedSettings,
  };
}
