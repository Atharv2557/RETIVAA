"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useNavigation } from "@/components/layout/NavigationContext";

const CUSTOM_MUSIC_SRC = "/music/sarangiTune.m4a";

export function HeroSoundscape() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeAnimRef = useRef<number | null>(null);
  const { currentTheme, isMenuOpen } = useNavigation();

  const cancelVolumeFade = useCallback(() => {
    if (fadeAnimRef.current !== null) {
      cancelAnimationFrame(fadeAnimRef.current);
      fadeAnimRef.current = null;
    }
  }, []);

  const fadeVolume = useCallback(
    (targetVolume: number, durationMs: number, onComplete?: () => void) => {
      cancelVolumeFade();
      const audio = audioRef.current;
      if (!audio) return;

      const startVolume = audio.volume;
      const startTime = performance.now();

      const step = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        const newVol = startVolume + (targetVolume - startVolume) * progress;
        audio.volume = Math.max(0, Math.min(1, newVol));

        if (progress < 1) {
          fadeAnimRef.current = requestAnimationFrame(step);
        } else {
          fadeAnimRef.current = null;
          onComplete?.();
        }
      };

      fadeAnimRef.current = requestAnimationFrame(step);
    },
    [cancelVolumeFade]
  );

  const toggleSound = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!isPlaying) {
      audio.volume = 0;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            fadeVolume(0.65, 1000);
          })
          .catch((err) => {
            console.warn("Audio playback prevented:", err);
            setIsPlaying(false);
          });
      }
    } else {
      fadeVolume(0, 600, () => {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        setIsPlaying(false);
      });
    }
  }, [isPlaying, fadeVolume]);

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      cancelVolumeFade();
      if (audio) {
        audio.pause();
      }
    };
  }, [cancelVolumeFade]);

  // Hide floating audio pill while full-screen menu modal is active
  if (isMenuOpen) return null;

  const isDark = currentTheme === "dark";

  return (
    <div
      className="fixed bottom-12 right-3 sm:bottom-14 sm:right-8 z-40 select-none pointer-events-auto transition-all duration-500"
      data-testid="fixed-hero-soundscape"
    >
      {/* Hidden audio element loading user custom music file */}
      <audio
        ref={audioRef}
        src={CUSTOM_MUSIC_SRC}
        loop
        preload="metadata"
        playsInline
        onEnded={() => setIsPlaying(false)}
        onPause={() => {
          if (audioRef.current && audioRef.current.volume === 0) {
            setIsPlaying(false);
          }
        }}
      />

      <button
        type="button"
        onClick={toggleSound}
        className={`group flex items-center gap-1.5 sm:gap-2 rounded-full backdrop-blur-md border px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 text-[9px] sm:text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.22em] transition-all duration-300 focus:outline-none cursor-pointer ${
          isDark
            ? "bg-[#14110E]/85 border-[#FAF6F0]/20 text-[#FAF6F0]/85 hover:border-[#E4C198] hover:text-[#E4C198] shadow-[0_4px_20px_rgba(0,0,0,0.55)]"
            : "bg-[#FAF6F0]/90 border-[#30251F]/20 text-[#30251F]/85 hover:border-[#A65335] hover:text-[#A65335] shadow-[0_4px_20px_rgba(48,37,31,0.12)]"
        }`}
        title={isPlaying ? "Mute Royal Sarangi Ambience" : "Listen to Royal Sarangi Desert Ambience"}
        aria-label={isPlaying ? "Mute Royal Sarangi Ambience" : "Listen to Royal Sarangi Desert Ambience"}
      >
        {isPlaying ? (
          <>
            <Volume2 size={13} className={isDark ? "text-[#E4C198]" : "text-[#A65335]"} />
            <span className="font-medium">Sarangi Ambience</span>
            <span className="flex items-end gap-0.5 h-2.5 w-3 ml-0.5" aria-hidden="true">
              <span className={`w-0.5 animate-[bounce_0.8s_infinite] h-full ${isDark ? "bg-[#E4C198]" : "bg-[#A65335]"}`} />
              <span className={`w-0.5 animate-[bounce_1.2s_infinite] h-2/3 ${isDark ? "bg-[#E4C198]" : "bg-[#A65335]"}`} />
              <span className={`w-0.5 animate-[bounce_0.6s_infinite] h-4/5 ${isDark ? "bg-[#E4C198]" : "bg-[#A65335]"}`} />
            </span>
          </>
        ) : (
          <>
            <VolumeX size={13} className={isDark ? "text-[#FAF6F0]/60 group-hover:text-[#E4C198]" : "text-[#30251F]/60 group-hover:text-[#A65335]"} />
            <span className="font-medium">Ambience</span>
          </>
        )}
      </button>
    </div>
  );
}
