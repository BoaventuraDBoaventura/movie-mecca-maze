import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/StaticPage";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre o Mozflix — Quem somos" },
      { name: "description", content: "Conheça o Mozflix, o catálogo online de filmes, séries e animes com fichas, elenco e recomendações." },
      { property: "og:title", content: "Sobre o Mozflix — Quem somos" },
      { property: "og:description", content: "Conheça o Mozflix, o catálogo online de filmes, séries e animes com fichas, elenco e recomendações." },
    ],
  }),
  component: Sobre,
});

function Sobre() {
  return (
    <StaticPage title="Sobre o Mozflix" subtitle="Um catálogo simples e rápido para descobrir o que ver a seguir.">
      <p>
        O Mozflix nasceu da vontade de reunir num só lugar informação atualizada sobre filmes,
        séries e animes: sinopses, elenco, avaliações, trailers e recomendações.
      </p>
      <h2>O que encontra aqui</h2>
      <ul>
        <li>Destaques rotativos com os títulos do momento</li>
        <li>Filtros por género ao estilo das grandes plataformas</li>
        <li>Catálogo completo com paginação e pesquisa</li>
        <li>Interface adaptada a telemóvel, computador e Smart TV</li>
      </ul>
      <h2>Fale connosco</h2>
      <p>
        Sugestões e parcerias são bem-vindas através da página de{" "}
        <a href="/contactos">Contactos</a>.
      </p>
    </StaticPage>
  );
}
