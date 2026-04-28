import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize2, ChevronDown, CloudRain } from "lucide-react";
import { Track } from "../services/api";

interface PlayerBarProps {
  track: Track | null;
  isPlaying: boolean;
  progress: number;
  volume: number;
  currentTime: number;
  duration: number;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (percent: number) => void;
  onVolumeChange: (v: number) => void;
  onZenMode: () => void;
}

function formatTime(s: number) {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function PlayerBar({
  track,
  isPlaying,
  progress,
  volume,
  currentTime,
  duration,
  onTogglePlay,
  onNext,
  onPrev,
  onSeek,
  onVolumeChange,
  onZenMode,
}: PlayerBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRainy, setIsRainy] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rainAudio = useRef<HTMLAudioElement | null>(null);

  // --- LOGIC: AUTO SCROLL LYRIC (SUPER SMOOTH) ---
  useEffect(() => {
    if (!track?.lyrics) return;
    const syncOffset = 0.15;
    const now = currentTime + syncOffset;
    const currentIdx = track.lyrics.findIndex((line, i) => {
      const nextTime = track.lyrics![i + 1]?.time || 99999;
      return now >= line.time && now < nextTime;
    });
    if (currentIdx !== activeIndex) setActiveIndex(currentIdx);
  }, [currentTime, track?.lyrics, activeIndex]);

  useEffect(() => {
    if (activeIndex !== -1 && isExpanded) {
      const activeEl = document.getElementById(`mobile-lyric-${activeIndex}`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [activeIndex, isExpanded]);

  // --- LOGIC: AMBIENT RAIN ---
  useEffect(() => {
    rainAudio.current = new Audio("https://www.soundjay.com/nature/rain-07.mp3");
    rainAudio.current.loop = true;
    rainAudio.current.volume = 0.3;

    return () => {
      rainAudio.current?.pause();
      rainAudio.current = null;
    };
  }, []);

  useEffect(() => {
    if (isRainy && isPlaying) {
      rainAudio.current?.play();
    } else {
      rainAudio.current?.pause();
    }
  }, [isRainy, isPlaying]);

  if (!track) {
    return (
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-black/40 backdrop-blur-3xl border-t border-white/5 z-50 flex items-center justify-center">
        <span className="text-white/30 text-sm font-medium tracking-widest uppercase">Select a track to play</span>
      </div>
    );
  }

  return (
    <>
      {/* 1. DESKTOP PLAYER (GLASSMORPHISM & NEON) */}
      <div className="hidden md:flex fixed bottom-4 left-60 right-4 h-20 bg-[#010103]/50 backdrop-blur-3xl border border-white/10 hover:border-white/20 transition-all duration-500 rounded-2xl z-50 items-center gap-5 px-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
        
        {/* Track Info */}
        <div className="flex items-center gap-4 w-64 flex-shrink-0 group">
          <div className="relative overflow-hidden rounded-lg shadow-lg">
            <img src={track.cover_url} alt={track.title} className="w-12 h-12 object-cover transform group-hover:scale-110 transition-transform duration-500" />
            {isPlaying && <div className="absolute inset-0 bg-cyan-500/20 mix-blend-overlay animate-pulse" />}
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="marquee-container cursor-default">
              <div className="marquee-content group-hover:text-cyan-400 transition-colors duration-300">
                <span className="text-white text-sm font-bold tracking-tight mr-12">{track.title}</span>
                <span className="text-white text-sm font-bold tracking-tight mr-12">{track.title}</span>
              </div>
            </div>
            <p className="text-white/40 text-[11px] font-medium truncate mt-0.5 tracking-wide">{track.artist}</p>
          </div>
        </div>

        {/* Playback Controls (Neon Glows) */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <button onClick={onPrev} className="text-white/40 hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all active:scale-90"><SkipBack size={20} /></button>
          
          <button 
            onClick={onTogglePlay} 
            className="w-11 h-11 rounded-full bg-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:shadow-[0_0_25px_rgba(34,211,238,0.7)] hover:scale-105 active:scale-95 transition-all duration-300"
          >
            {isPlaying ? <Pause size={20} fill="black" className="text-black" /> : <Play size={20} fill="black" className="text-black ml-1" />}
          </button>
          
          <button onClick={onNext} className="text-white/40 hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all active:scale-90"><SkipForward size={20} /></button>
        </div>

        {/* Progress Bar (Interactive Glow) */}
        <div className="flex-1 flex items-center gap-3 min-w-0 group cursor-pointer" onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            // Penyesuaian area klik supaya lebih akurat
            const clickArea = rect.width - 80; // kurangi ukuran text menit
            const clickX = e.clientX - rect.left - 40; 
            onSeek((clickX / clickArea) * 100);
          }}>
          <span className="text-[10px] text-white/30 font-mono w-10 text-right">{formatTime(currentTime)}</span>
          
          <div className="flex-1 h-1.5 bg-white/10 rounded-full relative transition-all duration-300 group-hover:h-2 group-hover:bg-white/20">
            <div 
              className="absolute left-0 top-0 h-full bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-100 ease-linear" 
              style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
            >
              {/* Dot Head Progress */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.9)] opacity-0 group-hover:opacity-100 transform translate-x-1/2 transition-opacity duration-200" />
            </div>
          </div>

          <span className="text-[10px] text-white/30 font-mono w-10">{formatTime(duration)}</span>
        </div>

        {/* Right Tools (Volume, Rain, Zen) */}
        <div className="flex items-center gap-4 ml-2 flex-shrink-0">
          <button onClick={() => setIsRainy(!isRainy)} className={`transition-all duration-300 hover:scale-110 ${isRainy ? "text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-pulse" : "text-white/30 hover:text-white"}`}>
            <CloudRain size={18} />
          </button>

          <div className="flex items-center gap-2 group/vol">
            <button onClick={() => onVolumeChange(volume === 0 ? 0.7 : 0)} className="text-white/30 group-hover/vol:text-cyan-400 transition-colors">
              {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <input 
              type="range" min="0" max="1" step="0.01" 
              value={volume} 
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))} 
              className="w-16 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300 transition-all" 
            />
          </div>

          <div className="w-px h-6 bg-white/10 mx-1" /> {/* Divider */}

          <button onClick={onZenMode} className="text-white/30 hover:text-cyan-400 hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] hover:scale-110 transition-all active:scale-90">
            <Maximize2 size={18} />
          </button>
        </div>
      </div>

      {/* 2. MOBILE MINI PLAYER (GLASSMORPHISM) */}
      {!isExpanded && (
        <div 
          className="md:hidden fixed bottom-20 left-4 right-4 h-16 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-2xl z-50 flex items-center px-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden"
          onClick={() => setIsExpanded(true)}
        >
          {/* Progress bar tipis di atas mini player */}
          <div className="absolute top-0 left-0 h-[2px] bg-cyan-500/80 shadow-[0_0_5px_rgba(34,211,238,0.5)]" style={{ width: `${progress}%` }} />
          
          <img src={track.cover_url} className="w-10 h-10 rounded-lg object-cover mr-3 shadow-md" />
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-bold truncate">{track.title}</p>
            <p className="text-cyan-400/80 text-[11px] font-medium truncate">{track.artist}</p>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onTogglePlay(); }} className="p-3 text-white hover:text-cyan-400 transition-colors">
            {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
          </button>
        </div>
      )}

      {/* 3. MOBILE EXPANDED PLAYER + LYRICS (APPLE MUSIC STYLE) */}
      <div className={`md:hidden fixed inset-0 z-[100] flex flex-col transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) ${isExpanded ? "translate-y-0" : "translate-y-full"}`}>
        
        {/* Dynamic Ambient Background Khusus Mobile */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img src={track.cover_url} className="absolute inset-0 w-full h-full object-cover blur-[80px] opacity-50 scale-125" />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-2xl" />
        </div>

        {/* Konten Mobile Player */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center px-6 pt-12 pb-4">
            <button onClick={() => setIsExpanded(false)} className="p-2 -ml-2 text-white/50 hover:text-white"><ChevronDown size={28} /></button>
            <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold drop-shadow-md">Now Playing</span>
            <button onClick={onZenMode} className="p-2 -mr-2 text-white/50 hover:text-white"><Maximize2 size={20} /></button>
          </div>

          {/* Lyric Section (Smooth Apple Music Style) */}
          <div 
            className="flex-1 overflow-y-auto px-8 py-10 space-y-8 scrollbar-hide"
            style={{ maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)' }}
          >
            {track.lyrics?.map((line, index) => {
              const isActive = index === activeIndex;
              const isPassed = index < activeIndex;

              return (
                <p
                  key={index}
                  id={`mobile-lyric-${index}`}
                  className={`text-2xl font-black transition-all duration-700 tracking-tight leading-[1.3] ${
                    isActive 
                      ? "text-white scale-[1.02] origin-left drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
                      : isPassed
                        ? "text-white/40 scale-100 blur-[0.5px]" 
                        : "text-white/20 scale-95 blur-[1px]"
                  }`}
                >
                  {line.text}
                </p>
              );
            })}
          </div>

          {/* Footer Controls */}
          <div className="p-8 pt-4 pb-12 bg-gradient-to-t from-[#010103] via-[#010103]/90 to-transparent">
            
            {/* Info Track */}
            <div className="flex items-center gap-4 mb-8">
              <img src={track.cover_url} className="w-16 h-16 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/10" />
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-black text-xl truncate tracking-tight drop-shadow-md">{track.title}</h3>
                <p className="text-cyan-400 font-medium text-sm drop-shadow-md">{track.artist}</p>
              </div>
              <button onClick={() => setIsRainy(!isRainy)} className={`p-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 transition-all ${isRainy ? "text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]" : "text-white/40"}`}>
                <CloudRain size={20} className={isRainy ? "animate-pulse" : ""} />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="group h-4 relative flex items-center mb-2" onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              onSeek(((e.clientX - rect.left) / rect.width) * 100);
            }}>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden transition-all group-hover:h-2">
                <div className="h-full bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)]" style={{ width: `${progress}%` }} />
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-8 px-1">
              <span className="text-[10px] font-mono text-white/40">{formatTime(currentTime)}</span>
              <span className="text-[10px] font-mono text-white/40">{formatTime(duration)}</span>
            </div>

            {/* Main Buttons */}
            <div className="flex justify-center items-center gap-10">
              <button onClick={onPrev} className="text-white/60 hover:text-white active:scale-90 transition-all"><SkipBack size={32} fill="currentColor" /></button>
              
              <button 
                onClick={onTogglePlay} 
                className="w-20 h-20 bg-cyan-500 hover:bg-cyan-400 rounded-full flex items-center justify-center text-black shadow-[0_0_30px_rgba(34,211,238,0.5)] active:scale-90 transition-all duration-300"
              >
                {isPlaying ? <Pause size={32} fill="black" /> : <Play size={32} fill="black" className="ml-2" />}
              </button>
              
              <button onClick={onNext} className="text-white/60 hover:text-white active:scale-90 transition-all"><SkipForward size={32} fill="currentColor" /></button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}