import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/StaticPage";

export const Route = createFileRoute("/contactos")({
  head: () => ({
    meta: [
      { title: "Contactos — Fale com o Mozflix" },
      { name: "description", content: "Contacte a equipa do Mozflix para suporte, parcerias, publicidade ou pedidos de remoção." },
      { property: "og:title", content: "Contactos — Fale com o Mozflix" },
      { property: "og:description", content: "Contacte a equipa do Mozflix para suporte, parcerias, publicidade ou pedidos de remoção." },
    ],
  }),
  component: Contactos,
});

function Contactos() {
  return (
    <StaticPage title="Contactos" subtitle="Estamos disponíveis para dúvidas, sugestões e parcerias.">
      <h2>E-mail</h2>
      <ul>
        <li>Geral e suporte: <a href="mailto:contacto@mozflix.com">contacto@mozflix.com</a></li>
        <li>Publicidade: <a href="mailto:publicidade@mozflix.com">publicidade@mozflix.com</a></li>
        <li>Direitos de autor / DMCA: <a href="mailto:dmca@mozflix.com">dmca@mozflix.com</a></li>
      </ul>
      <h2>Tempo de resposta</h2>
      <p>Respondemos a todas as mensagens num prazo médio de 48 horas úteis.</p>
      <h2>Antes de escrever</h2>
      <p>
        Se o seu pedido for sobre remoção de conteúdo, consulte primeiro a página de{" "}
        <a href="/dmca">DMCA</a>. Para questões de dados pessoais, veja a{" "}
        <a href="/privacidade">Política de Privacidade</a>.
      </p>
    </StaticPage>
  );
}
