import { Heart, Play } from "lucide-react";
import { Track } from "../services/api";

interface MusicCardProps {
  track: Track;
  isPlaying: boolean;
  isLiked: boolean;
  onPlay: (track: Track) => void;
  onToggleLike: (id: number) => void;
}

export default function MusicCard({
  track,
  isPlaying,
  isLiked,
  onPlay,
  onToggleLike,
}: MusicCardProps) {
  
  const formatDuration = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] cursor-pointer"
      onClick={() => onPlay(track)}
    >
      {/* CSS Animasi Custom buat Equalizer */}
      <style>{`
        @keyframes equalize {
          0%, 100% { height: 4px; }
          50% { height: 14px; }
        }
        .eq-bar {
          width: 3px;
          background-color: #22d3ee; /* cyan-400 */
          border-radius: 9999px;
        }
        .eq-1 { animation: equalize 0.8s ease-in-out infinite; }
        .eq-2 { animation: equalize 1.2s ease-in-out infinite; }
        .eq-3 { animation: equalize 0.9s ease-in-out infinite; }
        .eq-4 { animation: equalize 1.1s ease-in-out infinite; }
      `}</style>

      {/* Cover Image Section */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={track.cover_url}
          alt={track.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#010103]/90 via-[#010103]/20 to-transparent opacity-60" />

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
          <div className="w-14 h-14 rounded-full bg-cyan-500 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-transform duration-200 hover:scale-110">
            <Play size={24} fill="black" className="text-black ml-1" />
          </div>
        </div>

        {/* --- TAHAP 2: ANIMASI EQUALIZER --- */}
        {isPlaying && (
          <div className="absolute top-3 left-3 px-2.5 py-1.5 rounded-md bg-black/60 backdrop-blur-md border border-cyan-500/30 flex items-end justify-center gap-[3px] h-6 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
            <div className="eq-bar eq-1" />
            <div className="eq-bar eq-2" />
            <div className="eq-bar eq-3" />
            <div className="eq-bar eq-4" />
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike(track.id);
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-90"
        >
          <Heart
            size={16}
            className={`transition-all duration-300 ${
              isLiked
                ? "text-cyan-400 fill-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                : "text-white/70 hover:text-white"
            }`}
          />
        </button>
      </div>

      {/* Info Section */}
      <div className="p-4">
        <h3 className="text-white font-bold text-sm truncate tracking-tight group-hover:text-cyan-400 transition-colors">
          {track.title}
        </h3>
        <p className="text-white/50 text-xs mt-1 truncate font-medium">
          {track.artist}
        </p>
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-[9px] px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 font-bold uppercase tracking-widest border border-cyan-500/20">
            {track.genre}
          </span>
          <span className="text-[10px] text-white/30 font-mono">
            {formatDuration(track.duration)}
          </span>
        </div>
      </div>
    </div>
  );
}