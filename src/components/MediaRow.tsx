import { Link } from "@tanstack/react-router";
import type { MediaItem } from "@/lib/tmdb.functions";

const IMG = "https://image.tmdb.org/t/p/w500";

export function MediaRow({ title, items }: { title: string; items: MediaItem[] }) {
  return (
    <section className="px-3 sm:px-4 md:px-12 my-6 md:my-8">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3">{title}</h2>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-3 sm:-mx-4 md:-mx-12 px-3 sm:px-4 md:px-12">
        {items.map((item) => (
          <Link
            key={`${item.media_type}-${item.id}`}
            to={item.media_type === "movie" ? "/movie/$id" : "/tv/$id"}
            params={{ id: String(item.id) }}
            className="shrink-0 w-28 sm:w-36 md:w-44 group relative"
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
            <p className="mt-1 text-sm text-muted-foreground truncate">{item.title}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
