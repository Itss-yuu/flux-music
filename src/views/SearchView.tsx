import { useState } from "react";
import { Search, X, Music, User, LayoutGrid } from "lucide-react";
import { Track } from "../services/api";
import MusicCard from "../components/MusicCard";
import GlitchText from "../components/GlitchText";

interface SearchViewProps {
  tracks: Track[];
  currentTrack: Track | null;
  likedIds: number[];
  onPlay: (track: Track) => void;
  onToggleLike: (id: number) => void;
}

type FilterType = "all" | "tracks" | "artists";

export default function SearchView({
  tracks,
  currentTrack,
  likedIds,
  onPlay,
  onToggleLike,
}: SearchViewProps) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const filtered = tracks.filter((t) => {
    const matchesQuery = 
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.artist.toLowerCase().includes(query.toLowerCase());
    
    // Logic filter tambahan jika kedepannya mau dipisah
    return matchesQuery;
  });

  const categories: { id: FilterType; label: string; icon: any }[] = [
    { id: "all", label: "All Results", icon: LayoutGrid },
    { id: "tracks", label: "Songs", icon: Music },
    { id: "artists", label: "Artists", icon: User },
  ];

  return (
    <div className="space-y-10">
      {/* HEADER & SEARCH BAR */}
      <section className="space-y-6">
        <header>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-[2px] bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400">
              Neural Search
            </span>
          </div>
          <GlitchText
            text="Search"
            className="text-4xl md:text-6xl font-black text-white tracking-tighter"
          />
        </header>

        {/* CYBER SEARCH INPUT */}
        <div className="relative group max-w-2xl">
          <div className="absolute inset-0 bg-cyan-500/5 blur-2xl rounded-2xl group-focus-within:bg-cyan-500/10 transition-all" />
          <div className="relative flex items-center">
            <Search
              size={20}
              className="absolute left-5 text-white/20 group-focus-within:text-cyan-400 transition-colors"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, artist, or vibe..."
              className="w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl pl-14 pr-12 py-5 text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 transition-all text-lg font-medium tracking-tight"
            />
            {query && (
              <button 
                onClick={() => setQuery("")}
                className="absolute right-5 p-1 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* QUICK FILTER CHIPS */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full border transition-all duration-300 whitespace-nowrap font-bold text-xs uppercase tracking-widest ${
                  isActive
                    ? "bg-cyan-500 border-cyan-400 text-black shadow-[0_0_15px_rgba(34,211,238,0.4)] scale-105"
                    : "bg-white/5 border-white/5 text-white/40 hover:border-white/20 hover:text-white"
                }`}
              >
                <Icon size={14} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* RESULTS AREA */}
      <section>
        {query && (
          <div className="flex items-center gap-4 mb-8">
            <h3 className="text-white/40 text-xs font-black uppercase tracking-[0.2em]">
              Showing {filtered.length} results for "{query}"
            </h3>
            <div className="h-px flex-1 bg-white/5" />
          </div>
        )}

        {filtered.length === 0 && query ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4 animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <Search size={32} className="text-white/20" />
            </div>
            <div className="text-center">
              <p className="text-white/60 font-bold text-xl tracking-tight">No matches found</p>
              <p className="text-white/20 text-sm">Check your spelling or try searching for another artist.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
            {filtered.map((track, index) => (
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
        )}

        {/* TOP SEARCHES (Optional - Muncul pas input kosong) */}
        {!query && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
            <div className="p-10 rounded-[2rem] bg-gradient-to-br from-cyan-500/10 to-transparent border border-white/5 flex flex-col justify-end h-48">
              <span className="text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-1">Trending</span>
              <h4 className="text-white text-2xl font-black tracking-tighter">Explore New Vibes</h4>
            </div>
            <div className="p-10 rounded-[2rem] bg-gradient-to-br from-purple-500/10 to-transparent border border-white/5 flex flex-col justify-end h-48">
              <span className="text-purple-400 text-[10px] font-black uppercase tracking-widest mb-1">Personalized</span>
              <h4 className="text-white text-2xl font-black tracking-tighter">Based on your mood</h4>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}