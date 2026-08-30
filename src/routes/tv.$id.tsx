import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Play, Plus, Star, ThumbsUp, ThumbsDown, ChevronDown } from "lucide-react";
import { getTv, getSeason } from "@/lib/tmdb.functions";

const BD = "https://image.tmdb.org/t/p/original";
const STILL = "https://image.tmdb.org/t/p/w300";

const tvQuery = (id: number) =>
  queryOptions({ queryKey: ["tv", id], queryFn: () => getTv({ data: { id } }) });

export const Route = createFileRoute("/tv/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.id} — Série — Mozflix` },
      { name: "description", content: "Assista esta série no Mozflix." },
      { property: "og:title", content: "Série — Mozflix" },
      { property: "og:description", content: "Assista esta série no Mozflix." },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context, params }) => context.queryClient.ensureQueryData(tvQuery(Number(params.id))),
  component: TvPage,
});

function TvPage() {
  const { id } = Route.useParams();
  const tvId = Number(id);
  const { data: tv } = useSuspenseQuery(tvQuery(tvId));
  const [season, setSeason] = useState(tv.seasons[0]?.season_number ?? 1);
  const [episode, setEpisode] = useState<number | null>(null);

  const { data: episodes } = useQuery({
    queryKey: ["season", tvId, season],
    queryFn: () => getSeason({ data: { id: tvId, season } }),
  });

  const match = Math.round(tv.vote_average * 10);

  return (
    <div className="min-h-screen bg-charcoal-950 font-body px-3 sm:px-6 lg:px-12 py-20 sm:py-24">
      <div className="max-w-7xl mx-auto bg-charcoal-900 rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] border border-charcoal-700 flex flex-col lg:flex-row">
        {/* Main Hero / Story Section */}
        <div className="flex-1 relative group overflow-hidden">
          <div className="absolute inset-0">
            {tv.backdrop_path ? (
              <img
                src={`${BD}${tv.backdrop_path}`}
                alt={tv.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-charcoal-800" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900 via-transparent to-transparent" />
          </div>

          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={() => setEpisode(1)}
              aria-label="Assistir primeiro episódio"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 cursor-pointer shadow-2xl"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-ember flex items-center justify-center shadow-[0_0_30px_rgba(232,93,58,0.4)]">
                <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-current ml-1" />
              </div>
            </button>
          </div>

          {/* Content Overlay */}
          <div className="relative h-full min-h-[520px] lg:min-h-[640px] flex flex-col justify-end p-6 sm:p-8 lg:p-12 space-y-5 sm:space-y-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-ember text-white text-[10px] sm:text-xs font-bold rounded-full uppercase tracking-widest">
                  Série
                </span>
                <span className="text-ember font-bold text-sm">{match}% relevante</span>
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-display font-extrabold text-white leading-none tracking-tighter">
                {tv.title}
              </h1>
              {tv.tagline && (
                <p className="text-base sm:text-xl text-white/70 italic font-light max-w-2xl mt-2">
                  {tv.tagline}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm font-medium text-white/50">
              {tv.first_air_date && <span>{tv.first_air_date.slice(0, 4)}</span>}
              {tv.first_air_date && tv.number_of_seasons && (
                <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
              )}
              <span>{tv.number_of_seasons} temporada(s)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
              <span className="px-2 py-0.5 border border-white/20 rounded text-[10px] tracking-widest uppercase text-white/70">
                HD
              </span>
              <span className="flex items-center gap-1 text-white/70">
                <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                {tv.vote_average.toFixed(1)}
              </span>
            </div>

            <p className="max-w-xl text-white/70 leading-relaxed text-base sm:text-lg">
              {tv.overview}
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={() => setEpisode(1)}
                className="flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white text-black font-bold rounded-2xl hover:bg-white/90 transition-colors cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                Assistir agora
              </button>
              <button
                aria-label="Adicionar à lista"
                className="p-3.5 sm:p-4 rounded-2xl bg-charcoal-700 border border-charcoal-500 text-white hover:bg-charcoal-600 transition-colors cursor-pointer"
              >
                <Plus className="w-6 h-6" />
              </button>
              <button
                aria-label="Gostei"
                className="p-3.5 sm:p-4 rounded-2xl bg-charcoal-700 border border-charcoal-500 text-white hover:bg-charcoal-600 transition-colors cursor-pointer"
              >
                <ThumbsUp className="w-6 h-6" />
              </button>
              <button
                aria-label="Não gostei"
                className="p-3.5 sm:p-4 rounded-2xl bg-charcoal-700 border border-charcoal-500 text-white hover:bg-charcoal-600 transition-colors cursor-pointer"
              >
                <ThumbsDown className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar / Episode List */}
        <div className="w-full lg:w-[420px] bg-charcoal-850 border-l border-charcoal-700 flex flex-col">
          <div className="p-6 sm:p-8 border-b border-charcoal-700 flex flex-col gap-4">
            <div className="flex justify-between items-center gap-4">
              <h3 className="text-xl font-display font-bold text-white">Episódios</h3>
              <div className="relative">
                <select
                  value={season}
                  onChange={(e) => { setSeason(Number(e.target.value)); setEpisode(null); }}
                  className="appearance-none bg-charcoal-700 border border-charcoal-500 rounded-xl pl-4 pr-10 py-2.5 text-sm font-semibold text-white/90 focus:outline-none focus:ring-2 focus:ring-ember/50 cursor-pointer"
                >
                  {tv.seasons.map((s) => (
                    <option key={s.season_number} value={s.season_number}>{s.name}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/50" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {tv.genres.map((g) => (
                <span
                  key={g.id}
                  className="px-3 py-1.5 bg-charcoal-700 text-white/70 text-xs rounded-lg border border-charcoal-600"
                >
                  {g.name}
                </span>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[600px] lg:max-h-none">
            {episodes?.map((ep) => (
              <button
                key={ep.episode_number}
                onClick={() => setEpisode(ep.episode_number)}
                className={`w-full text-left p-4 rounded-2xl transition-all group cursor-pointer ${
                  episode === ep.episode_number
                    ? "bg-charcoal-700/80 border border-ember/40"
                    : "bg-transparent hover:bg-charcoal-700 border border-transparent"
                }`}
              >
                <div className="flex gap-4">
                  <div className="relative w-32 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-charcoal-700">
                    {ep.still_path ? (
                      <img
                        src={`${STILL}${ep.still_path}`}
                        alt={ep.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-white/40">Sem imagem</div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-6 h-6 text-ember fill-current" />
                    </div>
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <div className={`text-xs font-bold mb-1 ${episode === ep.episode_number ? "text-ember" : "text-white/40"}`}>
                      S{season} : E{ep.episode_number}
                    </div>
                    <div className={`text-sm font-semibold mb-1 truncate group-hover:text-ember transition-colors ${episode === ep.episode_number ? "text-ember" : "text-white"}`}>
                      {ep.name}
                    </div>
                    {ep.air_date && (
                      <div className="text-zinc-500 text-xs">{ep.air_date.slice(0, 4)}</div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Player modal */}
      {episode !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <div className="w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl relative">
            <iframe
              src={`https://myembed.biz/serie/${tv.id}/${season}/${episode}`}
              className="w-full h-full"
              frameBorder={0}
              allowFullScreen
              loading="lazy"
            />
            <button
              onClick={() => setEpisode(null)}
              aria-label="Fechar player"
              className="absolute top-4 right-4 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-white text-sm font-medium transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
