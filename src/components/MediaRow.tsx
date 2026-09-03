import { Link } from "@tanstack/react-router";
import type { MediaItem } from "@/lib/tmdb.functions";

const IMG = "https://image.tmdb.org/t/p/w500";

export function MediaRow({ title, items }: { title: string; items: MediaItem[] }) {
  return (
    <section className="my-7 px-3 sm:px-4 md:my-8 md:px-12">
      <h2 className="mb-4 text-lg font-bold sm:text-2xl md:text-3xl">{title}</h2>
      <div className="no-scrollbar -mx-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 pb-3 sm:-mx-4 sm:px-4 md:-mx-12 md:gap-4 md:px-12">
        {items.map((item) => (
          <Link
            key={`${item.media_type}-${item.id}`}
            to={item.media_type === "movie" ? "/movie/$id" : "/tv/$id"}
            params={{ id: String(item.id) }}
            onFocus={(e) => e.currentTarget.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })}
            className="group relative w-[42vw] max-w-44 shrink-0 snap-start sm:w-44 md:w-56 md:max-w-none lg:w-60"
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
            <p className="mt-2 text-sm md:text-base text-muted-foreground truncate">{item.title}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
