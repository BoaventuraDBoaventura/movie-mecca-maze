import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CategoryBrowser, type CatalogFilters } from "@/components/CategoryBrowser";

const parseFilters = (search: Record<string, unknown>): CatalogFilters => ({
  genre: Number(search.genre) || undefined,
  year: Number(search.year) || undefined,
  provider: Number(search.provider) || undefined,
  page: Math.max(1, Number(search.page) || 1),
});

export const Route = createFileRoute("/movies")({
  head: () => ({ meta: [{ title: "Filmes — Mozflix" }] }),
  validateSearch: parseFilters,
  component: MoviesPage,
});

function MoviesPage() {
  const filters = Route.useSearch();
  const navigate = useNavigate({ from: "/movies" });
  return <CategoryBrowser title="Filmes" type="movie" filters={filters} onFiltersChange={(search) => navigate({ search })} />;
}
