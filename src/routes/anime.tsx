import { createFileRoute } from "@tanstack/react-router";
import { CategoryBrowser } from "@/components/CategoryBrowser";

export const Route = createFileRoute("/anime")({
  head: () => ({ meta: [{ title: "Animes — Cineflix" }] }),
  component: () => (
    <div className="pt-24 pb-12">
      <h1 className="px-3 sm:px-4 md:px-12 text-3xl md:text-4xl font-black">Animes</h1>
      <CategoryBrowser type="tv" anime />
    </div>
  ),
});
