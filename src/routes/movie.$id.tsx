import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Play, Plus, Star, ThumbsUp } from "lucide-react";
import { getMovie } from "@/lib/tmdb.functions";

const BD = "https://image.tmdb.org/t/p/original";

const movieQuery = (id: number) =>
  queryOptions({ queryKey: ["movie", id], queryFn: () => getMovie({ data: { id } }) });

export const Route = createFileRoute("/movie/$id")({
  head: () => ({ meta: [{ title: "Filme — Mozflix" }] }),
  loader: ({ context, params }) => context.queryClient.ensureQueryData(movieQuery(Number(params.id))),
  component: MoviePage,
});

function MoviePage() {
  const { id } = Route.useParams();
  const { data: movie } = useSuspenseQuery(movieQuery(Number(id)));
  const [playing, setPlaying] = useState(false);
  const match = Math.round(movie.vote_average * 10);

  return (
    <div className="px-3 sm:px-6 md:px-12 pb-12 pt-20 sm:pt-24">
      <div className="max-w-5xl mx-auto bg-card rounded-2xl overflow-hidden border border-border/60 shadow-2xl">
        {/* Hero */}
        {playing ? (
          <div className="w-full aspect-video bg-background">
            <iframe
              src={`https://myembed.biz/filme/${movie.id}`}
              className="w-full h-full"
              frameBorder={0}
              allowFullScreen
              loading="lazy"
            />
          </div>
        ) : (
          <div className="relative h-[46vh] sm:h-[500px] group overflow-hidden">
            {movie.backdrop_path && (
              <img
                src={`${BD}${movie.backdrop_path}`}
                alt={movie.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-background/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={() => setPlaying(true)}
                aria-label="Assistir agora"
                className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-foreground/10 hover:bg-primary backdrop-blur-md rounded-full border border-foreground/20 transition-all duration-300 hover:scale-110 cursor-pointer"
              >
                <Play className="w-7 h-7 sm:w-8 sm:h-8 text-foreground fill-current ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* Conteúdo */}
        <div className="relative px-5 sm:px-8 md:px-12 pb-8 sm:pb-12 -mt-16 sm:-mt-24 z-10">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="space-y-1.5 sm:space-y-2">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter">{movie.title}</h1>
              {movie.tagline && (
                <p className="text-base sm:text-xl md:text-2xl text-muted-foreground italic font-light max-w-2xl">{movie.tagline}</p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium text-muted-foreground">
              <span className="flex items-center gap-2 text-green-500 font-bold">{match}% relevante</span>
              {movie.release_date && <span>{movie.release_date.slice(0, 4)}</span>}
              {movie.runtime && <span>{movie.runtime} min</span>}
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-500 fill-current" />
                <span className="text-foreground">{movie.vote_average.toFixed(1)}</span>
              </span>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <button
                onClick={() => setPlaying(true)}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-bold text-sm sm:text-base transition-colors shadow-lg shadow-primary/20"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                Assistir agora
              </button>
              <button
                aria-label="Adicionar à lista"
                className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-foreground/10 hover:bg-foreground/20 rounded-lg border border-foreground/10 transition-all"
              >
                <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                aria-label="Gostei"
                className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-foreground/10 hover:bg-foreground/20 rounded-lg border border-foreground/10 transition-all"
              >
                <ThumbsUp className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {movie.genres.map((g) => (
                <span
                  key={g.id}
                  className="px-3 py-1 bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 rounded-full text-xs text-foreground/80 transition-colors cursor-default"
                >
                  {g.name}
                </span>
              ))}
            </div>

            <p className="text-sm sm:text-lg text-foreground/75 leading-relaxed font-light max-w-3xl">{movie.overview}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
