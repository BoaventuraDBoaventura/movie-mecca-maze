import { Link } from "@tanstack/react-router";
import { Play, Info } from "lucide-react";
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

  return (
    <section className="relative h-[70vh] sm:h-[80vh] md:h-[85vh] min-h-[420px] w-full overflow-hidden">
      {list.map((it, i) => (
        it.backdrop_path && (
          <img
            key={it.id}
            src={`${BD}${it.backdrop_path}`}
            alt={it.title}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === index ? "opacity-100" : "opacity-0"}`}
          />
        )
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
      <div className="relative z-10 h-full flex flex-col justify-end pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 md:px-12 max-w-3xl">
        <h1 className="text-2xl sm:text-4xl md:text-6xl font-black mb-3 md:mb-4 drop-shadow-lg">{item.title}</h1>
        <p className="text-xs sm:text-sm md:text-base text-foreground/90 line-clamp-2 sm:line-clamp-3 mb-4 md:mb-6 drop-shadow">
          {item.overview}
        </p>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Link
            to={item.media_type === "movie" ? "/movie/$id" : "/tv/$id"}
            params={{ id: String(item.id) }}
            className="flex items-center gap-2 bg-white text-black font-semibold px-4 sm:px-6 py-2 sm:py-2.5 rounded text-sm sm:text-base hover:bg-white/85 transition-colors"
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" /> Assistir
          </Link>
          <Link
            to={item.media_type === "movie" ? "/movie/$id" : "/tv/$id"}
            params={{ id: String(item.id) }}
            className="flex items-center gap-2 bg-muted/80 text-foreground font-semibold px-4 sm:px-6 py-2 sm:py-2.5 rounded text-sm sm:text-base hover:bg-muted transition-colors"
          >
            <Info className="w-4 h-4 sm:w-5 sm:h-5" /> Mais informações
          </Link>
        </div>
      </div>
    </section>
  );
}
