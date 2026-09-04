import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CategoryBrowser, type CatalogFilters } from "@/components/CategoryBrowser";

const parseFilters = (search: Record<string, unknown>): CatalogFilters => ({
  genre: Number(search.genre) || undefined,
  year: Number(search.year) || undefined,
  provider: Number(search.provider) || undefined,
  page: Math.max(1, Number(search.page) || 1),
});

export const Route = createFileRoute("/anime")({
  head: () => ({ meta: [{ title: "Animes — Mozflix" }] }),
  validateSearch: parseFilters,
  component: AnimePage,
});

function AnimePage() {
  const filters = Route.useSearch();
  const navigate = useNavigate({ from: "/anime" });
  return <CategoryBrowser title="Animes" type="tv" anime filters={filters} onFiltersChange={(search) => navigate({ search })} />;
}
