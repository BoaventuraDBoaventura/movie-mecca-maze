import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getHomeData } from "@/lib/tmdb.functions";
import { Hero } from "@/components/Hero";
import { MediaRow } from "@/components/MediaRow";

const homeQuery = queryOptions({
  queryKey: ["home"],
  queryFn: () => getHomeData(),
});

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(homeQuery),
  component: Index,
});

function Index() {
  const { data } = useSuspenseQuery(homeQuery);
  const heroItems = data.trending.filter((i) => i.backdrop_path).slice(0, 8);
  return (
    <div>
      {heroItems.length > 0 && <Hero items={heroItems} />}
      <div className="-mt-24 relative z-20">
        <MediaRow title="Em alta esta semana" items={data.trending} />
        <MediaRow title="Filmes populares" items={data.popularMovies} />
        <MediaRow title="Séries populares" items={data.popularTv} />
        <MediaRow title="Ação" items={data.actionMovies} />
        <MediaRow title="Filmes mais bem avaliados" items={data.topMovies} />
        <MediaRow title="Séries mais bem avaliadas" items={data.topTv} />
      </div>
    </div>
  );
}
