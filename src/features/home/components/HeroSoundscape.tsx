"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useNavigation } from "@/components/layout/NavigationContext";

export function HeroSoundscape() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const { currentTheme, isMenuOpen } = useNavigation();

  const toggleSound = useCallback(async () => {
    if (!isPlaying) {
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        const ctx = new AudioCtx();
        if (ctx.state === "suspended") {
          await ctx.resume();
        }
        audioCtxRef.current = ctx;

        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
        masterGain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 1.8);
        masterGain.connect(ctx.destination);
        gainNodeRef.current = masterGain;

        // Gentle warm harmonic drone (Rajasthani tanpura resonant chord in D)
        const freqs = [146.83, 220.0, 293.66, 440.0];
        freqs.forEach((f) => {
          const osc = ctx.createOscillator();
          osc.type = "sine";
          osc.frequency.setValueAtTime(f, ctx.currentTime);

          const filter = ctx.createBiquadFilter();
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(450, ctx.currentTime);

          const subGain = ctx.createGain();
          subGain.gain.setValueAtTime(0.25, ctx.currentTime);

          osc.connect(filter);
          filter.connect(subGain);
          subGain.connect(masterGain);
          osc.start();
        });

        setIsPlaying(true);
      } catch (err) {
        console.warn("Audio Context playback prevented:", err);
      }
    } else {
      if (gainNodeRef.current && audioCtxRef.current) {
        try {
          gainNodeRef.current.gain.exponentialRampToValueAtTime(
            0.0001,
            audioCtxRef.current.currentTime + 0.8
          );
          setTimeout(() => {
            if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
              audioCtxRef.current.close().catch(() => {});
            }
            audioCtxRef.current = null;
          }, 850);
        } catch {
          audioCtxRef.current?.close().catch(() => {});
          audioCtxRef.current = null;
        }
      }
      setIsPlaying(false);
    }
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      audioCtxRef.current?.close().catch(() => {});
    };
  }, []);

  // Hide floating audio pill while full-screen menu modal is active
  if (isMenuOpen) return null;

  const isDark = currentTheme === "dark";

  return (
    <div
      className="fixed bottom-12 right-4 sm:bottom-14 sm:right-8 z-40 select-none pointer-events-auto transition-all duration-500"
      data-testid="fixed-hero-soundscape"
    >
      <button
        type="button"
        onClick={toggleSound}
        className={`group flex items-center gap-2 rounded-full backdrop-blur-md border px-3.5 py-1.5 text-[10px] uppercase tracking-[0.22em] transition-all duration-300 focus:outline-none cursor-pointer ${
          isDark
            ? "bg-[#14110E]/80 border-[#FAF6F0]/20 text-[#FAF6F0]/85 hover:border-[#E4C198] hover:text-[#E4C198] shadow-[0_4px_20px_rgba(0,0,0,0.55)]"
            : "bg-[#FAF6F0]/90 border-[#30251F]/20 text-[#30251F]/85 hover:border-[#A65335] hover:text-[#A65335] shadow-[0_4px_20px_rgba(48,37,31,0.12)]"
        }`}
        title={isPlaying ? "Mute Desert Soundscape" : "Listen to Thar Desert Ambient Harmony"}
        aria-label={isPlaying ? "Mute Desert Soundscape" : "Listen to Thar Desert Ambient Harmony"}
      >
        {isPlaying ? (
          <>
            <Volume2 size={13} className={isDark ? "text-[#E4C198]" : "text-[#A65335]"} />
            <span className="font-medium">Desert Breeze</span>
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
