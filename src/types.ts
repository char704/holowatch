export interface Channel {
  id: string;
  channelName: string;
  englishName: string;
  avatar: string;
  banner: string;
  subscribers: string;
  videoCount: number;
  org: string; // e.g., "Hololive English", "Hololive Japan"
  twitter: string;
  bio: string;
}

export interface LiveStream {
  id: string;
  channelName: string;
  channelId: string;
  avatar: string;
  title: string;
  viewerCount: number;
  topic: string;
  thumbnail: string;
  startedAt: string; // e.g., "30m ago"
  videoUrl: string;
}

export interface ScheduleItem {
  id: string;
  channelName: string;
  channelId: string;
  avatar: string;
  title: string;
  startTime: string; // e.g., "in 2h 15m"
  topic: string;
  thumbnail: string;
}

export interface VideoSearchResult {
  id: string;
  title: string;
  channelName: string;
  channelId: string;
  avatar: string;
  type: "Stream" | "Clip";
  topic: string;
  duration: string;
  date: string;
  thumbnail: string;
  views: string;
}
