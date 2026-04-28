import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Track } from "../services/api";

interface ZenModeProps {
  track: Track | null;
  currentTime: number;
  onClose: () => void;
}

export default function ZenMode({ track, currentTime, onClose }: ZenModeProps) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // LOGIC 1: Cari index lirik yang lagi aktif
  useEffect(() => {
    if (!track?.lyrics) return;

    const syncOffset = 0.15; // Kalibrasi delay render
    const now = currentTime + syncOffset;

    const currentIdx = track.lyrics.findIndex((line, i) => {
      const nextTime = track.lyrics![i + 1]?.time || 99999;
      return now >= line.time && now < nextTime;
    });

    if (currentIdx !== activeIndex) {
      setActiveIndex(currentIdx);
    }
  }, [currentTime, track?.lyrics, activeIndex]);

  // LOGIC 2: Scroll HANYA ketika index lirik berubah (Biar gak ngelag)
  useEffect(() => {
    if (activeIndex !== -1) {
      const activeEl = document.getElementById(`lyric-${activeIndex}`);
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [activeIndex]);

  if (!track) return null;

  return (
    <div className="fixed inset-0 bg-[#010103] z-[100] flex items-center justify-center overflow-hidden">
      {/* BACKGROUND AMBIENT APPLE MUSIC STYLE */}
      <img
        src={track.cover_url}
        alt="zen ambient"
        className="absolute inset-0 w-full h-full object-cover blur-[140px] opacity-40 scale-125 pointer-events-none"
      />
      <div className="absolute inset-0 bg-black/50 backdrop-blur-3xl pointer-events-none" />
      
      {/* TOMBOL CLOSE */}
      <button 
        onClick={onClose} 
        className="absolute top-10 right-10 text-white/50 hover:text-white z-[110] bg-black/20 hover:bg-white/10 p-3 rounded-full border border-white/10 backdrop-blur-md transition-all"
      >
        <X size={28} />
      </button>

      <div className="container mx-auto px-6 md:px-20 h-screen flex flex-col md:flex-row items-center gap-10 md:gap-20 z-10">
        
        {/* KIRI: COVER & INFO */}
        <div className="w-full md:w-5/12 flex flex-col items-center md:items-start transition-transform duration-700 hover:scale-105">
          <img 
            src={track.cover_url} 
            className="w-56 h-56 md:w-[480px] md:h-[480px] rounded-[40px] object-cover shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 mb-10" 
            alt={track.title}
          />
          <h1 className="text-4xl md:text-7xl font-black text-white mb-3 tracking-tighter drop-shadow-lg">{track.title}</h1>
          <p className="text-xl md:text-3xl text-cyan-400 font-semibold drop-shadow-md">{track.artist}</p>
        </div>

        {/* KANAN: LIRIK APPLE/SPOTIFY STYLE */}
        <div 
          ref={scrollContainerRef}
          className="w-full md:w-7/12 h-[80vh] overflow-y-auto scrollbar-hide flex flex-col space-y-10 py-[40vh] px-4"
          style={{ 
            maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)', 
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)' 
          }}
        >
          {track.lyrics?.map((line, index) => {
            const isActive = index === activeIndex;
            // Deteksi lirik yang udah lewat biar warnanya beda tipis
            const isPassed = index < activeIndex;

            return (
              <p
                key={index}
                id={`lyric-${index}`}
                className={`text-4xl md:text-6xl font-black transition-all duration-700 tracking-tight leading-[1.2] cursor-pointer hover:text-white ${
                  isActive 
                    ? "text-white scale-105 origin-left drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]" 
                    : isPassed
                      ? "text-white/40 scale-100 blur-[0.5px]" // Lirik lewat lebih jelas dikit
                      : "text-white/20 scale-[0.98] blur-[1px]" // Lirik masa depan agak ngeblur
                }`}
              >
                {line.text}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}