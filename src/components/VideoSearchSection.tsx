import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, Video, Clock, Eye, Play, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { VideoSearchResult } from "../types";

interface VideoSearchSectionProps {
  videos: VideoSearchResult[];
  onSelectVideo: (video: VideoSearchResult) => void;
}

export default function VideoSearchSection({
  videos,
  onSelectVideo,
}: VideoSearchSectionProps) {
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"All" | "Stream" | "Clip">("All");
  const [selectedTopic, setSelectedTopic] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"Newest" | "Oldest">("Newest");

  // Get list of unique topics from all video results for topic chips
  const topics = useMemo(() => {
    const allTopics = videos.map((v) => v.topic);
    return ["All", ...Array.from(new Set(allTopics))];
  }, [videos]);

  // Filter and Sort Video List
  const filteredVideos = useMemo(() => {
    let result = [...videos];

    // Filter by text search
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (v) =>
          v.title.toLowerCase().includes(query) ||
          v.channelName.toLowerCase().includes(query) ||
          v.topic.toLowerCase().includes(query)
      );
    }

    // Filter by Type
    if (selectedType !== "All") {
      result = result.filter((v) => v.type === selectedType);
    }

    // Filter by Topic
    if (selectedTopic !== "All") {
      result = result.filter((v) => v.topic === selectedTopic);
    }

    // Sort: Since we have dates like "1 day ago", "3 days ago", "1 year ago", we can map them for sorting
    // For mock sorting: our array in data.ts is ordered from Newest to Oldest.
    // If "Newest", keep original or index-based. If "Oldest", reverse it!
    if (sortBy === "Oldest") {
      result.reverse();
    }

    return result;
  }, [videos, searchQuery, selectedType, selectedTopic, sortBy]);

  return (
    <section id="search" className="scroll-mt-6">
      <div className="flex items-center gap-2.5 mb-5">
        <Search className="w-5 h-5 text-brand-purple" />
        <h2 className="font-display font-bold text-xl text-white tracking-tight">
          Video Search & Clips
        </h2>
        <span className="text-xs bg-[#1a1426] text-[#b096f2] px-2.5 py-0.5 rounded-full font-mono border border-brand-purple/20 font-bold">
          DISCOVER
        </span>
      </div>

      {/* Control Board Card */}
      <div className="bg-brand-card rounded-xl p-5 border border-[#232333] space-y-4 mb-6">
        {/* Search Bar Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stream titles, clip highlights, topics, or talents..."
            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#0f0f14] border border-[#232333] hover:border-brand-purple/40 focus:border-brand-purple focus:outline-none text-sm text-gray-100 placeholder-gray-500 transition-all font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white font-sans cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Selection Grid */}
        <div className="space-y-3.5">
          {/* Row 1: Type Selection */}
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono w-16">
              Type:
            </span>
            <div className="flex gap-2">
              {(["All", "Stream", "Clip"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1 text-xs rounded-lg transition-all duration-200 cursor-pointer ${
                    selectedType === type
                      ? "bg-brand-purple text-white shadow-md shadow-brand-purple/20"
                      : "bg-[#0f0f14] text-gray-400 hover:text-gray-200 hover:bg-[#15151e] border border-[#1a1a24]"
                  }`}
                >
                  {type === "All" ? "All Formats" : type === "Stream" ? "Full Streams" : "Highlight Clips"}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Topic Selector Chips */}
          <div className="flex items-start gap-4">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono w-16 pt-1 shrink-0">
              Topic:
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto custom-scrollbar pr-2">
              {topics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`px-2.5 py-0.5 text-xs rounded transition-all duration-150 cursor-pointer ${
                    selectedTopic === topic
                      ? "bg-brand-purple/20 text-[#a38be6] border border-brand-purple/40 font-medium"
                      : "bg-[#0f0f14] text-gray-400 hover:text-gray-200 border border-transparent"
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Row 3: Sorting Options */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#252535]">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono w-16">
                Sort:
              </span>
              <div className="flex gap-1">
                {(["Newest", "Oldest"] as const).map((sort) => (
                  <button
                    key={sort}
                    onClick={() => setSortBy(sort)}
                    className={`px-3 py-1 text-xs rounded transition-all duration-150 cursor-pointer ${
                      sortBy === sort
                        ? "text-brand-purple font-semibold bg-brand-purple/10 border border-brand-purple/20"
                        : "text-gray-400 hover:text-white bg-transparent border border-transparent"
                    }`}
                  >
                    {sort === "Newest" ? "Newest Uploads" : "Oldest / Archives"}
                  </button>
                ))}
              </div>
            </div>

            {/* Total count indicator */}
            <div className="text-[11px] font-mono text-gray-500">
              Found {filteredVideos.length} matching result{filteredVideos.length === 1 ? "" : "s"}
            </div>
          </div>
        </div>
      </div>

      {/* Video Results Rows */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredVideos.length > 0 ? (
            filteredVideos.map((video, index) => (
              <motion.div
                key={video.id}
                layoutId={`video-${video.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={() => onSelectVideo(video)}
                className="bg-brand-card hover:bg-[#20202d] rounded-xl p-3 border border-[#232333] hover:border-brand-purple/30 group flex flex-col sm:flex-row gap-4 items-stretch cursor-pointer transition-all duration-200"
              >
                {/* Video Thumbnail Box */}
                <div className="relative aspect-video w-full sm:w-48 rounded-lg overflow-hidden bg-[#0d0d12] shrink-0">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                  />
                  {/* Play Button overlay */}
                  <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <div className="w-9 h-9 rounded-full bg-brand-purple text-white flex items-center justify-center shadow-lg">
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    </div>
                  </div>
                  {/* Duration Badge */}
                  <div className="absolute bottom-1.5 right-1.5 bg-black/85 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-gray-200">
                    {video.duration}
                  </div>
                  {/* Format/Type tag label overlay */}
                  <div className="absolute top-1.5 left-1.5">
                    <span className={`text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded backdrop-blur-md ${
                      video.type === "Stream"
                        ? "bg-[#181026]/90 text-brand-purple border border-brand-purple/30"
                        : "bg-[#101e18]/90 text-emerald-400 border border-emerald-500/30"
                    }`}>
                      {video.type}
                    </span>
                  </div>
                </div>

                {/* Video metadata description side */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    {/* Title */}
                    <h3 className="text-sm font-sans font-medium text-gray-100 line-clamp-2 leading-snug group-hover:text-white mb-2">
                      {video.title}
                    </h3>

                    {/* Talent details line */}
                    <div className="flex items-center gap-2 mb-1">
                      <img
                        src={video.avatar}
                        alt={video.channelName}
                        referrerPolicy="no-referrer"
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="text-xs font-semibold text-gray-300 font-sans">
                        {video.channelName}
                      </span>
                    </div>
                  </div>

                  {/* Footing line: Topic, duration, dates, views */}
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400 font-sans pt-1 border-t border-[#252535]/50">
                    <span className="text-brand-purple bg-brand-purple/10 px-1.5 py-0.5 rounded font-medium text-[10px]">
                      {video.topic}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-500" />
                      {video.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-gray-500" />
                      {video.views} views
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-brand-card rounded-xl border border-dashed border-[#252535]"
            >
              <SlidersHorizontal className="w-8 h-8 text-gray-500 mx-auto mb-3" />
              <p className="text-sm text-gray-300 font-sans font-medium">No matches found</p>
              <p className="text-xs text-gray-500 font-sans mt-1">
                Try refining your filters or search query terms.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedType("All");
                  setSelectedTopic("All");
                }}
                className="mt-4 px-4 py-2 text-xs bg-brand-purple hover:bg-brand-purple-hover text-white rounded-lg transition-colors font-sans cursor-pointer"
              >
                Reset All Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
