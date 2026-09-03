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
    <section className="relative h-[760px] max-h-[88svh] min-h-[640px] w-full overflow-hidden sm:h-[78vh] md:h-[88vh] md:min-h-[560px]">
      {list.map((it, i) =>
        it.backdrop_path ? (
          <img
            key={it.id}
            src={`${BD}${it.backdrop_path}`}
            alt={it.title}
            className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-[1200ms] ease-out ${
              i === index ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
          />
        ) : null,
      )}

      {/* Cinematic vignette layers */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/25 to-transparent md:from-background/95 md:via-background/30" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

      <div className="relative z-10 flex h-full flex-col justify-end px-4 pb-12 sm:px-6 sm:pb-14 md:px-12 md:pb-20">
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

          <h1 className="mb-3 text-3xl font-black leading-[1.02] tracking-normal drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)] sm:text-5xl md:mb-5 md:text-7xl">
            {item.title}
          </h1>

          <p className="mb-5 line-clamp-3 max-w-xl text-sm leading-6 text-foreground/85 drop-shadow md:mb-6 md:text-lg">
            {item.overview}
          </p>

          <div className="grid max-w-sm grid-cols-1 gap-3 min-[360px]:grid-cols-2 sm:flex sm:max-w-none sm:flex-wrap sm:items-center">
            <Link
              to={to}
              params={{ id: String(item.id) }}
              className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-bold text-background transition-colors hover:bg-foreground/85 md:px-8 md:py-3 md:text-base"
            >
              <Play className="w-5 h-5 fill-current" /> Assistir
            </Link>
            <Link
              to={to}
              params={{ id: String(item.id) }}
              className="flex min-h-11 items-center justify-center gap-2 rounded-full border border-foreground/25 bg-foreground/10 px-4 py-2.5 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:bg-foreground/20 md:px-7 md:py-3 md:text-base"
            >
              <Info className="w-5 h-5" /> Mais informações
            </Link>
          </div>
        </div>

        {list.length > 1 && (
          <div className="mt-6 flex items-center gap-2 md:mt-8">
            {list.map((it, i) => (
              <button
                key={it.id}
                onClick={() => setIndex(i)}
                aria-label={`Ver ${it.title}`}
                className={`min-h-6 rounded-full transition-all duration-300 ${
                  i === index ? "w-8 bg-primary" : "w-5 bg-foreground/30 hover:bg-foreground/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
