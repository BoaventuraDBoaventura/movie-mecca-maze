import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/StaticPage";

export const Route = createFileRoute("/dmca")({
  head: () => ({
    meta: [
      { title: "DMCA e Direitos de Autor — Mozflix" },
      { name: "description", content: "Como submeter um pedido de remoção de conteúdo protegido por direitos de autor no Mozflix." },
      { property: "og:title", content: "DMCA e Direitos de Autor — Mozflix" },
      { property: "og:description", content: "Como submeter um pedido de remoção de conteúdo protegido por direitos de autor no Mozflix." },
    ],
  }),
  component: Dmca,
});

function Dmca() {
  return (
    <StaticPage title="DMCA e Direitos de Autor" subtitle="Respeitamos os direitos de autor e agimos rapidamente sobre notificações válidas.">
      <p>
        O Mozflix não aloja ficheiros de vídeo nos seus servidores. Apresentamos metadados públicos
        e ligações para players de terceiros.
      </p>
      <h2>Como submeter uma notificação</h2>
      <ul>
        <li>Identificação da obra protegida e do titular dos direitos</li>
        <li>URL exato da página no Mozflix</li>
        <li>Contacto válido (nome, e-mail, telefone)</li>
        <li>Declaração de boa-fé e de veracidade da informação</li>
      </ul>
      <h2>Envio</h2>
      <p>
        Envie a notificação para <a href="mailto:dmca@mozflix.com">dmca@mozflix.com</a>. Pedidos
        válidos são processados num prazo de 72 horas.
      </p>
    </StaticPage>
  );
}
