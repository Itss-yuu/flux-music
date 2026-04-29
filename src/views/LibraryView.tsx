import { Heart, Library, Music, PlayCircle } from "lucide-react";
import { Track } from "../services/api";
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
    <div className="space-y-10">
      {/* HEADER SECTION WITH STATS */}
      <header className="relative overflow-hidden p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 border border-white/5 shadow-2xl">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-[2px] bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400">
              Personal Vault
            </span>
          </div>
          
          <GlitchText
            text="Your Library"
            className="text-4xl md:text-7xl font-black text-white tracking-tighter"
          />

          <div className="flex items-center gap-6 pt-2">
            <div className="flex flex-col">
              <span className="text-white text-2xl font-black">{likedTracks.length}</span>
              <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Favorite Tracks</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex flex-col">
              <span className="text-white text-2xl font-black">{Math.ceil(likedTracks.length * 3.4)}</span>
              <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Minutes of Joy</span>
            </div>
          </div>
        </div>

        {/* Ambient Glows Inside Header */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/5 blur-[100px] -ml-20 -mb-20" />
      </header>

      {/* CONTENT AREA */}
      <section>
        {likedTracks.length === 0 ? (
          /* PREMIUM EMPTY STATE */
          <div className="flex flex-col items-center justify-center py-32 space-y-6 animate-in fade-in zoom-in duration-700">
            <div className="relative group">
              <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
              <div className="relative w-24 h-24 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-2xl group-hover:border-cyan-500/50 transition-colors">
                <Heart size={40} className="text-white/10 group-hover:text-cyan-400 group-hover:scale-110 transition-all duration-500" />
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="text-white font-black text-2xl tracking-tighter">Your vault is empty</h3>
              <p className="text-white/30 text-sm max-w-xs mx-auto font-medium">
                Simpan lagu yang lu suka dengan klik ikon heart. Mereka bakal nunggu lu di sini.
              </p>
            </div>

            <button 
              onClick={() => window.location.hash = '#home'} // Atau trigger navigasi ke home
              className="px-8 py-3 bg-white text-black text-xs font-black uppercase tracking-widest rounded-full hover:bg-cyan-400 transition-all hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
            >
              Explore Tracks
            </button>
          </div>
        ) : (
          /* LIKED TRACKS GRID */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
            {likedTracks.map((track, index) => (
              <div 
                key={track.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-700"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <MusicCard
                  track={track}
                  isPlaying={currentTrack?.id === track.id}
                  isLiked={true}
                  onPlay={onPlay}
                  onToggleLike={onToggleLike}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}