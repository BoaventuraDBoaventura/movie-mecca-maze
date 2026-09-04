import { createServerFn } from "@tanstack/react-start";

const BASE = "https://api.themoviedb.org/3";

function parseTmdbPayload<T>(body: string): T {
  const trimmed = body.trim();
  const jsonText = trimmed.startsWith("processTmdbData(")
    ? trimmed.replace(/^processTmdbData\(/, "").replace(/\);?$/, "")
    : trimmed;

  return JSON.parse(jsonText) as T;
}

async function tmdb<T>(path: string, params: Record<string, string | number> = {}): Promise<T> {
  const key = process.env.TMDB_API_KEY;
  if (!key) throw new Error("TMDB_API_KEY missing");
  const url = new URL(BASE + path);
  url.searchParams.set("api_key", key);
  url.searchParams.set("language", "pt-BR");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
  const res = await fetch(url.toString(), { headers: { Accept: "application/json" } });
  const body = await res.text();
  if (!res.ok) {
    console.error(`TMDb API error ${res.status}: ${body.slice(0, 240)}`);
    throw new Error(`TMDb ${res.status}`);
  }

  try {
    return parseTmdbPayload<T>(body);
  } catch (error) {
    console.error("TMDb returned an invalid payload", body.slice(0, 240));
    throw error;
  }
}

export interface MediaItem {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type: "movie" | "tv";
}

interface TmdbItem {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: string;
}

function normalize(item: TmdbItem, fallbackType: "movie" | "tv"): MediaItem {
  const t = (item.media_type as "movie" | "tv") || fallbackType;
  return {
    id: item.id,
    title: item.title || item.name || "",
    overview: item.overview,
    poster_path: item.poster_path,
    backdrop_path: item.backdrop_path,
    vote_average: item.vote_average,
    release_date: item.release_date,
    first_air_date: item.first_air_date,
    media_type: t,
  };
}

export const getHomeData = createServerFn({ method: "GET" }).handler(async () => {
  const [trending, popularMovies, topMovies, popularTv, topTv, actionMovies] = await Promise.all([
    tmdb<{ results: TmdbItem[] }>("/trending/all/week"),
    tmdb<{ results: TmdbItem[] }>("/movie/popular"),
    tmdb<{ results: TmdbItem[] }>("/movie/top_rated"),
    tmdb<{ results: TmdbItem[] }>("/tv/popular"),
    tmdb<{ results: TmdbItem[] }>("/tv/top_rated"),
    tmdb<{ results: TmdbItem[] }>("/discover/movie", { with_genres: 28 }),
  ]);
  return {
    trending: trending.results.map((i) => normalize(i, "movie")),
    popularMovies: popularMovies.results.map((i) => normalize(i, "movie")),
    topMovies: topMovies.results.map((i) => normalize(i, "movie")),
    popularTv: popularTv.results.map((i) => normalize(i, "tv")),
    topTv: topTv.results.map((i) => normalize(i, "tv")),
    actionMovies: actionMovies.results.map((i) => normalize(i, "movie")),
  };
});

export const searchMulti = createServerFn({ method: "GET" })
  .inputValidator((data: { query: string }) => data)
  .handler(async ({ data }) => {
    if (!data.query.trim()) return { results: [] as MediaItem[] };
    const res = await tmdb<{ results: TmdbItem[] }>("/search/multi", { query: data.query });
    return {
      results: res.results
        .filter((r) => r.media_type === "movie" || r.media_type === "tv")
        .map((r) => normalize(r, "movie")),
    };
  });

export interface MovieDetail extends MediaItem {
  runtime: number | null;
  genres: { id: number; name: string }[];
  tagline: string;
}

export const getMovie = createServerFn({ method: "GET" })
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    const m = await tmdb<TmdbItem & { runtime: number | null; genres: { id: number; name: string }[]; tagline: string }>(
      `/movie/${data.id}`
    );
    return { ...normalize(m, "movie"), runtime: m.runtime, genres: m.genres, tagline: m.tagline } as MovieDetail;
  });

export interface TvDetail extends MediaItem {
  number_of_seasons: number;
  genres: { id: number; name: string }[];
  tagline: string;
  seasons: { season_number: number; name: string; episode_count: number }[];
}

