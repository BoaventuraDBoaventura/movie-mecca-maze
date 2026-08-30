import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Play, Plus, Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { getMovie } from "@/lib/tmdb.functions";

const BD = "https://image.tmdb.org/t/p/original";

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

  return (
    <div className="min-h-screen bg-charcoal-950 font-body px-3 sm:px-6 lg:px-12 py-20 sm:py-24">
      <div className="max-w-7xl mx-auto bg-charcoal-900 rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] border border-charcoal-700 flex flex-col lg:flex-row">
        {/* Main Hero / Story Section */}
        <div className="flex-1 relative group overflow-hidden">
          <div className="absolute inset-0">
            {movie.backdrop_path ? (
              <img
                src={`${BD}${movie.backdrop_path}`}
                alt={movie.title}
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
              onClick={() => setPlaying(true)}
              aria-label="Assistir agora"
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
                  Filme
                </span>
                <span className="text-ember font-bold text-sm">{match}% relevante</span>
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-display font-extrabold text-white leading-none tracking-tighter">
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="text-base sm:text-xl text-white/70 italic font-light max-w-2xl mt-2">
                  {movie.tagline}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm font-medium text-white/50">
              {movie.release_date && <span>{movie.release_date.slice(0, 4)}</span>}
              {movie.release_date && movie.runtime && (
                <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
              )}
              {movie.runtime && <span>{movie.runtime} min</span>}
              {movie.runtime && (
                <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
              )}
              <span className="px-2 py-0.5 border border-white/20 rounded text-[10px] tracking-widest uppercase text-white/70">
                HD
              </span>
              <span className="flex items-center gap-1 text-white/70">
                <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                {movie.vote_average.toFixed(1)}
              </span>
            </div>

            <p className="max-w-xl text-white/70 leading-relaxed text-base sm:text-lg">
              {movie.overview}
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={() => setPlaying(true)}
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

        {/* Sidebar */}
        <div className="w-full lg:w-[420px] bg-charcoal-850 border-l border-charcoal-700 flex flex-col">
          <div className="p-6 sm:p-8 border-b border-charcoal-700 flex flex-col gap-4">
            <h3 className="text-xl font-display font-bold text-white">Informações</h3>
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((g) => (
                <span
                  key={g.id}
                  className="px-3 py-1.5 bg-charcoal-700 text-white/70 text-xs rounded-lg border border-charcoal-600"
                >
                  {g.name}
                </span>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            <InfoRow label="Título original" value={movie.title} />
            <InfoRow label="Ano" value={movie.release_date ? movie.release_date.slice(0, 4) : "—"} />
            <InfoRow label="Duração" value={movie.runtime ? `${movie.runtime} min` : "—"} />
            <InfoRow label="Avaliação" value={`${movie.vote_average.toFixed(1)} / 10`} />
            <InfoRow label="Relevância" value={`${match}%`} />
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-4 p-4 rounded-2xl bg-charcoal-700/50 border border-charcoal-700/50">
      <span className="text-xs uppercase tracking-wider text-white/40 font-semibold">{label}</span>
      <span className="text-sm text-white/80 text-right">{value}</span>
    </div>
  );
}
