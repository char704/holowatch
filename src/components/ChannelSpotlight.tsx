import { Users, Video, Twitter, Heart, Sparkles, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Channel } from "../types";

interface ChannelSpotlightProps {
  channels: Channel[];
  selectedChannel: Channel;
  onSelectChannel: (channel: Channel) => void;
  favorites: string[];
  toggleFavorite: (channelId: string) => void;
  subscribedChannels: string[];
  toggleSubscribe: (channelId: string) => void;
}

export default function ChannelSpotlight({
  channels,
  selectedChannel,
  onSelectChannel,
  favorites,
  toggleFavorite,
  subscribedChannels,
  toggleSubscribe,
}: ChannelSpotlightProps) {
  const isFav = favorites.includes(selectedChannel.id);
  const isSubscribed = subscribedChannels.includes(selectedChannel.id);

  return (
    <section id="channels" className="scroll-mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-brand-purple" />
          <h2 className="font-display font-bold text-xl text-white tracking-tight">
            Channel Spotlight
          </h2>
          <span className="text-xs bg-[#1a1426] text-[#b096f2] px-2.5 py-0.5 rounded-full font-mono border border-brand-purple/20 font-bold">
            FEATURED
          </span>
        </div>

        {/* Talent Quick Selection Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 custom-scrollbar">
          {channels.map((chan) => (
            <button
              key={chan.id}
              onClick={() => onSelectChannel(chan)}
              className={`px-3 py-1 text-xs rounded-full cursor-pointer transition-all duration-200 shrink-0 font-medium ${
                selectedChannel.id === chan.id
                  ? "bg-brand-purple text-white shadow-md shadow-brand-purple/20"
                  : "bg-brand-card text-gray-400 hover:text-white border border-[#232333] hover:border-[#38384f]"
              }`}
            >
              {chan.englishName}
            </button>
          ))}
        </div>
      </div>

      {/* Main Spotlight Spotlight Card */}
      <div className="relative rounded-xl overflow-hidden border border-white/5 bg-[#1a1a24] min-h-[340px] flex flex-col justify-between shadow-2xl">
        {/* Banner Background */}
        <div className="absolute inset-0 h-44 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a24] via-[#1a1a24]/60 to-black/30 z-10" />
          <img
            src={selectedChannel.banner}
            alt={`${selectedChannel.englishName} Banner`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover select-none filter brightness-95"
          />
        </div>

        {/* High Density Radial Spotlight Accent Overlay */}
        <div 
          className="absolute inset-0 bg-[#1e293b]/10 opacity-30 pointer-events-none mix-blend-screen z-10" 
          style={{ backgroundImage: "radial-gradient(circle at 70% 30%, #7c5cbf 0%, transparent 60%)" }} 
        />

        {/* Banner Overlap Overlay Content */}
        <div className="relative z-20 pt-20 px-6 sm:px-8 pb-6 flex-1 flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedChannel.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col md:flex-row gap-6 md:items-end justify-between w-full h-full"
            >
              {/* Profile Main Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
                {/* Overlapping Rounded Circular Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-[#1a1a24] shadow-xl ring-2 ring-[#7c5cbf]/30 bg-[#0c0c12]">
                    <img
                      src={selectedChannel.avatar}
                      alt={selectedChannel.channelName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="absolute bottom-1 right-1 flex h-4.5 w-4.5 rounded-full border-2 border-[#1a1a24] bg-green-500" title="Online" />
                </div>

                {/* Talent Names & Badges */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#7c5cbf]/20 text-[#a990f0] uppercase tracking-wide border border-[#7c5cbf]/30 font-mono">
                      {selectedChannel.org}
                    </span>
                    <span className="text-[10px] font-semibold font-mono text-gray-400">
                      ID: {selectedChannel.id}
                    </span>
                  </div>

                  <h3 className="font-display font-black italic tracking-tighter text-3xl sm:text-4xl text-white uppercase leading-none">
                    {selectedChannel.englishName}
                  </h3>
                  <p className="text-xs text-gray-400 font-sans font-medium">
                    {selectedChannel.channelName}
                  </p>
                </div>
              </div>

              {/* Engagement Stats Box */}
              <div className="flex flex-wrap gap-4 sm:gap-6 bg-[#0f0f14]/85 backdrop-blur-md p-4 rounded-xl border border-white/5 shrink-0 self-start md:self-end">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-brand-coral/10 text-brand-coral">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-gray-500 tracking-wider font-mono font-bold">
                      Subscribers
                    </p>
                    <p className="text-sm font-bold text-white font-mono">
                      {selectedChannel.subscribers}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#7c5cbf]/10 text-[#7c5cbf]">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-gray-500 tracking-wider font-mono font-bold">
                      Streams & Videos
                    </p>
                    <p className="text-sm font-bold text-white font-mono">
                      {selectedChannel.videoCount}+
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Biography, Social Links and Action Buttons */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`bio-${selectedChannel.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-6 pt-5 border-t border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-5"
            >
              {/* Bio Statement */}
              <div className="max-w-xl">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">
                  Biography
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed font-sans">
                  {selectedChannel.bio}
                </p>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                {/* Official Twitter Button */}
                <a
                  href={`https://twitter.com/${selectedChannel.twitter}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0f0f14] hover:bg-[#1a1a24] text-gray-300 hover:text-white text-xs border border-white/5 transition-colors font-sans font-medium"
                >
                  <Twitter className="w-4 h-4 text-sky-400" />
                  <span>{selectedChannel.twitter}</span>
                </a>

                {/* Favorite toggle */}
                <button
                  onClick={() => toggleFavorite(selectedChannel.id)}
                  className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                    isFav
                      ? "bg-brand-coral/10 border-brand-coral/30 text-brand-coral"
                      : "bg-[#0f0f14] border-white/5 text-gray-400 hover:text-white hover:bg-[#1a1a24]"
                  }`}
                  title="Favorite Channel"
                >
                  <Heart className={`w-4 h-4 ${isFav ? "fill-brand-coral" : ""}`} />
                </button>

                {/* Subscribed Toggle Button */}
                <button
                  onClick={() => toggleSubscribe(selectedChannel.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                    isSubscribed
                      ? "bg-[#1f2937] text-gray-300 border border-gray-700"
                      : "bg-[#7c5cbf] hover:bg-[#906fe3] text-white shadow-lg shadow-[#7c5cbf]/20 border border-transparent"
                  }`}
                >
                  {isSubscribed ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Subscribed</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Subscribe</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
