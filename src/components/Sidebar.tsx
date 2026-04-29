import { Home, Search, Radio, Library, Plus, Settings, Music2, LogOut } from "lucide-react";

export type View = "home" | "search" | "radio" | "library";

interface SidebarProps {
  activeView: View;
  onViewChange: (view: View) => void;
  playlists: string[];
  onAddPlaylist: () => void;
  userEmail?: string;
  onLogout: () => void;
}

const menuItems: { view: View; label: string; icon: any }[] = [
  { view: "home", label: "Home", icon: Home },
  { view: "search", label: "Search", icon: Search },
  { view: "radio", label: "Radio", icon: Radio },
  { view: "library", label: "Library", icon: Library },
];

export default function Sidebar({ activeView, onViewChange, playlists, onAddPlaylist, userEmail, onLogout }: SidebarProps) {
  // Ambil inisial dan username dari email
  const displayName = userEmail ? userEmail.split('@')[0] : "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <aside className="fixed left-0 top-0 h-full w-16 md:w-64 bg-black/40 backdrop-blur-3xl border-r border-white/10 z-40 flex flex-col pointer-events-auto transition-all duration-500">
      
      {/* LOGO */}
      <div className="p-4 md:px-8 md:py-10 flex items-center gap-4 group">
        <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(34,211,238,0.5)] rotate-3">
          <span className="text-black font-black text-xl italic">F</span>
        </div>
        <span className="hidden md:block text-white font-black text-2xl tracking-[0.2em]">FLUX</span>
      </div>

      {/* NAVIGATION */}
      <nav className="px-3 md:px-4 mt-2 space-y-1">
        <p className="hidden md:block text-[10px] font-black text-white/20 uppercase tracking-[0.3em] px-4 mb-4">Main Menu</p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => onViewChange(item.view)}
              className={`w-full relative flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-500 group ${
                isActive ? "bg-cyan-500/10 text-cyan-400" : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className={`absolute left-0 top-1/4 bottom-1/4 w-1 bg-cyan-400 rounded-r-full transition-all duration-500 ${isActive ? "opacity-100" : "opacity-0"}`} />
              <Icon size={22} className={isActive ? "drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" : ""} />
              <span className="hidden md:block text-sm font-bold tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* PLAYLISTS */}
      <div className="hidden md:flex flex-col flex-1 px-4 mt-10 overflow-hidden">
        <div className="flex items-center justify-between px-4 mb-4">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Your Playlists</p>
          <button onClick={onAddPlaylist} className="p-1 hover:bg-white/10 rounded-lg text-white/40 hover:text-cyan-400 transition-all">
            <Plus size={16} />
          </button>
        </div>
        <div className="space-y-1 overflow-y-auto pr-2 scrollbar-hide">
          {playlists.map((plName, index) => (
            <button key={index} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all text-left group">
              <Music2 size={16} className="group-hover:text-cyan-400 transition-colors" />
              <span className="text-xs font-bold truncate tracking-tight">{plName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* USER PROFILE & LOGOUT */}
      <div className="mt-auto p-4 border-t border-white/5 bg-black/20">
        <div className="flex items-center gap-3 px-2 py-2">
          {/* Avatar Area */}
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-[2px]">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                <span className="text-cyan-400 font-black text-xs uppercase italic">{initial}</span>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#010103] rounded-full shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
          </div>
          
          {/* User Info */}
          <div className="hidden md:flex flex-col flex-1 overflow-hidden">
            <span className="text-white text-sm font-black truncate tracking-tighter capitalize">
              {displayName}
            </span>
            <span className="text-[9px] text-white/20 font-bold uppercase tracking-[0.2em]">
              Premium Member
            </span>
          </div>

          {/* Logout Button */}
          <button 
            onClick={onLogout}
            className="p-2 rounded-xl text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all group/logout"
            title="Log Out"
          >
            <LogOut size={18} className="group-hover/logout:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </aside>
  );
}