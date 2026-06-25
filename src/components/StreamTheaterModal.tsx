import React, { useState, useEffect, useRef } from "react";
import { X, Users, MessageSquare, History, Send, Heart, Check, Youtube } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { LiveStream, VideoSearchResult } from "../types";
import { getChannelVideos, HolodexVideo } from "../services/holodex";
import { formatRelativeTime } from "../utils/holodexMappers";

interface StreamTheaterModalProps {
  stream: LiveStream | null;
  onClose: () => void;
  favorites: string[];
  toggleFavorite: (channelId: string) => void;
  subscribedChannels: string[];
  toggleSubscribe: (channelId: string) => void;
}

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  color: string;
  isSuperchat?: boolean;
  superchatAmount?: string;
  avatarSeed?: number;
}

// Sample usernames for our rolling chat
const MOCK_USERNAMES = [
  "PekoFan_99",
  "Shrimp_3000",
  "StarGazer_Suisei",
  "Kroniichiwa",
  "Marine_Husband_46",
  "Calli_Deadbeat",
  "Takodachi_Ina",
  "Gura_Bait",
  "Kobo_Watermelon",
  "Baetastic",
  "HololiveEnthusiast",
  "Sora_Symphony",
  "Miko_Elite_Elite"
];

// Sample messages based on VTubers
const MOCK_MESSAGES = [
  "IKZ!!!!!!!!!!! 🎉🎉",
  "LET'S GOOOOOOOOOO!!!",
  "Suisei is literally a singing goddess ☄️✨",
  "GURA ACCENT IS SO CUTE HELP 😍",
  "HA-HA-HA-HA PEKO PEKO PEKO",
  "Ahoy!!!!! 🏴‍☠️🏴‍☠️",
  "This stream is exactly what I needed today, thank you!",
  "poggers in the chat boys!",
  "WAH! WAH! WAH!",
  "Wait, what is happening?? lol",
  "This BG music is absolute fire 🔥🔥🔥",
  "R.I.P ears, she screamed so loud haha",
  "Unbelievable gaming skills right here!",
  "My Oshi is the best!",
  "Is the stream lagging or is it just my internet?",
  "sasuga leader!!",
  "T-Spin double setup was incredible!",
  "Guuuuraaaaa can we get an album please? 💙"
];

// Chat colors
const HANDLE_COLORS = [
  "text-cyan-400",
  "text-pink-400",
  "text-emerald-400",
  "text-purple-400",
  "text-yellow-400",
  "text-sky-400",
  "text-rose-400",
  "text-orange-400",
  "text-blue-400"
];

const SUPERCHAT_TIERS = [
  { amount: "$5.00", color: "bg-sky-600/30 border-sky-500 text-sky-200" },
  { amount: "$10.00", color: "bg-emerald-600/30 border-emerald-500 text-emerald-200" },
  { amount: "$50.00", color: "bg-amber-600/30 border-amber-500 text-amber-200" },
  { amount: "$100.00", color: "bg-rose-600/30 border-rose-500 text-rose-200" }
];

