import { Library } from "lucide-react";
import { Track } from "../data/tracks";
import MusicCard from "../components/MusicCard";
import GlitchText from "../components/GlitchText";

interface LibraryViewProps {
  tracks: Track[];
  currentTrack: Track | null;
  likedIds: number[];
  onPlay: (track: Track) => void;
  onToggleLike: (id: number) => void;
}

export default function LibraryView({
  tracks,
  currentTrack,
  likedIds,
  onPlay,
  onToggleLike,
}: LibraryViewProps) {
  const likedTracks = tracks.filter((t) => likedIds.includes(t.id));

  return (
    <div className="animate-fadeIn">
      <GlitchText
        text="Library"
        className="text-3xl md:text-4xl font-bold text-white mb-8"
      />

      {likedTracks.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Library size={28} className="text-gray-600" />
          </div>
          <p className="text-gray-400 text-lg">No liked tracks yet</p>
          <p className="text-gray-600 text-sm mt-2">
            Heart your favorite tracks to see them here
          </p>
        </div>
      ) : (
        <>
          <p className="text-gray-500 text-sm mb-4">
            {likedTracks.length} liked track{likedTracks.length !== 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {likedTracks.map((track) => (
              <MusicCard
                key={track.id}
                track={track}
                isPlaying={currentTrack?.id === track.id}
                isLiked={true}
                onPlay={onPlay}
                onToggleLike={onToggleLike}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
