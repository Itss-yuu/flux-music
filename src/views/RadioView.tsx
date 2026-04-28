import { Radio, Shuffle } from "lucide-react";
import { Track } from "../data/tracks";
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
    <div className="animate-fadeIn">
      <GlitchText
        text="Radio"
        className="text-3xl md:text-4xl font-bold text-white mb-8"
      />

      <div className="relative mb-10 rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-500/10 via-[#010103]/40 to-blue-600/10 border border-white/10 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col items-center text-center">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-500 ${
              isRadioActive
                ? "bg-cyan-500 shadow-[0_0_40px_rgba(0,255,255,0.4)] animate-pulse"
                : "bg-white/10"
            }`}
          >
            <Radio size={32} className={isRadioActive ? "text-black" : "text-gray-400"} />
          </div>
          <h2 className="text-white text-2xl font-bold mb-2">Flux Radio</h2>
          <p className="text-gray-400 text-sm mb-6 max-w-md">
            {isRadioActive
              ? "Radio is live. Enjoying random tracks from the database."
              : "Start the radio to shuffle through all tracks continuously."}
          </p>
          <button
            onClick={onToggleRadio}
            className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-sm transition-all duration-300 cursor-pointer pointer-events-auto ${
              isRadioActive
                ? "bg-white/10 text-cyan-400 border border-cyan-500/30 hover:bg-white/15"
                : "bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.3)]"
            }`}
          >
            <Shuffle size={16} />
            {isRadioActive ? "Stop Radio" : "Start Radio"}
          </button>
        </div>
      </div>

      <h2 className="text-white text-lg font-semibold mb-4">Available Tracks</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {tracks.map((track) => (
          <MusicCard
            key={track.id}
            track={track}
            isPlaying={currentTrack?.id === track.id}
            isLiked={likedIds.includes(track.id)}
            onPlay={onPlay}
            onToggleLike={onToggleLike}
          />
        ))}
      </div>
    </div>
  );
}
