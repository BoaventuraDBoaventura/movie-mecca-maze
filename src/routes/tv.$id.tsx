import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Play, Plus, Star, ThumbsUp, ThumbsDown, ChevronDown } from "lucide-react";
import { getTv, getSeason } from "@/lib/tmdb.functions";

const BD = "https://image.tmdb.org/t/p/original";
const POSTER = "https://image.tmdb.org/t/p/w500";
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
  const year = tv.first_air_date ? tv.first_air_date.slice(0, 4) : null;

  return (
    <div className="min-h-screen bg-charcoal-950 font-body px-4 sm:px-6 lg:px-12 py-20 sm:py-24">
      {/* Backdrop banner */}
      <div className="max-w-6xl mx-auto relative h-56 sm:h-72 lg:h-80 rounded-3xl overflow-hidden">
        {tv.backdrop_path ? (
          <img
            src={`${BD}${tv.backdrop_path}`}
            alt={tv.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-charcoal-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/70 to-charcoal-900/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/90 via-charcoal-950/30 to-transparent" />
      </div>

      {/* Main content card */}
      <div className="max-w-6xl mx-auto -mt-24 sm:-mt-32 lg:-mt-36 relative z-10">
        <div className="bg-charcoal-900 rounded-3xl border border-charcoal-700 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.7)] p-5 sm:p-8 lg:p-10">
          <div className="flex flex-col md:flex-row gap-6 lg:gap-10">
            {/* Poster — smaller */}
            <div className="shrink-0 mx-auto md:mx-0">
              <div className="w-36 sm:w-44 lg:w-52 rounded-2xl overflow-hidden shadow-2xl border border-charcoal-700 bg-charcoal-800">
                {tv.poster_path ? (
                  <img
                    src={`${POSTER}${tv.poster_path}`}
                    alt={tv.title}
                    className="w-full h-auto object-cover"
                  />
                ) : (
                  <div className="aspect-[2/3] w-full flex items-center justify-center text-xs text-white/40">
                    Sem imagem
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-2.5 py-1 bg-ember text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                  Série
                </span>
                <span className="text-ember font-semibold text-xs sm:text-sm">{match}% relevante</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-display font-bold text-white leading-tight tracking-tight">
                {tv.title}
              </h1>

              {tv.tagline && (
                <p className="mt-2 text-sm sm:text-base text-white/60 italic max-w-2xl">
                  {tv.tagline}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-4 text-xs sm:text-sm text-white/50">
                {year && <span>{year}</span>}
                {year && tv.number_of_seasons && <span className="w-1 h-1 rounded-full bg-white/30" />}
                {tv.number_of_seasons && <span>{tv.number_of_seasons} temporada(s)</span>}
                {tv.number_of_seasons && <span className="w-1 h-1 rounded-full bg-white/30" />}
                <span className="px-1.5 py-0.5 border border-white/20 rounded text-[10px] tracking-wider uppercase text-white/70">
                  HD
                </span>
                <span className="flex items-center gap-1 text-white/70">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                  {tv.vote_average.toFixed(1)}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mt-5">
                {tv.genres.map((g) => (
                  <span
                    key={g.id}
                    className="px-3 py-1 bg-charcoal-700 text-white/80 text-xs rounded-full border border-charcoal-600"
                  >
                    {g.name}
                  </span>
                ))}
              </div>

              <p className="mt-5 text-sm sm:text-base text-white/70 leading-relaxed max-w-3xl">
                {tv.overview}
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-6">
                <button
                  onClick={() => setEpisode(1)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-ember text-white font-semibold rounded-xl hover:bg-ember/90 transition-colors cursor-pointer shadow-[0_0_20px_rgba(232,93,58,0.35)]"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Assistir agora
                </button>
                <button
                  aria-label="Adicionar à lista"
                  className="p-2.5 rounded-xl bg-charcoal-700 border border-charcoal-600 text-white hover:bg-charcoal-600 transition-colors cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <button
                  aria-label="Gostei"
                  className="p-2.5 rounded-xl bg-charcoal-700 border border-charcoal-600 text-white hover:bg-charcoal-600 transition-colors cursor-pointer"
                >
                  <ThumbsUp className="w-5 h-5" />
                </button>
                <button
                  aria-label="Não gostei"
                  className="p-2.5 rounded-xl bg-charcoal-700 border border-charcoal-600 text-white hover:bg-charcoal-600 transition-colors cursor-pointer"
                >
                  <ThumbsDown className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Episodes */}
          <div className="mt-10 pt-8 border-t border-charcoal-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
              <h3 className="text-lg font-display font-bold text-white">Episódios</h3>
              <div className="relative w-fit">
                <select
                  value={season}
                  onChange={(e) => { setSeason(Number(e.target.value)); setEpisode(null); }}
                  className="appearance-none bg-charcoal-800 border border-charcoal-600 rounded-xl pl-4 pr-10 py-2.5 text-sm font-semibold text-white/90 focus:outline-none focus:ring-2 focus:ring-ember/50 cursor-pointer"
                >
                  {tv.seasons.map((s) => (
                    <option key={s.season_number} value={s.season_number}>{s.name}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/50" />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {episodes?.map((ep) => (
                <button
                  key={ep.episode_number}
                  onClick={() => setEpisode(ep.episode_number)}
                  className={`text-left p-3 rounded-2xl transition-all group cursor-pointer border ${
                    episode === ep.episode_number
                      ? "bg-charcoal-800 border-ember/40"
                      : "bg-charcoal-800/40 border-charcoal-700/60 hover:bg-charcoal-800"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="relative w-28 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-charcoal-700">
                      {ep.still_path ? (
                        <img
                          src={`${STILL}${ep.still_path}`}
                          alt={ep.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-white/40">Sem imagem</div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-5 h-5 text-ember fill-current" />
                      </div>
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <div className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${episode === ep.episode_number ? "text-ember" : "text-white/40"}`}>
                        S{season} · E{ep.episode_number}
                      </div>
                      <div className={`text-sm font-semibold truncate ${episode === ep.episode_number ? "text-ember" : "text-white"}`}>
                        {ep.name}
                      </div>
                      {ep.air_date && (
                        <div className="text-white/40 text-xs mt-0.5">{ep.air_date.slice(0, 4)}</div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
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
