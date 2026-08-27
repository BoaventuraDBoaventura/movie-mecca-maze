import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/StaticPage";

export const Route = createFileRoute("/publicidade")({
  head: () => ({
    meta: [
      { title: "Publicidade — Anuncie no Mozflix" },
      { name: "description", content: "Formatos de anúncio, audiência e condições para anunciar no Mozflix." },
      { property: "og:title", content: "Publicidade — Anuncie no Mozflix" },
      { property: "og:description", content: "Formatos de anúncio, audiência e condições para anunciar no Mozflix." },
    ],
  }),
  component: Publicidade,
});

function Publicidade() {
  return (
    <StaticPage
      title="Publicidade"
      subtitle="Alcance uma audiência apaixonada por filmes, séries e animes."
    >
      <p>
        O Mozflix recebe visitantes diariamente à procura de novidades em cinema e televisão. Se
        quer divulgar a sua marca junto deste público, temos espaços disponíveis.
      </p>
      <h2>Formatos disponíveis</h2>
      <ul>
        <li>Banner de topo (728x90 / 320x50 em mobile)</li>
        <li>Banner lateral e entre secções (300x250)</li>
        <li>Publicação patrocinada em destaque na página inicial</li>
        <li>Parcerias e campanhas de afiliados</li>
      </ul>
      <h2>Como anunciar</h2>
      <p>
        Envie-nos uma mensagem através da página de <a href="/contactos">Contactos</a> com o
        formato pretendido, período da campanha e orçamento. Respondemos normalmente em 48 horas.
      </p>
      <h2>Parceiros</h2>
      <p>
        Consulte a nossa rede de{" "}
        <a
          href="https://www.profitableratecpmnetwork.com/spzmzuch0?key=64078af32458fdf3898e014c2f54d949"
          target="_blank"
          rel="nofollow noopener"
        >
          parceiros publicitários
        </a>
        .
      </p>
    </StaticPage>
  );
}
