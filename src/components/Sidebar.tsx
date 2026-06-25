import { Radio, Calendar, Search, Users, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  liveCount?: number;
}

export default function Sidebar({ activeSection, setActiveSection, liveCount }: SidebarProps) {
  const menuItems = [
    { id: "live", label: "Live Now", icon: Radio, count: liveCount ? String(liveCount) : undefined },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "channels", label: "Spotlight", icon: Users },
    { id: "search", label: "Search", icon: Search },
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <aside className="w-64 bg-brand-bg border-r border-[#1a1a24] h-screen flex flex-col justify-between fixed left-0 top-0 z-30 hidden md:flex">
      {/* Brand Header */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-coral flex items-center justify-center shadow-lg shadow-brand-coral/20">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-white tracking-wider flex items-center gap-2">
              HoloWatch
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-coral opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-coral"></span>
              </span>
            </h1>
            <p className="text-xs text-gray-400 font-sans mt-0.5">VTuber Hub</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="px-4 py-2 flex-1">
        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-3 mb-4 font-mono">
          Navigation
        </p>
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-left group relative ${
                  isActive
                    ? "bg-[#7c5cbf]/20 text-[#7c5cbf] font-semibold"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {/* Active Sidebar Indicator bar */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-3 bottom-3 w-1 bg-brand-coral rounded-r-md"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                <div className="flex items-center gap-3">
                  <IconComponent
                    className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                      isActive ? "text-[#7c5cbf]" : "text-gray-400 group-hover:text-brand-purple"
                    }`}
                  />
                  <span className="font-sans text-sm">{item.label}</span>
                </div>

                {item.count && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-brand-coral/10 text-brand-coral border border-brand-coral/20">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Stats Card / Featured talent */}
      <div className="p-4 mx-4 mb-6 rounded-xl bg-[#1a1a24] border border-white/5">
        <p className="text-xs text-gray-500 uppercase font-bold mb-2.5 font-mono tracking-wider">
          User Stats
        </p>
        <div className="space-y-2 text-xs font-sans">
          <div className="flex justify-between items-center text-gray-400">
            <span>Watch Time</span>
            <span className="text-[#7c5cbf] font-bold font-mono">128h</span>
          </div>
          <div className="flex justify-between items-center text-gray-400">
            <span>Favorites</span>
            <span className="text-brand-coral font-bold font-mono">Suisei, Gura</span>
          </div>
          <div className="flex justify-between items-center text-gray-400">
            <span>Status</span>
            <span className="text-emerald-400 font-bold">Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
