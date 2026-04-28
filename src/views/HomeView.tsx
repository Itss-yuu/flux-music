import { Track } from "../data/tracks";
import MusicCard from "../components/MusicCard";
import GlitchText from "../components/GlitchText";

interface HomeViewProps {
  tracks: Track[];
  currentTrack: Track | null;
  likedIds: number[];
  onPlay: (track: Track) => void;
  onToggleLike: (id: number) => void;
}

export default function HomeView({
  tracks,
  currentTrack,
  likedIds,
  onPlay,
  onToggleLike,
}: HomeViewProps) {
  const featured = tracks.find((t) => t.is_featured) || tracks[0];
  const rest = tracks.filter((t) => t.id !== featured?.id);

  return (
    <div className="animate-fadeIn">
      <GlitchText
        text="Home"
        className="text-3xl md:text-4xl font-bold text-white mb-8"
      />

      {featured && (
        <div
          className="relative mb-10 rounded-2xl overflow-hidden cursor-pointer pointer-events-auto group"
          onClick={() => onPlay(featured)}
        >
          <img
            src={featured.cover_url}
            alt={featured.title}
            className="w-full h-48 md:h-72 object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#010103]/90 via-[#010103]/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 md:p-8">
            <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">
              Featured
            </span>
            <h2 className="text-white text-2xl md:text-4xl font-bold mt-2">
              {featured.title}
            </h2>
            <p className="text-gray-300 mt-1">{featured.artist}</p>
          </div>
          <div className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-cyan-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-[0_0_25px_rgba(0,255,255,0.4)]">
            <svg
              className="w-6 h-6 text-black ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      <h2 className="text-white text-lg font-semibold mb-4">All Tracks</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {rest.map((track) => (
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
