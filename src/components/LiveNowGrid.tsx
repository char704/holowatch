import { Users, Play, Heart } from "lucide-react";
import { motion } from "motion/react";
import { LiveStream } from "../types";

interface LiveNowGridProps {
  streams: LiveStream[];
  onSelectStream: (stream: LiveStream) => void;
  favorites: string[];
  toggleFavorite: (channelId: string) => void;
}

export default function LiveNowGrid({
  streams,
  onSelectStream,
  favorites,
  toggleFavorite,
}: LiveNowGridProps) {
  // Format viewer counts beautifully (e.g., 64.2K)
  const formatViewerCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <section id="live" className="scroll-mt-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-brand-coral animate-ping" />
          <h2 className="font-display font-bold text-xl text-white tracking-tight">
            Live Now
          </h2>
          <span className="text-xs bg-[#22151c] text-brand-coral px-2.5 py-0.5 rounded-full font-mono border border-brand-coral/20 font-bold">
            {streams.length} STREAMING
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-5">
        {streams.map((stream) => {
          const isFav = favorites.includes(stream.channelId);

          return (
            <motion.div
              key={stream.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-brand-card rounded-xl overflow-hidden border border-brand-coral/20 shadow-[0_0_10px_rgba(255,68,102,0.06)] hover:shadow-[0_0_18px_rgba(255,68,102,0.18)] hover:border-brand-coral/40 group flex flex-col justify-between transition-all duration-300 relative cursor-pointer"
              onClick={() => onSelectStream(stream)}
            >
              {/* Thumbnail Area with Badges */}
              <div className="relative aspect-video overflow-hidden bg-[#0d0d12]">
                <img
                  src={stream.thumbnail}
                  alt={stream.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Live Indicator overlay */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-black/85 backdrop-blur-md px-2 py-1 rounded-md border border-brand-coral/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-coral animate-pulse" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider font-sans">
                    LIVE
                  </span>
                </div>

                {/* Viewers Overlay */}
                <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-black/85 backdrop-blur-md px-2 py-1 rounded-md text-gray-200">
                  <Users className="w-3.5 h-3.5 text-brand-coral" />
                  <span className="text-xs font-mono font-semibold">
                    {formatViewerCount(stream.viewerCount)}
                  </span>
                </div>

                {/* Quick Play Hover Button Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                  <div className="w-12 h-12 rounded-full bg-brand-coral text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Favorite Toggle Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevent opening player
                    toggleFavorite(stream.channelId);
                  }}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/80 backdrop-blur-md text-gray-400 hover:text-brand-coral transition-colors border border-gray-800"
                >
                  <Heart
                    className={`w-4 h-4 ${isFav ? "fill-brand-coral text-brand-coral" : ""}`}
                  />
                </button>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  {/* Stream Title (truncated to 2 lines) */}
                  <h3 className="font-sans font-medium text-sm text-gray-100 line-clamp-2 leading-tight group-hover:text-white mb-3">
                    {stream.title}
                  </h3>
                </div>

                {/* Info Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-[#252535]">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={stream.avatar}
                      alt={stream.channelName}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-brand-coral/30"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-300 truncate font-sans">
                        {stream.channelName}
                      </p>
                      <p className="text-[10px] text-gray-400 font-sans">
                        {stream.startedAt}
                      </p>
                    </div>
                  </div>

                  {/* Topic Tag */}
                  <span className="text-[10px] bg-brand-purple/15 text-[#9a85d9] px-2 py-0.5 rounded border border-brand-purple/20 font-semibold truncate max-w-[80px]">
                    {stream.topic}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
