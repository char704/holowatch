// Maps raw Holodex API shapes onto the app's existing UI types (src/types.ts)
// so components keep working unchanged.

import { Channel, LiveStream, ScheduleItem, VideoSearchResult } from "../types";
import { HolodexChannel, HolodexVideo } from "../services/holodex";

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=150&auto=format&fit=crop&q=80";
const FALLBACK_BANNER =
  "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=1200&auto=format&fit=crop&q=80";

export function formatCount(value: string | number | null | undefined): string {
  const num = typeof value === "string" ? parseInt(value, 10) : value;
  if (!num || Number.isNaN(num)) return "0";
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export function formatRelativeTime(isoDate: string | null | undefined): string {
  if (!isoDate) return "Unknown";
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const isFuture = diffMs < 0;
  const diffMin = Math.round(Math.abs(diffMs) / 60000);

  let label: string;
  if (diffMin < 1) label = "just now";
  else if (diffMin < 60) label = `${diffMin}m`;
  else if (diffMin < 60 * 24) label = `${Math.round(diffMin / 60)}h ${diffMin % 60}m`;
  else label = `${Math.round(diffMin / 60 / 24)}d`;

  if (label === "just now") return label;
  return isFuture ? `in ${label}` : `${label} ago`;
}

export function formatDuration(seconds: number | undefined): string {
  if (!seconds) return "--:--";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const mm = m.toString().padStart(h > 0 ? 2 : 1, "0");
  const ss = s.toString().padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function youtubeThumbnail(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export function mapChannel(c: HolodexChannel): Channel {
  return {
    id: c.id,
    channelName: c.name,
    englishName: c.english_name || c.name,
    avatar: c.photo || FALLBACK_AVATAR,
    banner: c.banner || FALLBACK_BANNER,
    subscribers: formatCount(c.subscriber_count),
    videoCount: c.video_count ? parseInt(c.video_count, 10) : 0,
    org: c.org || "Hololive",
    twitter: c.twitter || "",
    bio: c.description || "No biography available for this talent yet.",
  };
}

export function mapLiveStream(v: HolodexVideo): LiveStream {
  return {
    id: v.id,
    channelName: v.channel.english_name || v.channel.name,
    channelId: v.channel.id,
    avatar: v.channel.photo || FALLBACK_AVATAR,
    title: v.title,
    viewerCount: v.live_viewers ?? 0,
    topic: v.topic_id || "Chatting",
    thumbnail: youtubeThumbnail(v.id),
    startedAt: formatRelativeTime(v.start_actual || v.start_scheduled),
    videoUrl: `https://youtube.com/watch?v=${v.id}`,
  };
}

export function mapScheduleItem(v: HolodexVideo): ScheduleItem {
  return {
    id: v.id,
    channelName: v.channel.english_name || v.channel.name,
    channelId: v.channel.id,
    avatar: v.channel.photo || FALLBACK_AVATAR,
    title: v.title,
    startTime: formatRelativeTime(v.start_scheduled),
    topic: v.topic_id || "Chatting",
    thumbnail: youtubeThumbnail(v.id),
  };
}

export function mapVideoSearchResult(v: HolodexVideo): VideoSearchResult {
  return {
    id: v.id,
    title: v.title,
    channelName: v.channel.english_name || v.channel.name,
    channelId: v.channel.id,
    avatar: v.channel.photo || FALLBACK_AVATAR,
    type: v.type === "clip" ? "Clip" : "Stream",
    topic: v.topic_id || "Chatting",
    duration: formatDuration(v.duration),
    date: formatRelativeTime(v.available_at),
    thumbnail: youtubeThumbnail(v.id),
    views: "—",
  };
}
