import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Play, Plus, Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { getMovie } from "@/lib/tmdb.functions";
import { RecommendationsRow } from "@/components/RecommendationsRow";

const BD = "https://image.tmdb.org/t/p/original";
const POSTER = "https://image.tmdb.org/t/p/w500";

const movieQuery = (id: number) =>
  queryOptions({ queryKey: ["movie", id], queryFn: () => getMovie({ data: { id } }) });

export const Route = createFileRoute("/movie/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.id} — Filme — Mozflix` },
      { name: "description", content: "Assista este filme no Mozflix." },
      { property: "og:title", content: "Filme — Mozflix" },
      { property: "og:description", content: "Assista este filme no Mozflix." },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context, params }) => context.queryClient.ensureQueryData(movieQuery(Number(params.id))),
  component: MoviePage,
});

function MoviePage() {
  const { id } = Route.useParams();
  const { data: movie } = useSuspenseQuery(movieQuery(Number(id)));
  const [playing, setPlaying] = useState(false);
  const match = Math.round(movie.vote_average * 10);

  const year = movie.release_date ? movie.release_date.slice(0, 4) : null;

  return (
    <div className="min-h-screen bg-charcoal-950 px-3 pb-12 pt-28 font-body sm:px-6 sm:py-24 lg:px-12">
      {/* Backdrop banner */}
      <div className="relative mx-auto h-48 max-w-6xl overflow-hidden rounded-xl sm:h-72 sm:rounded-3xl lg:h-80">
        {movie.backdrop_path ? (
          <img
            src={`${BD}${movie.backdrop_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-charcoal-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/70 to-charcoal-900/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/90 via-charcoal-950/30 to-transparent" />
      </div>

      {/* Main content card */}
      <div className="relative z-10 mx-auto -mt-14 max-w-6xl sm:-mt-32 lg:-mt-36">
        <div className="rounded-xl border border-charcoal-700 bg-charcoal-900 p-4 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.7)] sm:rounded-3xl sm:p-8 lg:p-10">
          <div className="flex flex-col md:flex-row gap-6 lg:gap-10">
            {/* Poster — smaller */}
            <div className="shrink-0 mx-auto md:mx-0">
              <div className="w-28 overflow-hidden rounded-xl border border-charcoal-700 bg-charcoal-800 shadow-2xl sm:w-44 sm:rounded-2xl lg:w-52">
                {movie.poster_path ? (
                  <img
                    src={`${POSTER}${movie.poster_path}`}
                    alt={movie.title}
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
                  Filme
                </span>
                <span className="text-ember font-semibold text-xs sm:text-sm">{match}% relevante</span>
              </div>

              <h1 className="break-words text-2xl font-bold leading-tight tracking-normal text-white sm:text-4xl lg:text-5xl">
                {movie.title}
              </h1>

              {movie.tagline && (
                <p className="mt-2 text-sm sm:text-base text-white/60 italic max-w-2xl">
                  {movie.tagline}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-4 text-xs sm:text-sm text-white/50">
                {year && <span>{year}</span>}
                {year && movie.runtime && <span className="w-1 h-1 rounded-full bg-white/30" />}
                {movie.runtime && <span>{movie.runtime} min</span>}
                {movie.runtime && <span className="w-1 h-1 rounded-full bg-white/30" />}
                <span className="px-1.5 py-0.5 border border-white/20 rounded text-[10px] tracking-wider uppercase text-white/70">
                  HD
                </span>
                <span className="flex items-center gap-1 text-white/70">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                  {movie.vote_average.toFixed(1)}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mt-5">
                {movie.genres.map((g) => (
                  <span
                    key={g.id}
                    className="px-3 py-1 bg-charcoal-700 text-white/80 text-xs rounded-full border border-charcoal-600"
                  >
                    {g.name}
                  </span>
                ))}
              </div>

              <p className="mt-5 text-sm sm:text-base text-white/70 leading-relaxed max-w-3xl">
                {movie.overview}
              </p>

              <div className="mt-6 grid grid-cols-[minmax(0,1fr)_auto_auto_auto] items-center gap-2 sm:flex sm:flex-wrap sm:gap-3">
                <button
                  onClick={() => setPlaying(true)}
                  className="flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-lg bg-ember px-3 py-2.5 font-semibold text-white shadow-[0_0_20px_rgba(232,93,58,0.35)] transition-colors hover:bg-ember/90 sm:rounded-xl sm:px-5"
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

               <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                <InfoBox label="Título original" value={movie.title} />
                <InfoBox label="Ano" value={year || "—"} />
                <InfoBox label="Duração" value={movie.runtime ? `${movie.runtime} min` : "—"} />
                <InfoBox label="Avaliação" value={`${movie.vote_average.toFixed(1)} / 10`} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <RecommendationsRow id={movie.id} type="movie" />

      {/* Player modal */}
      {playing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-2 sm:p-4">
          <div className="relative aspect-video w-full max-w-6xl overflow-hidden rounded-lg bg-black shadow-2xl sm:rounded-2xl">
            <iframe
              src={`https://myembed.biz/filme/${movie.id}`}
              className="w-full h-full"
              frameBorder={0}
              allowFullScreen
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-forms"
              referrerPolicy="no-referrer"
            />
            <button
              onClick={() => setPlaying(false)}
              aria-label="Fechar player"
              className="absolute right-2 top-2 min-h-11 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20 sm:right-4 sm:top-4"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-lg border border-charcoal-700/60 bg-charcoal-800/60 p-2.5 sm:rounded-xl sm:p-3">
      <div className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">{label}</div>
      <div className="text-sm text-white/80 truncate mt-1">{value}</div>
    </div>
  );
}
