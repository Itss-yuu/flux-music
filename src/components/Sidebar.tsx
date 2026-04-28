import { Home, Search, Radio, Library } from "lucide-react";

export type View = "home" | "search" | "radio" | "library";

interface SidebarProps {
  activeView: View;
  onViewChange: (view: View) => void;
}

const menuItems: { view: View; label: string; icon: React.ReactNode }[] = [
  { view: "home", label: "Home", icon: <Home size={20} /> },
  { view: "search", label: "Search", icon: <Search size={20} /> },
  { view: "radio", label: "Radio", icon: <Radio size={20} /> },
  { view: "library", label: "Library", icon: <Library size={20} /> },
];

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-full w-16 md:w-56 bg-black/60 backdrop-blur-xl border-r border-white/5 z-40 flex flex-col pointer-events-auto">
      <div className="p-4 md:px-6 md:py-8 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center flex-shrink-0">
          <span className="text-black font-bold text-sm">F</span>
        </div>
        <span className="hidden md:block text-white font-bold text-lg tracking-wider">
          FLUX
        </span>
      </div>

      <nav className="flex-1 px-2 md:px-3 mt-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.view}
            onClick={() => onViewChange(item.view)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer pointer-events-auto group ${
              activeView === item.view
                ? "bg-cyan-500/15 text-cyan-400"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <span className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
              {item.icon}
            </span>
            <span className="hidden md:block text-sm font-medium">
              {item.label}
            </span>
            {activeView === item.view && (
              <span className="hidden md:block ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(0,255,255,0.6)]" />
            )}
          </button>
        ))}
      </nav>

      <div className="p-3 md:p-4 border-t border-white/5">
        <div className="hidden md:block text-[10px] text-gray-600 text-center">
          FLUX MUSIC v1.0
        </div>
      </div>
    </aside>
  );
}
