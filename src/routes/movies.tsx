import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getHomeData } from "@/lib/tmdb.functions";
import { MediaRow } from "@/components/MediaRow";
import { CategoryBrowser } from "@/components/CategoryBrowser";

const q = queryOptions({ queryKey: ["home"], queryFn: () => getHomeData() });

export const Route = createFileRoute("/movies")({
  head: () => ({ meta: [{ title: "Filmes — Cineflix" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(q),
  component: () => {
    const { data } = useSuspenseQuery(q);
    return (
      <div className="pt-24 pb-12">
        <h1 className="px-3 sm:px-4 md:px-12 text-3xl md:text-4xl font-black">Filmes</h1>
        <MediaRow title="Em destaque" items={data.popularMovies.slice(0, 12)} />
        <CategoryBrowser type="movie" />
      </div>
    );
  },
});
