import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CategoryBrowser, type CatalogFilters } from "@/components/CategoryBrowser";

const parseFilters = (search: Record<string, unknown>): CatalogFilters => ({
  genre: Number(search.genre) || undefined,
  year: Number(search.year) || undefined,
  provider: Number(search.provider) || undefined,
  page: Math.max(1, Number(search.page) || 1),
});

export const Route = createFileRoute("/series")({
  head: () => ({ meta: [{ title: "Séries — Mozflix" }] }),
  validateSearch: parseFilters,
  component: SeriesPage,
});

function SeriesPage() {
  const filters = Route.useSearch();
  const navigate = useNavigate({ from: "/series" });
  return <CategoryBrowser title="Séries" type="tv" filters={filters} onFiltersChange={(search) => navigate({ search })} />;
}
