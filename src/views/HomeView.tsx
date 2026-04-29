import { Track } from "../services/api"; // Sesuaikan path jika perlu
import MusicCard from "../components/MusicCard";
import GlitchText from "../components/GlitchText";
import { Play, Star } from "lucide-react";

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
  // Cari lagu featured atau default ke yang pertama
  const featured = tracks.find((t) => t.is_featured) || tracks[0];
  const rest = tracks.filter((t) => t.id !== featured?.id);

  return (
    <div className="space-y-12">
      {/* HEADER SECTION */}
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-[2px] bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400">
            Discovery Mode
          </span>
        </div>
        <GlitchText
          text="Welcome back, Alex"
          className="text-4xl md:text-6xl font-black text-white tracking-tighter"
        />
        <p className="text-white/30 text-sm md:text-base font-medium">
          Dengerin lagi lagu favorit lu atau cari vibe baru hari ini.
        </p>
      </header>

      {/* FEATURED HERO SECTION (APPLE MUSIC STYLE) */}
      {featured && (
        <section 
          className="relative group cursor-pointer overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl transition-all duration-700 hover:border-cyan-500/30"
          onClick={() => onPlay(featured)}
        >
          {/* Background Ambient Blur Inside Hero */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative h-64 md:h-[400px] flex items-end overflow-hidden">
            {/* Image with Smooth Zoom */}
            <img
              src={featured.cover_url}
              alt={featured.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#010103] via-[#010103]/20 to-transparent" />

            {/* Hero Content */}
            <div className="relative p-8 md:p-12 w-full flex justify-between items-end">
              <div className="space-y-2 md:space-y-4">
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md w-fit px-3 py-1 rounded-full border border-white/10">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">Top Pick</span>
                </div>
                <div>
                  <h2 className="text-3xl md:text-6xl font-black text-white tracking-tighter drop-shadow-2xl">
                    {featured.title}
                  </h2>
                  <p className="text-lg md:text-2xl text-cyan-400 font-bold tracking-tight">
                    {featured.artist}
                  </p>
                </div>
              </div>

              {/* Massive Play Button */}
              <button className="hidden md:flex w-20 h-20 rounded-full bg-white text-black items-center justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-110 active:scale-95">
                <Play size={32} fill="black" className="ml-1" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* TRACK GRID SECTION */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-xl md:text-3xl font-black text-white tracking-tighter uppercase italic">
              All Tracks
            </h2>
            <div className="h-px w-20 md:w-40 bg-white/10" />
          </div>
          <button className="text-[10px] font-bold text-white/30 hover:text-cyan-400 uppercase tracking-widest transition-colors">
            View All
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
          {rest.map((track, index) => (
            <div 
              key={track.id} 
              className="animate-in fade-in slide-in-from-bottom-4 duration-700" 
              style={{ animationDelay: `${index * 50}ms` }}
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