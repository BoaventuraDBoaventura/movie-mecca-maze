import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { discoverMedia, getGenres, type MediaItem } from "@/lib/tmdb.functions";

const IMG = "https://image.tmdb.org/t/p/w500";

interface Props {
  type: "movie" | "tv";
  anime?: boolean;
  /** Restrict displayed genres to this allow-list (e.g. anime sub-genres). */
  allowedGenreIds?: number[];
}

export function CategoryBrowser({ type, anime, allowedGenreIds }: Props) {
  const [genre, setGenre] = useState<number | null>(null);

  const genresQuery = useQuery({
    queryKey: ["genres", type],
    queryFn: () => getGenres({ data: { type } }),
    staleTime: 1000 * 60 * 60,
  });

  const itemsQuery = useQuery({
    queryKey: ["discover", type, genre, anime ?? false],
    queryFn: () =>
      discoverMedia({ data: { type, genre: genre ?? undefined, anime } }),
  });

  const allGenres = genresQuery.data ?? [];
  const genres = allowedGenreIds
    ? allGenres.filter((g) => allowedGenreIds.includes(g.id))
    : allGenres;

  return (
    <div className="px-3 sm:px-4 md:px-12 mt-6">
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 -mx-3 sm:-mx-4 md:-mx-12 px-3 sm:px-4 md:px-12">
        <button
          onClick={() => setGenre(null)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-sm border transition ${
            genre === null
              ? "bg-primary border-primary text-primary-foreground"
              : "border-border bg-background/50 hover:border-primary"
          }`}
        >
          Todos
        </button>
        {genres.map((g) => (
          <button
            key={g.id}
            onClick={() => setGenre(g.id)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm border transition ${
              genre === g.id
                ? "bg-primary border-primary text-primary-foreground"
                : "border-border bg-background/50 hover:border-primary"
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>

      <Grid items={itemsQuery.data ?? []} loading={itemsQuery.isLoading} type={type} />
    </div>
  );
}

function Grid({ items, loading, type }: { items: MediaItem[]; loading: boolean; type: "movie" | "tv" }) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3 mt-4">
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className="aspect-[2/3] rounded bg-card animate-pulse" />
        ))}
      </div>
    );
  }
  if (!items.length) {
    return <p className="mt-6 text-muted-foreground">Nada encontrado.</p>;
  }
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3 mt-4">
      {items.map((item) => (
        <Link
          key={item.id}
          to={type === "movie" ? "/movie/$id" : "/tv/$id"}
          params={{ id: String(item.id) }}
          className="group"
        >
          <div className="aspect-[2/3] overflow-hidden rounded bg-card transition-transform duration-200 group-hover:scale-105 group-hover:ring-2 group-hover:ring-primary">
            {item.poster_path ? (
              <img
                src={`${IMG}${item.poster_path}`}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs p-2 text-center">
                {item.title}
              </div>
            )}
          </div>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground truncate">{item.title}</p>
        </Link>
      ))}
    </div>
  );
}