export const getTv = createServerFn({ method: "GET" })
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    const t = await tmdb<
      TmdbItem & {
        number_of_seasons: number;
        genres: { id: number; name: string }[];
        tagline: string;
        seasons: { season_number: number; name: string; episode_count: number }[];
      }
    >(`/tv/${data.id}`);
    return {
      ...normalize(t, "tv"),
      number_of_seasons: t.number_of_seasons,
      genres: t.genres,
      tagline: t.tagline,
      seasons: t.seasons.filter((s) => s.season_number > 0),
    } as TvDetail;
  });

export const getSeason = createServerFn({ method: "GET" })
  .inputValidator((data: { id: number; season: number }) => data)
  .handler(async ({ data }) => {
    const s = await tmdb<{
      episodes: { episode_number: number; name: string; overview: string; still_path: string | null; air_date: string }[];
    }>(`/tv/${data.id}/season/${data.season}`);
    return s.episodes;
  });

export const getRecommendations = createServerFn({ method: "GET" })
  .inputValidator((data: { id: number; type: "movie" | "tv" }) => data)
  .handler(async ({ data }) => {
    const r = await tmdb<{ results: TmdbItem[] }>(`/${data.type}/${data.id}/recommendations`).catch(
      () => ({ results: [] as TmdbItem[] }),
    );
    return r.results.slice(0, 15).map((i) => normalize(i, data.type));
  });

export interface Genre { id: number; name: string }

export interface WatchProvider { id: number; name: string; logoPath: string | null }

const FEATURED_PROVIDER_IDS = [8, 119, 337, 1899, 350, 531, 307, 11];

export const getGenres = createServerFn({ method: "GET" })
  .inputValidator((data: { type: "movie" | "tv" }) => data)
  .handler(async ({ data }) => {
    const r = await tmdb<{ genres: Genre[] }>(`/genre/${data.type}/list`);
    return r.genres;
  });

export const getWatchProviders = createServerFn({ method: "GET" })
  .inputValidator((data: { type: "movie" | "tv"; region?: string }) => data)
  .handler(async ({ data }) => {
    const region = data.region ?? "BR";
    const r = await tmdb<{
      results: {
        provider_id: number;
        provider_name: string;
        logo_path: string | null;
        display_priorities?: Record<string, number>;
      }[];
    }>(`/watch/providers/${data.type}`, { watch_region: region });

    return r.results
      .filter((provider) => FEATURED_PROVIDER_IDS.includes(provider.provider_id))
      .sort((a, b) => {
        const priorityA = a.display_priorities?.[region] ?? 999;
        const priorityB = b.display_priorities?.[region] ?? 999;
        return priorityA - priorityB;
      })
      .map((provider) => ({
        id: provider.provider_id,
        name: provider.provider_name,
        logoPath: provider.logo_path,
      } satisfies WatchProvider));
  });

export const discoverMedia = createServerFn({ method: "GET" })
  .inputValidator((data: { type: "movie" | "tv"; genre?: number; anime?: boolean; page?: number; year?: number; provider?: number; region?: string }) => data)
  .handler(async ({ data }) => {
    const params: Record<string, string | number> = {
      sort_by: "popularity.desc",
      page: data.page ?? 1,
    };
    if (data.genre) params.with_genres = data.genre;
    if (data.year) {
      params[data.type === "movie" ? "primary_release_year" : "first_air_date_year"] = data.year;
    }
    if (data.provider) {
      params.watch_region = data.region ?? "BR";
      params.with_watch_providers = data.provider;
    }
    if (data.anime) {
      params.with_genres = 16;
      params.with_original_language = "ja";
    }
    const page = Number(params.page);
    const [r, next] = await Promise.all([
      tmdb<{ results: TmdbItem[]; total_pages: number; page: number }>(`/discover/${data.type}`, params),
      tmdb<{ results: TmdbItem[] }>(`/discover/${data.type}`, { ...params, page: page + 1 }).catch(
        () => ({ results: [] as TmdbItem[] }),
      ),
    ]);
    const ids = new Set(r.results.map((i) => i.id));
    const extra = next.results.filter((i) => !ids.has(i.id)).slice(0, 10);
    return {
      results: [...r.results, ...extra].map((i) => normalize(i, data.type)),
      page: r.page,
      totalPages: Math.min(r.total_pages, 500),
    };
  });


