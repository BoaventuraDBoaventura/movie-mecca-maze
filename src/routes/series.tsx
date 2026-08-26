import { createFileRoute } from "@tanstack/react-router";
import { CategoryBrowser } from "@/components/CategoryBrowser";

export const Route = createFileRoute("/series")({
  head: () => ({ meta: [{ title: "Séries — Mozflix" }] }),
  component: () => <CategoryBrowser title="Séries" type="tv" />,
});
