import { createFileRoute } from "@tanstack/react-router";
import { CategoryBrowser } from "@/components/CategoryBrowser";

export const Route = createFileRoute("/movies")({
  head: () => ({ meta: [{ title: "Filmes — Cineflix" }] }),
  component: () => <CategoryBrowser title="Filmes" type="movie" />,
});
