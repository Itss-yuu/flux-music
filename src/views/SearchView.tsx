import { useState } from "react";
import { Search } from "lucide-react";
import { Track } from "../data/tracks";
import MusicCard from "../components/MusicCard";
import GlitchText from "../components/GlitchText";

interface SearchViewProps {
  tracks: Track[];
  currentTrack: Track | null;
  likedIds: number[];
  onPlay: (track: Track) => void;
  onToggleLike: (id: number) => void;
}

export default function SearchView({
  tracks,
  currentTrack,
  likedIds,
  onPlay,
  onToggleLike,
}: SearchViewProps) {
  const [query, setQuery] = useState("");

  const filtered = tracks.filter(
    (t) =>
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.artist.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="animate-fadeIn">
      <GlitchText
        text="Search"
        className="text-3xl md:text-4xl font-bold text-white mb-8"
      />

      <div className="relative mb-8">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tracks or artists..."
          className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_20px_rgba(0,255,255,0.1)] transition-all pointer-events-auto"
        />
      </div>

      {query && (
        <p className="text-gray-500 text-sm mb-4">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &quot;{query}&quot;
        </p>
      )}

      {filtered.length === 0 && query ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No tracks found</p>
          <p className="text-gray-600 text-sm mt-2">Try a different search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((track) => (
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
      )}
    </div>
  );
}
