import { useState, useCallback, useEffect } from "react";
import Sidebar, { View } from "./components/Sidebar";
import PlayerBar from "./components/PlayerBar";
import CustomCursor from "./components/CustomCursor";
import ZenMode from "./components/ZenMode";
import HomeView from "./views/HomeView";
import SearchView from "./views/SearchView";
import RadioView from "./views/RadioView";
import LibraryView from "./views/LibraryView";
import AuthView from "./views/AuthView"; 
import { supabase } from "./services/supabase"; 
import { useAudioPlayer } from "./hooks/useAudioPlayer";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { Track, fetchTracks } from "./services/api"; 
import { Loader2 } from "lucide-react";

function App() {
  const [session, setSession] = useState<any>(null);
  const [activeView, setActiveView] = useState<View>("home");
  const [likedIds, setLikedIds] = useState<number[]>([]);
  const [playlists, setPlaylists] = useLocalStorage<string[]>("flux-playlists", ["Cyber-Synth", "Lo-fi Coding"]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [zenMode, setZenMode] = useState(false);

  const player = useAudioPlayer(tracks);

  // 1. MONITOR AUTH
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  // 2. FETCH TRACKS
  useEffect(() => {
    fetchTracks().then((data) => {
      setTracks(data);
      setLoading(false);
    });
  }, []);

  // 3. SYNC LIKES
  useEffect(() => {
    if (session?.user) {
      const fetchLikes = async () => {
        const { data } = await supabase
          .from('likes')
          .select('track_id')
          .eq('user_id', session.user.id);
        if (data) setLikedIds(data.map((item: any) => item.track_id));
      };
      fetchLikes();
    } else {
      setLikedIds([]);
    }
  }, [session]);

  // 4. HANDLERS
  const toggleLike = useCallback(async (id: number) => {
    if (!session?.user) return;
    const isLiked = likedIds.includes(id);
    if (isLiked) {
      const { error } = await supabase.from('likes').delete().match({ user_id: session.user.id, track_id: id });
      if (!error) setLikedIds(prev => prev.filter(x => x !== id));
    } else {
      const { error } = await supabase.from('likes').insert([{ user_id: session.user.id, track_id: id }]);
      if (!error) setLikedIds(prev => [...prev, id]);
    }
  }, [session, likedIds]);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
  }, []);

  const handleAddPlaylist = useCallback(() => {
    const name = prompt("New Playlist Name:");
    if (name?.trim()) setPlaylists(prev => [...prev, name]);
  }, [setPlaylists]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#010103] flex items-center justify-center text-cyan-400">
        <Loader2 className="animate-spin mr-2" /> INITIALIZING NEURAL LINK...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#010103] flex items-center justify-center p-6">
        <CustomCursor />
        <AuthView />
      </div>
    );
  }

  const renderView = () => {
    const viewProps = { 
      tracks, 
      currentTrack: player.currentTrack, 
      likedIds, 
      onPlay: (t: Track) => player.playTrack(t), 
      onToggleLike: toggleLike 
    };
    switch (activeView) {
      case "home": return <HomeView {...viewProps} />;
      case "search": return <SearchView {...viewProps} />;
      case "library": return <LibraryView {...viewProps} />;
      case "radio": return <RadioView {...viewProps} isRadioActive={false} onToggleRadio={() => {}} />;
      default: return <HomeView {...viewProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#010103] text-white overflow-hidden cursor-none">
      <CustomCursor />
      {!zenMode && (
        <>
          <Sidebar 
            activeView={activeView} 
            onViewChange={setActiveView} 
            playlists={playlists} 
            onAddPlaylist={handleAddPlaylist}
            userEmail={session?.user?.email}
            onLogout={handleLogout}
          />
          <main className="ml-16 md:ml-64 min-h-screen relative z-10 p-4 md:p-10 pb-36 animate-in fade-in duration-700">
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
      {zenMode && player.currentTrack && (
        <ZenMode track={player.currentTrack} currentTime={player.currentTime} onClose={() => setZenMode(false)} />
      )}
    </div>
  );
}

export default App;