import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Navbar } from "@/components/Navbar";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Página não encontrada</h2>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Ir para o início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Algo deu errado</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Tentar novamente
          </button>
          <a href="/" className="rounded-md border border-border px-4 py-2 text-sm">Início</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Mozflix — Filmes e Séries Online" },
      { name: "description", content: "Assista milhares de filmes e séries online no Mozflix." },
      { property: "og:title", content: "Mozflix — Filmes e Séries Online" },
      { name: "twitter:title", content: "Mozflix — Filmes e Séries Online" },
      { property: "og:description", content: "Assista milhares de filmes e séries online no Mozflix." },
      { name: "twitter:description", content: "Assista milhares de filmes e séries online no Mozflix." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e22d2129-b957-47af-8512-2872020ab101/id-preview-b671eb9c--aaea6e0f-70d3-41e4-9288-8c34edb022e0.lovable.app-1779395034597.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e22d2129-b957-47af-8512-2872020ab101/id-preview-b671eb9c--aaea6e0f-70d3-41e4-9288-8c34edb022e0.lovable.app-1779395034597.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <head><HeadContent /></head>
      <body className="bg-background text-foreground">{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <footer className="px-4 md:px-12 py-10 text-sm text-muted-foreground border-t border-border mt-12">
        <nav className="flex flex-wrap gap-x-6 gap-y-2 mb-6">
          <Link to="/sobre" className="hover:text-foreground">Sobre</Link>
          <Link to="/publicidade" className="hover:text-foreground">Publicidade</Link>
          <Link to="/contactos" className="hover:text-foreground">Contactos</Link>
          <Link to="/privacidade" className="hover:text-foreground">Privacidade</Link>
          <Link to="/termos" className="hover:text-foreground">Termos de Uso</Link>
          <Link to="/dmca" className="hover:text-foreground">DMCA</Link>
          <a href="https://www.profitableratecpmnetwork.com/spzmzuch0?key=64078af32458fdf3898e014c2f54d949" target="_blank" rel="nofollow noopener" className="hover:text-foreground">Parceiros</a>
        </nav>
        <p>© {new Date().getFullYear()} Mozflix.</p>
      </footer>
    </QueryClientProvider>
  );
}
