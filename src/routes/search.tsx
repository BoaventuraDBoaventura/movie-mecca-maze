import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { searchMulti } from "@/lib/tmdb.functions";
import { Link } from "@tanstack/react-router";
import { z } from "zod";

const IMG = "https://image.tmdb.org/t/p/w500";

export const Route = createFileRoute("/search")({
  validateSearch: z.object({ q: z.string().optional().default("") }),
  head: () => ({ meta: [{ title: "Buscar — Mozflix" }] }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const { data, isLoading } = useQuery({
    queryKey: ["search", q],
    queryFn: () => searchMulti({ data: { query: q } }),
    enabled: !!q,
  });

  return (
    <div className="px-3 pb-12 pt-28 sm:px-4 sm:pt-24 md:px-12">
      <h1 className="mb-5 break-words text-xl font-bold sm:text-2xl md:mb-6 md:text-3xl">
        {q ? `Resultados para "${q}"` : "Digite algo para buscar"}
      </h1>
      {isLoading && <p className="text-muted-foreground">Carregando...</p>}
      {data && data.results.length === 0 && q && (
        <p className="text-muted-foreground">Nada encontrado.</p>
      )}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
        {data?.results.map((item) => (
          <Link
            key={`${item.media_type}-${item.id}`}
            to={item.media_type === "movie" ? "/movie/$id" : "/tv/$id"}
            params={{ id: String(item.id) }}
            className="group"
          >
            <div className="aspect-[2/3] overflow-hidden rounded bg-card group-hover:ring-2 group-hover:ring-primary transition">
              {item.poster_path ? (
                <img src={`${IMG}${item.poster_path}`} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              ) : (
                <div className="flex items-center justify-center h-full text-xs text-muted-foreground p-2 text-center">{item.title}</div>
              )}
            </div>
            <p className="mt-1 text-sm truncate">{item.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
