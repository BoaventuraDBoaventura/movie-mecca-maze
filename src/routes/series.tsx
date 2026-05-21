import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getHomeData } from "@/lib/tmdb.functions";
import { MediaRow } from "@/components/MediaRow";

const q = queryOptions({ queryKey: ["home"], queryFn: () => getHomeData() });

export const Route = createFileRoute("/series")({
  head: () => ({ meta: [{ title: "Séries — Cineflix" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(q),
  component: () => {
    const { data } = useSuspenseQuery(q);
    return (
      <div className="pt-24">
        <h1 className="px-4 md:px-12 text-3xl md:text-4xl font-black">Séries</h1>
        <MediaRow title="Populares" items={data.popularTv} />
        <MediaRow title="Mais bem avaliadas" items={data.topTv} />
      </div>
    );
  },
});
