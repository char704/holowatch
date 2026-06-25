// Typed service layer for the Holodex Public API v2 (https://holodex.net/api/v2)

const BASE_URL = "https://holodex.net/api/v2";
const API_KEY = import.meta.env.VITE_HOLODEX_API_KEY as string | undefined;

export interface HolodexChannelRef {
  id: string;
  name: string;
  english_name: string | null;
  photo: string | null;
  org: string | null;
}

export interface HolodexVideo {
  id: string;
  title: string;
  status: "new" | "upcoming" | "live" | "past" | "missing";
  type: "stream" | "clip" | "placeholder";
  topic_id: string | null;
  start_scheduled: string | null;
  start_actual: string | null;
  available_at: string;
  duration?: number;
  live_viewers?: number;
  channel: HolodexChannelRef;
}

export interface HolodexChannel {
  id: string;
  name: string;
  english_name: string | null;
  photo: string | null;
  banner: string | null;
  subscriber_count: string | null;
  video_count: string | null;
  view_count?: string | null;
  org: string | null;
  lang?: string | null;
  inactive?: boolean;
  twitter?: string | null;
  description?: string | null;
}

export interface HolodexSearchParams {
  sort?: string;
  target?: ("video" | "clip")[];
  org?: string[];
  topic?: string[];
  paginated?: boolean;
  offset?: number;
  limit?: number;
}

interface HolodexSearchResponse {
  total: number;
  items: HolodexVideo[];
}

async function holodexFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_KEY) {
    throw new Error(
      "Missing Holodex API key. Set VITE_HOLODEX_API_KEY in your .env file."
    );
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "X-APIKEY": API_KEY,
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`Holodex API error ${res.status}: ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export async function getLiveStreams(): Promise<HolodexVideo[]> {
  return holodexFetch<HolodexVideo[]>("/live?org=Hololive&type=stream");
}

export async function getUpcomingStreams(): Promise<HolodexVideo[]> {
  return holodexFetch<HolodexVideo[]>(
    "/live?org=Hololive&status=upcoming&max_upcoming_hours=48"
  );
}

export async function getChannels(): Promise<HolodexChannel[]> {
  return holodexFetch<HolodexChannel[]>(
    "/channels?org=Hololive&type=vtuber&limit=50"
  );
}

export async function getChannelById(id: string): Promise<HolodexChannel> {
  return holodexFetch<HolodexChannel>(`/channels/${id}`);
}

export interface HolodexChannelVideosParams {
  type?: "stream" | "clip" | "placeholder";
  status?: "new" | "upcoming" | "live" | "past" | "missing";
  limit?: number;
}

export async function getChannelVideos(
  channelId: string,
  params: HolodexChannelVideosParams = {}
): Promise<HolodexVideo[]> {
  const query = new URLSearchParams();
  query.set("type", params.type ?? "stream");
  query.set("status", params.status ?? "past");
  query.set("limit", String(params.limit ?? 10));
  return holodexFetch<HolodexVideo[]>(
    `/channels/${channelId}/videos?${query.toString()}`
  );
}

export async function searchVideos(
  params: HolodexSearchParams
): Promise<HolodexVideo[]> {
  const body = {
    sort: params.sort ?? "newest",
    target: params.target ?? ["video", "clip"],
    org: params.org ?? ["Hololive"],
    topic: params.topic,
    paginated: params.paginated ?? false,
    offset: params.offset ?? 0,
    limit: params.limit ?? 20,
  };

  const result = await holodexFetch<HolodexVideo[] | HolodexSearchResponse>(
    "/search/videoSearch",
    {
      method: "POST",
      body: JSON.stringify(body),
    }
  );

  return Array.isArray(result) ? result : result.items;
}
