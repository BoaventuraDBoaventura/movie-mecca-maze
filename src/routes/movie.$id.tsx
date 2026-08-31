import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Play, Plus, Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { getMovie } from "@/lib/tmdb.functions";

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
    <div className="min-h-screen bg-charcoal-950 font-body px-4 sm:px-6 lg:px-12 py-20 sm:py-24">
      {/* Backdrop banner */}
      <div className="max-w-6xl mx-auto relative h-56 sm:h-72 lg:h-80 rounded-3xl overflow-hidden">
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
      <div className="max-w-6xl mx-auto -mt-24 sm:-mt-32 lg:-mt-36 relative z-10">
        <div className="bg-charcoal-900 rounded-3xl border border-charcoal-700 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.7)] p-5 sm:p-8 lg:p-10">
          <div className="flex flex-col md:flex-row gap-6 lg:gap-10">
            {/* Poster — smaller */}
            <div className="shrink-0 mx-auto md:mx-0">
              <div className="w-36 sm:w-44 lg:w-52 rounded-2xl overflow-hidden shadow-2xl border border-charcoal-700 bg-charcoal-800">
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

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-display font-bold text-white leading-tight tracking-tight">
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

              <div className="flex flex-wrap items-center gap-3 mt-6">
                <button
                  onClick={() => setPlaying(true)}
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

              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <InfoBox label="Título original" value={movie.original_title || movie.title} />
                <InfoBox label="Ano" value={year || "—"} />
                <InfoBox label="Duração" value={movie.runtime ? `${movie.runtime} min` : "—"} />
                <InfoBox label="Avaliação" value={`${movie.vote_average.toFixed(1)} / 10`} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Player modal */}
      {playing && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <div className="w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl relative">
            <iframe
              src={`https://myembed.biz/filme/${movie.id}`}
              className="w-full h-full"
              frameBorder={0}
              allowFullScreen
              loading="lazy"
            />
            <button
              onClick={() => setPlaying(false)}
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

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-xl bg-charcoal-800/60 border border-charcoal-700/60">
      <div className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">{label}</div>
      <div className="text-sm text-white/80 truncate mt-1">{value}</div>
    </div>
  );
}
