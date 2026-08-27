import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/StaticPage";

export const Route = createFileRoute("/termos")({
  head: () => ({
    meta: [
      { title: "Termos de Uso — Mozflix" },
      { name: "description", content: "Condições de utilização do Mozflix: acesso ao catálogo, conteúdo de terceiros e responsabilidades." },
      { property: "og:title", content: "Termos de Uso — Mozflix" },
      { property: "og:description", content: "Condições de utilização do Mozflix: acesso ao catálogo, conteúdo de terceiros e responsabilidades." },
    ],
  }),
  component: Termos,
});

function Termos() {
  return (
    <StaticPage title="Termos de Uso" subtitle="Ao navegar no Mozflix aceita as condições abaixo.">
      <h2>Utilização do serviço</h2>
      <p>
        O Mozflix disponibiliza informação sobre filmes, séries e animes (fichas, imagens e
        classificações) para fins informativos. O acesso é gratuito e destinado a uso pessoal.
      </p>
      <h2>Conteúdo de terceiros</h2>
      <p>
        Não alojamos ficheiros de vídeo. Os metadados provêm de bases de dados públicas e a
        reprodução é feita por players externos, cujo conteúdo e disponibilidade não controlamos.
      </p>
      <h2>Limitação de responsabilidade</h2>
      <p>
        O serviço é fornecido "tal como está", sem garantias de disponibilidade contínua ou de
        exatidão da informação apresentada.
      </p>
      <h2>Alterações</h2>
      <p>
        Estes termos podem ser atualizados a qualquer momento. A versão em vigor é sempre a
        publicada nesta página.
      </p>
    </StaticPage>
  );
}
