import { useState, useCallback, useEffect } from "react";
import Sidebar, { View } from "./components/Sidebar";
import PlayerBar from "./components/PlayerBar";
import CustomCursor from "./components/CustomCursor";
import ZenMode from "./components/ZenMode";
import HomeView from "./views/HomeView";
import SearchView from "./views/SearchView";
import RadioView from "./views/RadioView";
import LibraryView from "./views/LibraryView";
import { useAudioPlayer } from "./hooks/useAudioPlayer";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { Track, fetchTracks } from "./services/api"; 
import { Loader2 } from "lucide-react";

function App() {
  const [activeView, setActiveView] = useState<View>("home");
  const [likedIds, setLikedIds] = useLocalStorage<number[]>("flux-liked", []);
  const [isRadioActive, setIsRadioActive] = useState(false);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zenMode, setZenMode] = useState(false);

  const player = useAudioPlayer(tracks);

  useEffect(() => {
    fetchTracks()
      .then((data) => {
        setTracks(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const toggleLike = useCallback(
    (id: number) => {
      setLikedIds((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
    },
    [setLikedIds]
  );

  const toggleRadio = useCallback(() => {
    setIsRadioActive((prev) => !prev);  
  }, []);

  useEffect(() => {
    if (!isRadioActive) return;
    const interval = setInterval(() => {
      if (!player.isPlaying && player.currentTrack) {
        player.playRandom();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isRadioActive, player]);

  const handlePlay = useCallback(
    (track: Track) => {
      player.playTrack(track);
      if (isRadioActive) setIsRadioActive(false);
    },
    [player, isRadioActive]
  );

  // KEYBOARD SHORTCUTS
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement?.tagName;
      if (activeElement === 'INPUT' || activeElement === 'TEXTAREA') return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          player.togglePlay();
          break;
        case 'KeyZ':
          setZenMode((prev) => !prev);
          break;
        case 'ArrowRight':
          player.playNext();
          break;
        case 'ArrowLeft':
          player.playPrev();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [player]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#010103] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="text-cyan-400 animate-spin" />
          <p className="text-gray-500 text-sm font-medium tracking-widest uppercase">Loading Flux Music...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#010103] flex items-center justify-center text-center">
        <div>
          <p className="text-red-400 text-lg font-bold">Error Connection</p>
          <p className="text-gray-600 text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const renderView = () => {
    const viewProps = {
      tracks,
      currentTrack: player.currentTrack,
      likedIds,
      onPlay: handlePlay,
      onToggleLike: toggleLike,
    };

    switch (activeView) {
      case "home": return <HomeView {...viewProps} />;
      case "search": return <SearchView {...viewProps} />;
      case "library": return <LibraryView {...viewProps} />;
      case "radio": return <RadioView {...viewProps} isRadioActive={isRadioActive} onToggleRadio={toggleRadio} />;
      default: return <HomeView {...viewProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#010103] text-white overflow-hidden cursor-none">
      <CustomCursor />

      {/* --- TAHAP 1: DYNAMIC AMBIENT BACKGROUND --- */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-all duration-1000">
        {player.currentTrack ? (
          <>
            {/* Gambar cover diblur ekstrem buat ambient */}
            <img
              src={player.currentTrack.cover_url}
              alt="ambient blur"
              key={player.currentTrack.id} // Key penting biar transisi gambarnya kerestart mulus
              className="absolute inset-0 w-full h-full object-cover blur-[120px] scale-125 opacity-40 transition-all duration-1000"
            />
            {/* Layer penutup (Glassmorphism) biar konten tetep kebaca */}
            <div className="absolute inset-0 bg-[#010103]/60 backdrop-blur-3xl transition-colors duration-1000" />
          </>
        ) : (
          <>
            {/* Fallback default kalau belum ada lagu yang diputar */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px]" />
          </>
        )}
      </div>

      {!zenMode && (
        <>
          <Sidebar activeView={activeView} onViewChange={setActiveView} />
          <main className="ml-16 md:ml-56 p-4 md:p-8 pb-28 relative z-10 min-h-screen">
            {renderView()}
          </main>
          <PlayerBar
            track={player.currentTrack}
            isPlaying={player.isPlaying}
            progress={player.progress}
            volume={player.volume}
            currentTime={player.currentTime}
            duration={player.duration}
            onTogglePlay={player.togglePlay}
            onNext={player.playNext}
            onPrev={player.playPrev}
            onSeek={player.seekTo}
            onVolumeChange={player.setVolume}
            onZenMode={() => setZenMode(true)}
          />
        </>
      )}

      {/* ZEN MODE 2.0 - DENGAN DUKUNGAN LIRIK SINKRON */}
      {zenMode && player.currentTrack && (
        <ZenMode
          track={player.currentTrack}
          currentTime={player.currentTime}
          onClose={() => setZenMode(false)}
        />
      )}
    </div>
  );
}

export default App;