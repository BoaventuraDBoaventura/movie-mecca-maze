import { Link } from "@tanstack/react-router";
import { Play, Info } from "lucide-react";
import type { MediaItem } from "@/lib/tmdb.functions";

const BD = "https://image.tmdb.org/t/p/original";

export function Hero({ item }: { item: MediaItem }) {
  return (
    <section className="relative h-[85vh] min-h-[500px] w-full">
      {item.backdrop_path && (
        <img
          src={`${BD}${item.backdrop_path}`}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
      <div className="relative z-10 h-full flex flex-col justify-end pb-24 px-4 md:px-12 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-black mb-4 drop-shadow-lg">{item.title}</h1>
        <p className="text-sm md:text-base text-foreground/90 line-clamp-3 mb-6 drop-shadow">
          {item.overview}
        </p>
        <div className="flex gap-3">
          <Link
            to={item.media_type === "movie" ? "/movie/$id" : "/tv/$id"}
            params={{ id: String(item.id) }}
            className="flex items-center gap-2 bg-white text-black font-semibold px-6 py-2.5 rounded hover:bg-white/85 transition-colors"
          >
            <Play className="w-5 h-5 fill-current" /> Assistir
          </Link>
          <Link
            to={item.media_type === "movie" ? "/movie/$id" : "/tv/$id"}
            params={{ id: String(item.id) }}
            className="flex items-center gap-2 bg-muted/80 text-foreground font-semibold px-6 py-2.5 rounded hover:bg-muted transition-colors"
          >
            <Info className="w-5 h-5" /> Mais informações
          </Link>
        </div>
      </div>
    </section>
  );
}
