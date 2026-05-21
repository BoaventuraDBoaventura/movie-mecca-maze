import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Play } from "lucide-react";
import { getTv, getSeason } from "@/lib/tmdb.functions";

const BD = "https://image.tmdb.org/t/p/original";
const STILL = "https://image.tmdb.org/t/p/w300";

const tvQuery = (id: number) =>
  queryOptions({ queryKey: ["tv", id], queryFn: () => getTv({ data: { id } }) });

export const Route = createFileRoute("/tv/$id")({
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

  return (
    <div>
      <div className="relative pt-16">
        {episode !== null ? (
          <div className="w-full aspect-video bg-black">
            <iframe
              src={`https://myembed.biz/serie/${tv.id}/${season}/${episode}`}
              className="w-full h-full"
              frameBorder={0}
              allowFullScreen
              loading="lazy"
            />
          </div>
        ) : (
          <div className="relative h-[40vh] sm:h-[60vh] min-h-[260px]">
            {tv.backdrop_path && (
              <img src={`${BD}${tv.backdrop_path}`} alt={tv.title} className="absolute inset-0 w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          </div>
        )}
      </div>

      <div className="px-3 sm:px-4 md:px-12 py-6 md:py-8">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-black mb-2">{tv.title}</h1>
        {tv.tagline && <p className="text-muted-foreground italic mb-4 text-sm sm:text-base">{tv.tagline}</p>}
        <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground mb-4">
          {tv.first_air_date && <span>{tv.first_air_date.slice(0, 4)}</span>}
          <span>{tv.number_of_seasons} temporada(s)</span>
          <span className="text-primary">★ {tv.vote_average.toFixed(1)}</span>
          {tv.genres.map((g) => (
            <span key={g.id} className="px-2 py-0.5 bg-muted rounded">{g.name}</span>
          ))}
        </div>
        <p className="text-sm sm:text-base text-foreground/90 leading-relaxed max-w-3xl mb-6 md:mb-8">{tv.overview}</p>

        <div className="flex items-center gap-3 mb-6">
          <label className="text-sm text-muted-foreground">Temporada:</label>
          <select
            value={season}
            onChange={(e) => { setSeason(Number(e.target.value)); setEpisode(null); }}
            className="bg-card border border-border rounded px-3 py-2 text-sm"
          >
            {tv.seasons.map((s) => (
              <option key={s.season_number} value={s.season_number}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="grid gap-3">
          {episodes?.map((ep) => (
            <button
              key={ep.episode_number}
              onClick={() => setEpisode(ep.episode_number)}
              className={`flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 rounded-lg text-left transition border ${
                episode === ep.episode_number ? "border-primary bg-primary/10" : "border-border hover:bg-card"
              }`}
            >
              <div className="shrink-0 w-full sm:w-40 aspect-video bg-muted rounded overflow-hidden relative">
                {ep.still_path ? (
                  <img src={`${STILL}${ep.still_path}`} alt={ep.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">Sem imagem</div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition">
                  <Play className="w-8 h-8 fill-white text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm sm:text-base">{ep.episode_number}. {ep.name}</p>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-1">{ep.overview || "Sem descrição."}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
