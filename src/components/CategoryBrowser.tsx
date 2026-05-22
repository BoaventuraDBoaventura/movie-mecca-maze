import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Check } from "lucide-react";
import { discoverMedia, getGenres, type MediaItem } from "@/lib/tmdb.functions";

const IMG = "https://image.tmdb.org/t/p/w500";

interface Props {
  title: string;
  type: "movie" | "tv";
  anime?: boolean;
}

export function CategoryBrowser({ title, type, anime }: Props) {
  const [genre, setGenre] = useState<{ id: number; name: string } | null>(null);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Reset to page 1 when filter changes
  useEffect(() => { setPage(1); }, [genre?.id, anime, type]);

  const genresQuery = useQuery({
    queryKey: ["genres", type],
    queryFn: () => getGenres({ data: { type } }),
    staleTime: 1000 * 60 * 60,
  });

  const itemsQuery = useQuery({
    queryKey: ["discover", type, genre?.id ?? null, anime ?? false, page],
    queryFn: () =>
      discoverMedia({ data: { type, genre: genre?.id, anime, page } }),
    placeholderData: (prev) => prev,
  });

  const genres = genresQuery.data ?? [];
  const items = itemsQuery.data?.results ?? [];
  const totalPages = itemsQuery.data?.totalPages ?? 1;


  return (
    <div className="pt-24 pb-12">
      <div className="px-3 sm:px-4 md:px-12 flex items-center gap-3 flex-wrap">
        <h1 className="text-3xl md:text-4xl font-black">{title}</h1>
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 border border-foreground/60 hover:border-foreground bg-background/40 px-3 py-1.5 text-sm font-medium"
          >
            <span>{genre?.name ?? "Gêneros"}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
          {open && (
            <div className="absolute left-0 top-full mt-1 z-30 w-64 max-h-[60vh] overflow-y-auto bg-background/95 backdrop-blur border border-border shadow-xl">
              <button
                onClick={() => { setGenre(null); setOpen(false); }}
                className="w-full flex items-center justify-between px-4 py-2 text-sm text-left hover:bg-primary/20"
              >
                <span>Todos os gêneros</span>
                {genre === null && <Check className="w-4 h-4" />}
              </button>
              <div className="h-px bg-border" />
              <div className="grid grid-cols-2">
                {genres.map((g) => {
                  const active = genre?.id === g.id;
                  return (
                    <button
                      key={g.id}
                      onClick={() => { setGenre(g); setOpen(false); }}
                      className={`flex items-center justify-between px-4 py-2 text-sm text-left hover:bg-primary/20 ${active ? "text-primary" : ""}`}
                    >
                      <span className="truncate">{g.name}</span>
                      {active && <Check className="w-4 h-4 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-3 sm:px-4 md:px-12">
        <Grid items={itemsQuery.data ?? []} loading={itemsQuery.isLoading} type={type} />
      </div>
    </div>
  );
}

function Grid({ items, loading, type }: { items: MediaItem[]; loading: boolean; type: "movie" | "tv" }) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3 mt-6">
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
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3 mt-6">
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
