import { Link } from "@tanstack/react-router";
import { Play, Info, Star } from "lucide-react";
import { useEffect, useState } from "react";
import type { MediaItem } from "@/lib/tmdb.functions";

const BD = "https://image.tmdb.org/t/p/original";

export function Hero({ items }: { items: MediaItem[] }) {
  const pool = items.filter((i) => i.backdrop_path);
  const list = pool.length ? pool : items;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (list.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % list.length);
    }, 60_000);
    return () => clearInterval(id);
  }, [list.length]);

  const item = list[index];
  if (!item) return null;

  const to = item.media_type === "movie" ? "/movie/$id" : "/tv/$id";
  const year = (item.release_date ?? item.first_air_date ?? "").slice(0, 4);
  const rating = item.vote_average ? item.vote_average.toFixed(1) : null;

  return (
    <section className="relative h-[78vh] md:h-[88vh] min-h-[460px] w-full overflow-hidden">
      {list.map((it, i) =>
        it.backdrop_path ? (
          <img
            key={it.id}
            src={`${BD}${it.backdrop_path}`}
            alt={it.title}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1200ms] ease-out ${
              i === index ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
          />
        ) : null,
      )}

      {/* Cinematic vignette layers */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

      <div className="relative z-10 h-full flex flex-col justify-end pb-14 md:pb-20 px-4 sm:px-6 md:px-12">
        <div key={item.id} className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 bg-primary/90 text-primary-foreground text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm">
              Em destaque
            </span>
            {rating && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-foreground/90 bg-background/50 backdrop-blur px-2 py-1 rounded-sm border border-border/60">
                <Star className="w-3.5 h-3.5 fill-primary text-primary" /> {rating}
              </span>
            )}
            {year && (
              <span className="text-xs font-medium text-muted-foreground bg-background/50 backdrop-blur px-2 py-1 rounded-sm border border-border/60">
                {year}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black leading-[0.95] tracking-tight mb-3 md:mb-5 drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
            {item.title}
          </h1>

          <p className="text-sm md:text-lg text-foreground/85 line-clamp-3 mb-6 max-w-xl drop-shadow">
            {item.overview}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={to}
              params={{ id: String(item.id) }}
              className="flex items-center gap-2 bg-foreground text-background font-bold px-6 md:px-8 py-2.5 md:py-3 rounded-full text-sm md:text-base hover:bg-foreground/85 transition-colors"
            >
              <Play className="w-5 h-5 fill-current" /> Assistir
            </Link>
            <Link
              to={to}
              params={{ id: String(item.id) }}
              className="flex items-center gap-2 bg-foreground/10 backdrop-blur border border-foreground/25 text-foreground font-semibold px-5 md:px-7 py-2.5 md:py-3 rounded-full text-sm md:text-base hover:bg-foreground/20 transition-colors"
            >
              <Info className="w-5 h-5" /> Mais informações
            </Link>
          </div>
        </div>

        {list.length > 1 && (
          <div className="flex items-center gap-2 mt-8">
            {list.map((it, i) => (
              <button
                key={it.id}
                onClick={() => setIndex(i)}
                aria-label={`Ver ${it.title}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-8 bg-primary" : "w-3 bg-foreground/30 hover:bg-foreground/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
