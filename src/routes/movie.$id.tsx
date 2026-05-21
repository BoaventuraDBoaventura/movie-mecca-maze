import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Play } from "lucide-react";
import { getMovie } from "@/lib/tmdb.functions";

const BD = "https://image.tmdb.org/t/p/original";

const movieQuery = (id: number) =>
  queryOptions({ queryKey: ["movie", id], queryFn: () => getMovie({ data: { id } }) });

export const Route = createFileRoute("/movie/$id")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(movieQuery(Number(params.id))),
  component: MoviePage,
});

function MoviePage() {
  const { id } = Route.useParams();
  const { data: movie } = useSuspenseQuery(movieQuery(Number(id)));
  const [playing, setPlaying] = useState(false);

  return (
    <div>
      <div className="relative pt-16">
        {playing ? (
          <div className="w-full aspect-video bg-black">
            <iframe
              src={`https://myembed.biz/filme/${movie.id}`}
              className="w-full h-full"
              frameBorder={0}
              allowFullScreen
              loading="lazy"
            />
          </div>
        ) : (
          <div className="relative h-[50vh] sm:h-[60vh] min-h-[320px]">
            {movie.backdrop_path && (
              <img src={`${BD}${movie.backdrop_path}`} alt={movie.title} className="absolute inset-0 w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            <button
              onClick={() => setPlaying(true)}
              className="absolute inset-0 flex items-center justify-center group"
              aria-label="Reproduzir"
            >
              <div className="bg-primary/90 group-hover:bg-primary text-primary-foreground rounded-full p-4 sm:p-6 shadow-2xl transition">
                <Play className="w-8 h-8 sm:w-12 sm:h-12 fill-current" />
              </div>
            </button>
          </div>
        )}
      </div>
      <div className="px-3 sm:px-4 md:px-12 py-6 md:py-8 max-w-4xl">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-black mb-2">{movie.title}</h1>
        {movie.tagline && <p className="text-muted-foreground italic mb-4 text-sm sm:text-base">{movie.tagline}</p>}
        <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground mb-4">
          {movie.release_date && <span>{movie.release_date.slice(0, 4)}</span>}
          {movie.runtime && <span>{movie.runtime} min</span>}
          <span className="text-primary">★ {movie.vote_average.toFixed(1)}</span>
          {movie.genres.map((g) => (
            <span key={g.id} className="px-2 py-0.5 bg-muted rounded">{g.name}</span>
          ))}
        </div>
        <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">{movie.overview}</p>
      </div>
    </div>
  );
}
