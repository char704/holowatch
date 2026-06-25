import { useState, useEffect, useCallback } from "react";
import { Radio, Calendar, Search, Users, Heart, Sparkles, Menu, X, Bell } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import Sidebar from "./components/Sidebar";
import LiveNowGrid from "./components/LiveNowGrid";
import UpcomingTimeline from "./components/UpcomingTimeline";
import ChannelSpotlight from "./components/ChannelSpotlight";
import VideoSearchSection from "./components/VideoSearchSection";
import StreamTheaterModal from "./components/StreamTheaterModal";
import { LoadingCard, ErrorCard } from "./components/SectionStatus";

import { Channel, LiveStream, ScheduleItem, VideoSearchResult } from "./types";
import {
  getLiveStreams,
  getUpcomingStreams,
  getChannels,
  searchVideos,
} from "./services/holodex";
import {
  mapChannel,
  mapLiveStream,
  mapScheduleItem,
  mapVideoSearchResult,
} from "./utils/holodexMappers";

interface ToastNotification {
  id: string;
  message: string;
  type: "info" | "success" | "reminder";
}

const LIVE_REFRESH_INTERVAL_MS = 60_000;

export default function App() {
  // Navigation State (active section)
  const [activeSection, setActiveSection] = useState<string>("live");

  // Live Holodex Data States
  const [channels, setChannels] = useState<Channel[]>([]);
  const [channelsLoading, setChannelsLoading] = useState(true);
  const [channelsError, setChannelsError] = useState<string | null>(null);

  const [liveStreams, setLiveStreams] = useState<LiveStream[]>([]);
  const [liveLoading, setLiveLoading] = useState(true);
  const [liveError, setLiveError] = useState<string | null>(null);

  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  const [videoSearchList, setVideoSearchList] = useState<VideoSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(true);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Spotlight and Theater States
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [activeTheaterStream, setActiveTheaterStream] = useState<LiveStream | null>(null);

  // Mobile Drawer State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Favorites, Subscriptions and Reminders States (Persisted in localStorage)
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("holowatch_favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const [subscribedChannels, setSubscribedChannels] = useState<string[]>(() => {
    const saved = localStorage.getItem("holowatch_subscriptions");
    return saved ? JSON.parse(saved) : [];
  });

  const [reminders, setReminders] = useState<string[]>(() => {
    const saved = localStorage.getItem("holowatch_reminders");
    return saved ? JSON.parse(saved) : [];
  });

  // Toast System State
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Fetch: Live Now streams (with auto-refresh every 60s)
  const fetchLiveStreams = useCallback(async () => {
    try {
      setLiveError(null);
      const data = await getLiveStreams();
      setLiveStreams(data.map(mapLiveStream));
    } catch (err) {
      setLiveError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLiveLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveStreams();
    const interval = setInterval(fetchLiveStreams, LIVE_REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchLiveStreams]);

  // Fetch: Upcoming schedule
  const fetchSchedule = useCallback(async () => {
    try {
      setScheduleLoading(true);
      setScheduleError(null);
      const data = await getUpcomingStreams();
      setScheduleItems(data.map(mapScheduleItem));
    } catch (err) {
      setScheduleError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setScheduleLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  // Fetch: Channel list (for spotlight)
  const fetchChannels = useCallback(async () => {
    try {
      setChannelsLoading(true);
      setChannelsError(null);
      const data = await getChannels();
      const mapped = data.map(mapChannel);
      setChannels(mapped);
      setSelectedChannel((prev) => prev ?? mapped[0] ?? null);
    } catch (err) {
      setChannelsError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setChannelsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  // Fetch: Video/clip search results
  const fetchVideoSearch = useCallback(async () => {
    try {
      setSearchLoading(true);
      setSearchError(null);
      const data = await searchVideos({ sort: "newest", target: ["video", "clip"] });
      setVideoSearchList(data.map(mapVideoSearchResult));
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideoSearch();
  }, [fetchVideoSearch]);

  // Sync state with localStorage
  useEffect(() => {
    localStorage.setItem("holowatch_favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("holowatch_subscriptions", JSON.stringify(subscribedChannels));
  }, [subscribedChannels]);

  useEffect(() => {
    localStorage.setItem("holowatch_reminders", JSON.stringify(reminders));
  }, [reminders]);

  // Toast trigger utility
  const showToast = (message: string, type: "info" | "success" | "reminder" = "info") => {
    const newToast: ToastNotification = {
      id: Math.random().toString(36).substr(2, 9),
      message,
      type,
    };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4000);
  };

  // Scroll spy logic to highlight current section as user manually scrolls
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["live", "schedule", "channels", "search"];
      const scrollPosition = window.scrollY + 180;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // State handlers
  const toggleFavorite = (channelId: string) => {
    const name = channels.find((c) => c.id === channelId)?.englishName || channelId;
    if (favorites.includes(channelId)) {
      setFavorites((prev) => prev.filter((id) => id !== channelId));
      showToast(`Removed ${name} from favorites`, "info");
    } else {
      setFavorites((prev) => [...prev, channelId]);
      showToast(`Added ${name} to favorites! ❤️`, "success");
    }
  };

  const toggleSubscribe = (channelId: string) => {
    const name = channels.find((c) => c.id === channelId)?.englishName || channelId;
    if (subscribedChannels.includes(channelId)) {
      setSubscribedChannels((prev) => prev.filter((id) => id !== channelId));
      showToast(`Unsubscribed from ${name}`, "info");
    } else {
      setSubscribedChannels((prev) => [...prev, channelId]);
      showToast(`Subscribed to ${name}! 🎉`, "success");
    }
  };

  const toggleReminder = (id: string) => {
    const item = scheduleItems.find((s) => s.id === id);
    const channelName = item?.channelName || "Talent";
    if (reminders.includes(id)) {
      setReminders((prev) => prev.filter((remId) => remId !== id));
      showToast(`Reminder removed for ${channelName}'s stream`, "info");
    } else {
      setReminders((prev) => [...prev, id]);
      showToast(`Notification set for ${channelName}'s stream! 🔔`, "reminder");
    }
  };

  const handleMobileNavClick = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-gray-100 font-sans antialiased selection:bg-brand-purple/30 selection:text-white">
      {/* Sidebar (Desktop) */}
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} liveCount={liveStreams.length} />

      {/* Main Container */}
      <div className="md:pl-64 flex flex-col min-h-screen">
        
        {/* Top Header Panel */}
        <header className="sticky top-0 bg-brand-bg/95 backdrop-blur-md border-b border-[#1a1a24] px-6 py-4 flex items-center justify-between z-40">
          {/* Brand header / Mobile menu trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -ml-2 rounded-xl text-gray-400 hover:text-white hover:bg-[#1a1a24] md:hidden cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2 md:hidden">
              <div className="w-8 h-8 rounded-lg bg-brand-coral flex items-center justify-center">
                <Radio className="w-4.5 h-4.5 text-white" />
              </div>
              <h1 className="font-display font-bold text-lg text-white tracking-wider">
                HoloWatch
              </h1>
            </div>

            {/* Desktop header greetings */}
            <div className="hidden md:block">
              <h2 className="font-display font-semibold text-base text-gray-200">
                Welcome to HoloWatch Dashboard
              </h2>
              <p className="text-xs text-gray-500 font-sans">
                Real-time tracking of Hololive Generation schedules & clips
              </p>
            </div>
          </div>

          {/* Quick Header stats indicators */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-[#1a1a24] border border-[#232333] px-3 py-1.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-brand-coral animate-pulse" />
              <span className="text-xs font-mono text-gray-300 font-semibold">
                {liveStreams.length} Streams Live
              </span>
            </div>

            {favorites.length > 0 && (
              <div className="flex items-center gap-1 text-xs bg-[#241318] text-brand-coral border border-brand-coral/20 px-3 py-1.5 rounded-xl">
                <Heart className="w-3.5 h-3.5 fill-brand-coral text-brand-coral" />
                <span className="font-semibold">{favorites.length} Favorites</span>
              </div>
            )}
          </div>
        </header>

        {/* Mobile Navigation Dropdown Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden bg-brand-card border-b border-[#232333] absolute top-16 left-0 right-0 z-40 p-4 space-y-2 shadow-xl"
            >
              <div className="flex justify-between items-center px-2 pb-2 border-b border-[#252535]">
                <span className="text-xs font-bold uppercase tracking-wider font-mono text-gray-500">
                  Quick Navigation
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded bg-[#0f0f14] text-gray-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => handleMobileNavClick("live")}
                  className={`flex items-center gap-2.5 p-3 rounded-xl text-left text-xs font-semibold ${
                    activeSection === "live" ? "bg-brand-coral/10 text-brand-coral" : "bg-[#0f0f14] text-gray-400"
                  }`}
                >
                  <Radio className="w-4.5 h-4.5" />
                  <span>Live Now</span>
                </button>

                <button
                  onClick={() => handleMobileNavClick("schedule")}
                  className={`flex items-center gap-2.5 p-3 rounded-xl text-left text-xs font-semibold ${
                    activeSection === "schedule" ? "bg-brand-purple/10 text-brand-purple" : "bg-[#0f0f14] text-gray-400"
                  }`}
                >
                  <Calendar className="w-4.5 h-4.5" />
                  <span>Schedule</span>
                </button>

                <button
                  onClick={() => handleMobileNavClick("channels")}
                  className={`flex items-center gap-2.5 p-3 rounded-xl text-left text-xs font-semibold ${
                    activeSection === "channels" ? "bg-brand-purple/10 text-brand-purple" : "bg-[#0f0f14] text-gray-400"
                  }`}
                >
                  <Users className="w-4.5 h-4.5" />
                  <span>Spotlight</span>
                </button>

                <button
                  onClick={() => handleMobileNavClick("search")}
                  className={`flex items-center gap-2.5 p-3 rounded-xl text-left text-xs font-semibold ${
                    activeSection === "search" ? "bg-brand-purple/10 text-brand-purple" : "bg-[#0f0f14] text-gray-400"
                  }`}
                >
                  <Search className="w-4.5 h-4.5" />
                  <span>Search</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Dashboard Panel Scroll Sections */}
        <main className="flex-1 p-6 md:p-8 space-y-10 max-w-7xl w-full mx-auto">
          
          {/* Welcome alert strip for Hololive Fans */}
          <div className="rounded-2xl border border-brand-purple/20 bg-[#161324] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start md:items-center gap-4">
              <div className="p-3 bg-brand-purple/10 text-brand-purple rounded-xl shrink-0">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-white">
                  Welcome to HoloWatch!
                </h3>
                <p className="text-xs text-gray-400 font-sans mt-0.5 leading-relaxed">
                  A high-fidelity dashboard built exclusively for Hololive fans. Tap any stream card below to experience our interactive live chat simulation.
                </p>
              </div>
            </div>
          </div>

          {/* Section 1: Live Now Grid */}
          <div id={liveLoading || liveError ? "live" : undefined} className="scroll-mt-6">
            {liveLoading ? (
              <LoadingCard label="Loading live streams..." />
            ) : liveError ? (
              <ErrorCard message={liveError} onRetry={fetchLiveStreams} />
            ) : (
              <LiveNowGrid
                streams={liveStreams}
                onSelectStream={setActiveTheaterStream}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
              />
            )}
          </div>

          {/* Section 2: Upcoming Schedule scroll timeline row */}
          <div id={scheduleLoading || scheduleError ? "schedule" : undefined} className="scroll-mt-6">
            {scheduleLoading ? (
              <LoadingCard label="Loading upcoming schedule..." />
            ) : scheduleError ? (
              <ErrorCard message={scheduleError} onRetry={fetchSchedule} />
            ) : (
              <UpcomingTimeline
                schedule={scheduleItems}
                reminders={reminders}
                toggleReminder={toggleReminder}
              />
            )}
          </div>

          {/* Section 3: Channel Spotlight banner component */}
          <div id={channelsLoading || channelsError || !selectedChannel ? "channels" : undefined} className="scroll-mt-6">
            {channelsLoading ? (
              <LoadingCard label="Loading channels..." />
            ) : channelsError ? (
              <ErrorCard message={channelsError} onRetry={fetchChannels} />
            ) : selectedChannel ? (
              <ChannelSpotlight
                channels={channels}
                selectedChannel={selectedChannel}
                onSelectChannel={setSelectedChannel}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                subscribedChannels={subscribedChannels}
                toggleSubscribe={toggleSubscribe}
              />
            ) : (
              <ErrorCard message="No channels available." onRetry={fetchChannels} />
            )}
          </div>

          {/* Section 4: Video Search list component */}
          <div id={searchLoading || searchError ? "search" : undefined} className="scroll-mt-6">
            {searchLoading ? (
              <LoadingCard label="Loading videos & clips..." />
            ) : searchError ? (
              <ErrorCard message={searchError} onRetry={fetchVideoSearch} />
            ) : (
              <VideoSearchSection
                videos={videoSearchList}
                onSelectVideo={(videoCast) => {
                  // Convert VideoSearchResult to LiveStream format for theater popup
                  const mockLiveCast: LiveStream = {
                    id: videoCast.id,
                    channelName: videoCast.channelName,
                    channelId: videoCast.channelId,
                    avatar: videoCast.avatar,
                    title: videoCast.title,
                    viewerCount: 0, // 0 signifies a stream replay or clip
                    topic: videoCast.topic,
                    thumbnail: videoCast.thumbnail,
                    startedAt: videoCast.date,
                    videoUrl: videoCast.id
                  };
                  setActiveTheaterStream(mockLiveCast);
                }}
              />
            )}
          </div>

        </main>

        {/* Footer */}
        <footer className="mt-auto py-6 px-8 border-t border-[#1a1a24] bg-brand-bg text-center text-xs text-gray-500 font-sans">
          <p>© 2026 HoloWatch - Fanmade VTuber Live Dashboard. All VTuber assets and identities belong to Cover Corp.</p>
        </footer>
      </div>

      {/* Stream Viewer Theater Modal Overlay */}
      <AnimatePresence>
        {activeTheaterStream && (
          <StreamTheaterModal
            stream={activeTheaterStream}
            onClose={() => setActiveTheaterStream(null)}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            subscribedChannels={subscribedChannels}
            toggleSubscribe={toggleSubscribe}
          />
        )}
      </AnimatePresence>

      {/* Toast Notification Stack */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-md pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className={`p-4 rounded-xl border shadow-xl flex items-center gap-3 bg-[#13131d] pointer-events-auto ${
                t.type === "success"
                  ? "border-emerald-500/30 text-emerald-300"
                  : t.type === "reminder"
                  ? "border-brand-purple/30 text-[#b399f5]"
                  : "border-[#252535] text-gray-300"
              }`}
            >
              <div className="p-1 rounded-lg bg-[#0f0f15]">
                {t.type === "success" ? (
                  <Heart className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                ) : t.type === "reminder" ? (
                  <Bell className="w-4 h-4 text-brand-purple" />
                ) : (
                  <Radio className="w-4 h-4 text-brand-coral" />
                )}
              </div>
              <p className="text-xs font-sans font-medium">{t.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
