import { createFileRoute } from "@tanstack/react-router";
import { CategoryBrowser } from "@/components/CategoryBrowser";

export const Route = createFileRoute("/anime")({
  head: () => ({ meta: [{ title: "Animes — Mozflix" }] }),
  component: () => <CategoryBrowser title="Animes" type="tv" anime />,
});