export default function StreamTheaterModal({
  stream,
  onClose,
  favorites,
  toggleFavorite,
  subscribedChannels,
  toggleSubscribe,
}: StreamTheaterModalProps) {
  if (!stream) return null;

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userChatInput, setUserChatInput] = useState("");
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Active video being shown in the player (defaults to the selected stream, can switch to a past VOD)
  const [activeVideoId, setActiveVideoId] = useState(stream.id);
  const [activeVideoTitle, setActiveVideoTitle] = useState(stream.title);

  // Sidebar tab: live chat simulation vs. past videos / VODs
  const [sidebarTab, setSidebarTab] = useState<"chat" | "vods">("chat");
  const [pastVideos, setPastVideos] = useState<HolodexVideo[]>([]);
  const [pastVideosLoading, setPastVideosLoading] = useState(false);
  const [pastVideosError, setPastVideosError] = useState<string | null>(null);

  const isFav = favorites.includes(stream.channelId);
  const isSubscribed = subscribedChannels.includes(stream.channelId);

  // Reset the player and sidebar tab whenever a new stream is opened in the modal
  useEffect(() => {
    setActiveVideoId(stream.id);
    setActiveVideoTitle(stream.title);
    setSidebarTab("chat");
  }, [stream]);

  // Fetch past videos/VODs for this channel when the "Past Videos" tab is opened
  useEffect(() => {
    if (sidebarTab !== "vods") return;

    let cancelled = false;
    setPastVideosLoading(true);
    setPastVideosError(null);

    getChannelVideos(stream.channelId, { type: "stream", status: "past", limit: 10 })
      .then((data) => {
        if (!cancelled) setPastVideos(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setPastVideosError(err instanceof Error ? err.message : "Unknown error");
        }
      })
      .finally(() => {
        if (!cancelled) setPastVideosLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [sidebarTab, stream.channelId]);

  const handleSelectPastVideo = (video: HolodexVideo) => {
    setActiveVideoId(video.id);
    setActiveVideoTitle(video.title);
  };

  // Initialize with some comments
  useEffect(() => {
    const initialChats: ChatMessage[] = [];
    for (let i = 0; i < 15; i++) {
      initialChats.push(generateRandomMessage());
    }
    setChatMessages(initialChats);
  }, [stream]);

  // Handle auto-scroll of chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Simulate incoming live chat messages
  useEffect(() => {
    const interval = setInterval(() => {
      setChatMessages((prev) => {
        // Limit total chat list size to 80 messages for performance
        const list = prev.length > 80 ? prev.slice(prev.length - 60) : prev;
        return [...list, generateRandomMessage()];
      });
    }, 1500 + Math.random() * 2000); // random interval

    return () => clearInterval(interval);
  }, []);

  const generateRandomMessage = (): ChatMessage => {
    const username = MOCK_USERNAMES[Math.floor(Math.random() * MOCK_USERNAMES.length)];
    const message = MOCK_MESSAGES[Math.floor(Math.random() * MOCK_MESSAGES.length)];
    const color = HANDLE_COLORS[Math.floor(Math.random() * HANDLE_COLORS.length)];
    const isSuperchat = Math.random() > 0.88; // 12% chance for superchat

    let superchatAmount = "";
    if (isSuperchat) {
      superchatAmount = SUPERCHAT_TIERS[Math.floor(Math.random() * SUPERCHAT_TIERS.length)].amount;
    }

    return {
      id: Math.random().toString(36).substr(2, 9),
      username,
      message,
      color,
      isSuperchat,
      superchatAmount,
      avatarSeed: Math.floor(Math.random() * 100)
    };
  };

  const handleSendUserChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userChatInput.trim()) return;

    const newChat: ChatMessage = {
      id: "user_msg_" + Date.now(),
      username: "You (HoloFan)",
      message: userChatInput.trim(),
      color: "text-brand-coral font-bold",
    };

    setChatMessages((prev) => [...prev, newChat]);
    setUserChatInput("");
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.3 }}
        className="bg-brand-bg border border-[#232333] rounded-2xl w-full max-w-6xl overflow-hidden flex flex-col h-[90vh] md:h-[82vh] lg:h-[85vh] relative"
      >
        {/* Modal Top Header Bar */}
        <div className="bg-brand-card px-6 py-4 border-b border-[#232333] flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            {stream.viewerCount > 0 ? (
              <span className="flex items-center gap-1.5 bg-brand-coral/10 text-brand-coral border border-brand-coral/20 px-2.5 py-0.5 rounded text-xs font-mono font-bold animate-pulse">
                🔴 LIVE THEATER
              </span>
            ) : (
              <span className="flex items-center gap-1.5 bg-brand-purple/10 text-brand-purple border border-brand-purple/20 px-2.5 py-0.5 rounded text-xs font-mono font-bold">
                🎬 STREAM REPLAY
              </span>
            )}
            <p className="text-xs text-gray-400 hidden sm:block truncate max-w-md">
              Watching: {stream.title}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 hover:bg-[#20202d] rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split Screen layout */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left Side: Video Player & Stream Details */}
          <div className="flex-1 flex flex-col bg-[#08080c] overflow-y-auto custom-scrollbar">
            {/* Real YouTube IFrame Player, maintained at a 16:9 aspect ratio */}
            <div className="relative w-full bg-black flex-shrink-0" style={{ paddingBottom: "56.25%" }}>
              <iframe
                key={activeVideoId}
                src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0`}
                title={activeVideoTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>

            {/* Watch on YouTube Button */}
            <div className="px-6 py-3 flex items-center justify-between bg-[#0c0c11] border-b border-[#1a1a24]">
              <span className="text-[11px] text-gray-500 font-sans truncate max-w-xs">
                {activeVideoTitle}
              </span>
              <a
                href={`https://www.youtube.com/watch?v=${activeVideoId}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0f0f14] hover:bg-[#1a1a24] text-gray-300 hover:text-white text-xs border border-white/5 transition-colors font-sans font-medium shrink-0"
              >
                <Youtube className="w-4 h-4 text-red-500" />
                <span>Watch on YouTube</span>
              </a>
            </div>

            {/* Stream Detail Meta Descriptions */}
            <div className="p-6">
              <h2 className="text-lg font-display font-semibold text-white leading-snug mb-4">
                {stream.title}
              </h2>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-brand-card border border-[#232333]">
                <div className="flex items-center gap-3">
                  <img
                    src={stream.avatar}
                    alt={stream.channelName}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-purple/40"
                  />
                  <div>
                    <h3 className="font-sans font-bold text-sm text-white">
                      {stream.channelName}
                    </h3>
                    <p className="text-xs text-gray-400 font-sans">
                      Topic: <span className="text-brand-purple font-semibold">{stream.topic}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  {/* Favorite Toggle */}
                  <button
                    onClick={() => toggleFavorite(stream.channelId)}
                    className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                      isFav
                        ? "bg-brand-coral/10 border-brand-coral/30 text-brand-coral"
                        : "bg-[#0f0f14] border-[#232333] text-gray-400 hover:text-white"
                    }`}
                  >
                    <Heart className={`w-4.5 h-4.5 ${isFav ? "fill-brand-coral" : ""}`} />
                  </button>

                  {/* Subscribe button */}
                  <button
                    onClick={() => toggleSubscribe(stream.channelId)}
                    className={`flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                      isSubscribed
                        ? "bg-[#252535] text-gray-300 border border-gray-700"
                        : "bg-brand-purple hover:bg-brand-purple-hover text-white shadow-lg shadow-brand-purple/20"
                    }`}
                  >
                    {isSubscribed ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Subscribed</span>
                      </>
                    ) : (
                      <>
                        <span>Subscribe</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Holo Live Chat simulation & Past Videos */}
          <div className="w-full lg:w-80 bg-brand-card border-t lg:border-t-0 lg:border-l border-[#232333] flex flex-col justify-between h-[340px] lg:h-auto overflow-hidden">
            {/* Sidebar Tab Bar */}
            <div className="flex items-center bg-[#13131a] border-b border-[#232333] shrink-0">
              <button
                onClick={() => setSidebarTab("chat")}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-3 text-xs font-bold uppercase tracking-wider font-sans transition-colors cursor-pointer ${
                  sidebarTab === "chat"
                    ? "text-brand-purple border-b-2 border-brand-purple bg-brand-purple/5"
                    : "text-gray-500 border-b-2 border-transparent hover:text-gray-300"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat</span>
              </button>
              <button
                onClick={() => setSidebarTab("vods")}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-3 text-xs font-bold uppercase tracking-wider font-sans transition-colors cursor-pointer ${
                  sidebarTab === "vods"
                    ? "text-brand-purple border-b-2 border-brand-purple bg-brand-purple/5"
                    : "text-gray-500 border-b-2 border-transparent hover:text-gray-300"
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Past Videos</span>
              </button>
            </div>

            {sidebarTab === "chat" ? (
              <>
                {/* Chat header panel */}
                <div className="px-4 py-2.5 bg-[#0f0f14] border-b border-[#232333] flex items-center justify-between shrink-0">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-sans">
                    Holo Chat Room
                  </span>
                  <div className="flex items-center gap-1.5 text-gray-500 font-mono text-[10px]">
                    <Users className="w-3.5 h-3.5 text-brand-coral" />
                    <span>{stream.viewerCount > 0 ? "LIVE" : "ARCHIVE"}</span>
                  </div>
                </div>

                {/* Chat list scrolling messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className="text-xs font-sans">
                      {msg.isSuperchat ? (
                        /* Super Chat Block */
                        <div className={`p-2 rounded-lg border my-1.5 text-left ${msg.color} ${
                          msg.superchatAmount === "$100.00"
                            ? "bg-rose-500/10 border-rose-500/30 text-rose-200"
                            : msg.superchatAmount === "$50.00"
                            ? "bg-amber-500/10 border-amber-500/30 text-amber-200"
                            : "bg-sky-500/10 border-sky-500/30 text-sky-200"
                        }`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold font-mono text-[10px] uppercase tracking-wider">
                              ★ Super Chat {msg.superchatAmount}
                            </span>
                            <span className="font-bold font-mono">{msg.superchatAmount}</span>
                          </div>
                          <p className="font-medium text-gray-200">{msg.username}</p>
                          <p className="text-white font-medium mt-0.5">{msg.message}</p>
                        </div>
                      ) : (
                        /* Normal Chat message line */
                        <div className="flex items-start gap-2 leading-relaxed">
                          {/* Circle fallback seed avatar color */}
                          <div className="w-5 h-5 rounded-full bg-brand-purple/20 text-brand-purple text-[8px] flex items-center justify-center shrink-0 uppercase font-mono font-bold">
                            {msg.username.substring(0, 2)}
                          </div>
                          <div>
                            <span className={`font-semibold mr-1.5 ${msg.color}`}>
                              {msg.username}:
                            </span>
                            <span className="text-gray-200">{msg.message}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={chatBottomRef} />
                </div>

                {/* Send user input box */}
                <form
                  onSubmit={handleSendUserChat}
                  className="p-3 bg-[#13131a] border-t border-[#232333] flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={userChatInput}
                    onChange={(e) => setUserChatInput(e.target.value)}
                    placeholder="Send a message peko..."
                    maxLength={150}
                    className="flex-1 bg-[#0f0f14] border border-[#232333] focus:border-brand-purple rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none font-sans"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-brand-purple hover:bg-brand-purple-hover text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </>
            ) : (
              <>
                {/* Past Videos header panel */}
                <div className="px-4 py-2.5 bg-[#0f0f14] border-b border-[#232333] flex items-center justify-between shrink-0">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-sans">
                    Past Streams / VODs
                  </span>
                </div>

                {/* Scrollable list of past video cards */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                  {pastVideosLoading && (
                    <div className="flex flex-col items-center justify-center gap-2 py-10 text-gray-500">
                      <span className="text-xs font-sans">Loading past videos...</span>
                    </div>
                  )}

                  {pastVideosError && (
                    <div className="flex flex-col items-center justify-center gap-2 py-10 px-4 text-center">
                      <span className="text-xs font-sans text-brand-coral font-medium">
                        Failed to load past videos
                      </span>
                      <span className="text-[10px] font-sans text-gray-500">{pastVideosError}</span>
                    </div>
                  )}

                  {!pastVideosLoading && !pastVideosError && pastVideos.length === 0 && (
                    <div className="flex flex-col items-center justify-center gap-2 py-10 text-gray-500">
                      <span className="text-xs font-sans">No past videos found.</span>
                    </div>
                  )}

                  {!pastVideosLoading &&
                    !pastVideosError &&
                    pastVideos.map((video) => (
                      <button
                        key={video.id}
                        onClick={() => handleSelectPastVideo(video)}
                        className={`w-full flex gap-2.5 p-2 rounded-xl border text-left transition-colors cursor-pointer ${
                          activeVideoId === video.id
                            ? "bg-brand-purple/10 border-brand-purple/40"
                            : "bg-[#0f0f14] border-[#232333] hover:border-brand-purple/30 hover:bg-[#15151e]"
                        }`}
                      >
                        <div className="relative w-24 aspect-video shrink-0 rounded-lg overflow-hidden bg-[#0d0d12]">
                          <img
                            src={`https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`}
                            alt={video.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-200 font-sans font-medium line-clamp-2 leading-snug">
                            {video.title}
                          </p>
                          <p className="text-[10px] text-gray-500 font-mono mt-1">
                            {formatRelativeTime(video.available_at)}
                          </p>
                        </div>
                      </button>
                    ))}
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
