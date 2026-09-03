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
    <div className="pb-12 pt-28 sm:pt-24">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3 sm:flex sm:flex-wrap sm:px-4 md:px-12">
        <h1 className="min-w-0 truncate text-2xl font-black sm:text-3xl md:text-4xl">{title}</h1>
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex min-h-11 max-w-40 items-center gap-2 border border-foreground/60 bg-background/40 px-3 py-1.5 text-sm font-medium hover:border-foreground"
          >
            <span>{genre?.name ?? "Gêneros"}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
          {open && (
            <div className="absolute right-0 top-full z-30 mt-1 max-h-[65svh] w-[min(18rem,calc(100vw-1.5rem))] overflow-y-auto border border-border bg-background/95 shadow-xl backdrop-blur sm:left-0 sm:right-auto">
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
        <Grid items={items} loading={itemsQuery.isLoading} type={type} />
        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={(p) => {
              setPage(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}
      </div>

    </div>
  );
}

function Grid({ items, loading, type }: { items: MediaItem[]; loading: boolean; type: "movie" | "tv" }) {
  if (loading) {
    return (
      <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-5 lg:grid-cols-5 xl:grid-cols-6">
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
    <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-5 lg:grid-cols-5 xl:grid-cols-6">
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

function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  const pages = getPageNumbers(page, totalPages);
  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-1">
      <PageBtn compact disabled={page <= 1} onClick={() => onChange(page - 1)}>‹<span className="sr-only">Anterior</span></PageBtn>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`e-${i}`} className="px-2 text-muted-foreground">…</span>
        ) : (
          <PageBtn key={p} active={p === page} onClick={() => onChange(p)}>{p}</PageBtn>
        ),
      )}
      <PageBtn compact disabled={page >= totalPages} onClick={() => onChange(page + 1)}>›<span className="sr-only">Próxima</span></PageBtn>
    </div>
  );
}

function PageBtn({ children, active, disabled, compact, onClick }: { children: React.ReactNode; active?: boolean; disabled?: boolean; compact?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`h-11 min-w-11 border text-sm transition ${compact ? "px-2 text-xl" : "px-3"} ${
        active
          ? "bg-primary border-primary text-primary-foreground"
          : "border-border bg-background/40 hover:border-foreground disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-border"
      }`}
    >
      {children}
    </button>
  );
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  const out: (number | "...")[] = [];
  const add = (n: number) => out.push(n);
  const window = 1;
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - window && i <= current + window)) {
      add(i);
    } else if (out[out.length - 1] !== "...") {
      out.push("...");
    }
  }
  return out;
}

