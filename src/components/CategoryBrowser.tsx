import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Check, SlidersHorizontal, X } from "lucide-react";
import { discoverMedia, getGenres, getWatchProviders, type MediaItem } from "@/lib/tmdb.functions";

const IMG = "https://image.tmdb.org/t/p/w500";

interface Props {
  title: string;
  type: "movie" | "tv";
  anime?: boolean;
  filters: CatalogFilters;
  onFiltersChange: (filters: CatalogFilters) => void;
}

export interface CatalogFilters {
  genre?: number;
  year?: number;
  provider?: number;
  page: number;
}

export function CategoryBrowser({ title, type, anime, filters, onFiltersChange }: Props) {
  const [open, setOpen] = useState<"genre" | "year" | "provider" | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
       if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const genresQuery = useQuery({
    queryKey: ["genres", type],
    queryFn: () => getGenres({ data: { type } }),
    staleTime: 1000 * 60 * 60,
  });

  const providersQuery = useQuery({
    queryKey: ["watch-providers", type, "BR"],
    queryFn: () => getWatchProviders({ data: { type, region: "BR" } }),
    staleTime: 1000 * 60 * 60 * 24,
  });

  const itemsQuery = useQuery({
    queryKey: ["discover", type, filters.genre ?? null, filters.year ?? null, filters.provider ?? null, anime ?? false, filters.page],
    queryFn: () =>
      discoverMedia({ data: { type, genre: filters.genre, year: filters.year, provider: filters.provider, region: "BR", anime, page: filters.page } }),
    placeholderData: (prev) => prev,
  });

  const genres = genresQuery.data ?? [];
  const providers = providersQuery.data ?? [];
  const items = itemsQuery.data?.results ?? [];
  const totalPages = itemsQuery.data?.totalPages ?? 1;
  const activeGenre = genres.find((genre) => genre.id === filters.genre);
  const activeProvider = providers.find((provider) => provider.id === filters.provider);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, index) => currentYear - index);
  const hasFilters = Boolean(filters.genre || filters.year || filters.provider);
  const updateFilters = (next: Partial<CatalogFilters>) => onFiltersChange({ ...filters, ...next, page: next.page ?? 1 });


  return (
    <div className="pb-12 pt-28 sm:pt-24">
      <div className="px-3 sm:px-4 md:px-12">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:flex-wrap">
        <h1 className="min-w-0 truncate text-2xl font-black sm:text-3xl md:text-4xl">{title}</h1>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><SlidersHorizontal className="h-4 w-4" /> Filtros</span>
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 no-scrollbar" ref={ref}>
          <FilterMenu label={activeGenre?.name ?? "Gêneros"} open={open === "genre"} onToggle={() => setOpen(open === "genre" ? null : "genre")}>
            <FilterOption active={!filters.genre} label="Todos os gêneros" onClick={() => { updateFilters({ genre: undefined }); setOpen(null); }} />
            <div className="grid grid-cols-2 border-t border-border">
              {genres.map((genre) => <FilterOption key={genre.id} active={filters.genre === genre.id} label={genre.name} onClick={() => { updateFilters({ genre: genre.id }); setOpen(null); }} />)}
            </div>
          </FilterMenu>

          <FilterMenu label={filters.year ? String(filters.year) : "Ano"} open={open === "year"} onToggle={() => setOpen(open === "year" ? null : "year")}>
            <FilterOption active={!filters.year} label="Todos os anos" onClick={() => { updateFilters({ year: undefined }); setOpen(null); }} />
            <div className="grid grid-cols-3 border-t border-border">
              {years.map((year) => <FilterOption key={year} active={filters.year === year} label={String(year)} onClick={() => { updateFilters({ year }); setOpen(null); }} />)}
            </div>
          </FilterMenu>

          <FilterMenu label={activeProvider?.name ?? "Streaming"} open={open === "provider"} onToggle={() => setOpen(open === "provider" ? null : "provider")}>
            <FilterOption active={!filters.provider} label="Todas as plataformas" onClick={() => { updateFilters({ provider: undefined }); setOpen(null); }} />
            <div className="border-t border-border">
              {providers.map((provider) => <FilterOption key={provider.id} active={filters.provider === provider.id} label={provider.name} onClick={() => { updateFilters({ provider: provider.id }); setOpen(null); }} />)}
            </div>
          </FilterMenu>

          {hasFilters && (
          <button
            onClick={() => onFiltersChange({ page: 1 })}
            className="flex min-h-11 shrink-0 items-center gap-2 border border-border bg-background/40 px-3 text-sm text-muted-foreground hover:border-primary hover:text-foreground"
          >
            <X className="h-4 w-4" /> Limpar
          </button>
          )}
        </div>
      </div>

      <div className="px-3 sm:px-4 md:px-12">
        <Grid items={items} loading={itemsQuery.isLoading} type={type} />
        {totalPages > 1 && (
          <Pagination
             page={filters.page}
            totalPages={totalPages}
            onChange={(p) => {
               updateFilters({ page: p });
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}
      </div>

    </div>
  );
}

function FilterMenu({ label, open, onToggle, children }: { label: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className="relative shrink-0">
      <button onClick={onToggle} aria-expanded={open} className="flex min-h-11 max-w-48 items-center gap-2 border border-foreground/60 bg-background/40 px-3 text-sm font-medium hover:border-foreground">
        <span className="truncate">{label}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="fixed inset-x-3 top-44 z-40 max-h-[60svh] overflow-y-auto border border-border bg-background/98 shadow-2xl backdrop-blur sm:absolute sm:inset-x-auto sm:left-0 sm:top-full sm:mt-1 sm:w-72">{children}</div>}
    </div>
  );
}

function FilterOption({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return <button onClick={onClick} className={`flex min-h-11 w-full items-center justify-between gap-2 px-4 py-2 text-left text-sm hover:bg-primary/20 ${active ? "text-primary" : ""}`}><span className="truncate">{label}</span>{active && <Check className="h-4 w-4 shrink-0" />}</button>;
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

