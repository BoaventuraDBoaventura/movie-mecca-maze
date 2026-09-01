import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Play, Star } from "lucide-react";
import { getRecommendations } from "@/lib/tmdb.functions";

const IMG = "https://image.tmdb.org/t/p/w342";

export function RecommendationsRow({ id, type }: { id: number; type: "movie" | "tv" }) {
  const { data: items } = useQuery({
    queryKey: ["recommendations", type, id],
    queryFn: () => getRecommendations({ data: { id, type } }),
  });

  if (!items || items.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <div className="flex items-center gap-3 mb-5">
        <span className="w-1 h-6 rounded-full bg-ember" />
        <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
          Títulos relacionados
        </h2>
      </div>
      <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-4 -mx-1 px-1">
        {items.map((item) => (
          <Link
            key={item.id}
            to={item.media_type === "movie" ? "/movie/$id" : "/tv/$id"}
            params={{ id: String(item.id) }}
            onFocus={(e) =>
              e.currentTarget.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
            }
            className="shrink-0 w-32 sm:w-40 md:w-48 group"
          >
            <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-charcoal-800 border border-charcoal-700 shadow-lg transition-all duration-300 group-hover:scale-[1.04] group-hover:ring-2 group-hover:ring-ember/60">
              {item.poster_path ? (
                <img
                  src={`${IMG}${item.poster_path}`}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/40 text-xs p-2 text-center">
                  {item.title}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="w-11 h-11 rounded-full bg-ember/90 flex items-center justify-center shadow-[0_0_20px_rgba(232,93,58,0.5)]">
                  <Play className="w-4 h-4 text-white fill-current" />
                </span>
              </div>
              <span className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 bg-black/70 backdrop-blur-sm rounded-md text-[10px] font-semibold text-white/90">
                <Star className="w-2.5 h-2.5 text-yellow-500 fill-current" />
                {item.vote_average.toFixed(1)}
              </span>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-white/70 truncate group-hover:text-white transition-colors">
              {item.title}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
