import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/StaticPage";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — Mozflix" },
      { name: "description", content: "Como o Mozflix recolhe, utiliza e protege os dados dos visitantes, incluindo cookies e publicidade." },
      { property: "og:title", content: "Política de Privacidade — Mozflix" },
      { property: "og:description", content: "Como o Mozflix recolhe, utiliza e protege os dados dos visitantes, incluindo cookies e publicidade." },
    ],
  }),
  component: Privacidade,
});

function Privacidade() {
  return (
    <StaticPage title="Política de Privacidade" subtitle="Última atualização: 2026">
      <p>
        A sua privacidade é importante para nós. Esta política explica que informação é recolhida
        quando visita o Mozflix e como é utilizada.
      </p>
      <h2>Informação recolhida</h2>
      <ul>
        <li>Dados de navegação anónimos (páginas visitadas, tipo de dispositivo, navegador).</li>
        <li>Endereço IP e dados técnicos registados automaticamente pelo servidor.</li>
        <li>Informação que nos envia voluntariamente por e-mail.</li>
      </ul>
      <h2>Cookies</h2>
      <p>
        Utilizamos cookies para memorizar preferências e para medir audiência. Parceiros
        publicitários podem também colocar cookies para apresentar anúncios relevantes. Pode
        desativar cookies nas definições do seu navegador.
      </p>
      <h2>Publicidade de terceiros</h2>
      <p>
        Os anúncios apresentados são geridos por redes externas, que operam segundo as suas
        próprias políticas de privacidade. Não partilhamos dados pessoais identificáveis com estes
        parceiros.
      </p>
      <h2>Conteúdo externo</h2>
      <p>
        As páginas de detalhe podem incorporar players de terceiros. Esses serviços podem recolher
        dados próprios enquanto o conteúdo é reproduzido.
      </p>
      <h2>Os seus direitos</h2>
      <p>
        Pode solicitar acesso, correção ou eliminação dos seus dados através da página de{" "}
        <a href="/contactos">Contactos</a>.
      </p>
    </StaticPage>
  );
}
