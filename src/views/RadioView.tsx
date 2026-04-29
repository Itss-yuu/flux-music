import { Radio, Shuffle, Activity, Wifi, Zap } from "lucide-react";
import { Track } from "../services/api";
import MusicCard from "../components/MusicCard";
import GlitchText from "../components/GlitchText";

interface RadioViewProps {
  tracks: Track[];
  currentTrack: Track | null;
  isRadioActive: boolean;
  likedIds: number[];
  onPlay: (track: Track) => void;
  onToggleLike: (id: number) => void;
  onToggleRadio: () => void;
}

export default function RadioView({
  tracks,
  currentTrack,
  isRadioActive,
  likedIds,
  onPlay,
  onToggleLike,
  onToggleRadio,
}: RadioViewProps) {
  return (
    <div className="space-y-12">
      {/* HEADER SECTION */}
      <header className="space-y-2">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-[2px] shadow-[0_0_10px_rgba(34,211,238,0.8)] transition-all duration-500 ${isRadioActive ? "bg-cyan-400 w-12" : "bg-white/20"}`} />
          <span className={`text-[10px] font-black uppercase tracking-[0.4em] transition-colors duration-500 ${isRadioActive ? "text-cyan-400" : "text-white/20"}`}>
            {isRadioActive ? "Broadcasting Live" : "Signal Offline"}
          </span>
        </div>
        <GlitchText
          text="Radio Station"
          className="text-4xl md:text-6xl font-black text-white tracking-tighter"
        />
      </header>

      {/* MAIN RADIO CONSOLE */}
      <section className="relative overflow-hidden rounded-[3rem] bg-[#050507] border border-white/5 p-8 md:p-20 shadow-2xl">
        {/* Animated Background Grids */}
        <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] [background-size:40px_40px]" />
        
        <div className="relative z-10 flex flex-col items-center">
          {/* THE PULSE CORE VISUALIZER */}
          <div className="relative mb-12">
            {/* Outer Pulsing Rings */}
            {isRadioActive && (
              <>
                <div className="absolute inset-0 rounded-full bg-cyan-500/20 animate-ping" />
                <div className="absolute -inset-8 rounded-full border border-cyan-500/10 animate-[pulse_3s_infinite]" />
                <div className="absolute -inset-16 rounded-full border border-cyan-500/5 animate-[pulse_4s_infinite]" />
              </>
            )}

            {/* Core Circle */}
            <div
              className={`relative w-32 h-32 md:w-44 md:h-44 rounded-full flex items-center justify-center border-4 transition-all duration-700 ${
                isRadioActive
                  ? "bg-cyan-500 border-cyan-300 shadow-[0_0_60px_rgba(34,211,238,0.4)] scale-110"
                  : "bg-white/5 border-white/10 grayscale"
              }`}
            >
              <Radio 
                size={isRadioActive ? 56 : 48} 
                className={`transition-all duration-700 ${isRadioActive ? "text-black rotate-12" : "text-white/10"}`} 
              />
              
              {/* Spinning Ring */}
              {isRadioActive && (
                <div className="absolute inset-0 rounded-full border-t-4 border-black/20 animate-spin" />
              )}
            </div>
          </div>

          {/* BROADCAST INFO */}
          <div className="text-center space-y-4 max-w-lg">
            <div className="flex justify-center gap-4 text-white/20 mb-2">
              <div className="flex items-center gap-1">
                <Wifi size={14} className={isRadioActive ? "text-cyan-400" : ""} />
                <span className="text-[10px] font-bold tracking-widest uppercase">88.5 FM</span>
              </div>
              <div className="flex items-center gap-1">
                <Activity size={14} className={isRadioActive ? "text-cyan-400" : ""} />
                <span className="text-[10px] font-bold tracking-widest uppercase">Auto-Sync</span>
              </div>
            </div>

            <h2 className={`text-2xl md:text-4xl font-black tracking-tighter transition-colors duration-500 ${isRadioActive ? "text-white" : "text-white/20"}`}>
              {isRadioActive ? "NEURAL NETWORK ACTIVE" : "STATION STANDBY"}
            </h2>
            
            <p className="text-white/30 text-sm md:text-base font-medium leading-relaxed">
              {isRadioActive
                ? "Algoritma Flux sedang memilihkan lagu terbaik berdasarkan mood global secara real-time."
                : "Aktifkan Radio untuk masuk ke mode putar tanpa henti. Flux akan memilihkan lagu secara acak."}
            </p>

            {/* NEON TOGGLE BUTTON */}
            <div className="pt-6">
              <button
                onClick={onToggleRadio}
                className={`group relative flex items-center gap-3 px-10 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 active:scale-95 ${
                  isRadioActive
                    ? "bg-white/5 text-cyan-400 border border-cyan-400/50 hover:bg-cyan-400/10"
                    : "bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.2)] hover:bg-cyan-400"
                }`}
              >
                <Zap size={16} className={isRadioActive ? "animate-pulse" : "fill-black"} />
                {isRadioActive ? "Shutdown Core" : "Initialize Link"}
                
                {/* Button Glow Effect */}
                {!isRadioActive && (
                  <div className="absolute inset-0 rounded-full bg-white blur-xl opacity-0 group-hover:opacity-20 transition-opacity" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Decorative Corner Text */}
        <div className="absolute bottom-6 right-10 hidden md:block">
          <p className="text-[10px] font-black text-white/5 tracking-[0.5em] uppercase -rotate-90 origin-right">
            Flux Audio Protocol // v2.0
          </p>
        </div>
      </section>

      {/* TRACK LISTING SECTION */}
      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <h2 className="text-xl md:text-3xl font-black text-white tracking-tighter uppercase italic">
            Station Playlist
          </h2>
          <div className="h-px flex-1 bg-white/5" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8 opacity-60 hover:opacity-100 transition-opacity duration-500">
          {tracks.map((track, index) => (
            <div 
              key={track.id}
              className="animate-in fade-in slide-in-from-bottom-4 duration-700"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <MusicCard
                track={track}
                isPlaying={currentTrack?.id === track.id}
                isLiked={likedIds.includes(track.id)}
                onPlay={onPlay}
                onToggleLike={onToggleLike}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}