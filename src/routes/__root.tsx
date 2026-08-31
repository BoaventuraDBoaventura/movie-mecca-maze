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
      <footer className="relative mt-20 border-t border-border/70 bg-card/30">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent"
        />
        <div className="mx-auto max-w-7xl px-5 md:px-12 py-12 md:py-16">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1.3fr)_1fr_1fr]">
            <div className="min-w-0">
              <Link to="/" className="font-display text-2xl font-extrabold tracking-tight text-primary">
                MOZFLIX
              </Link>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Milhares de filmes, séries e animes num só lugar. Descubra, explore e assista
                onde quiser.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/80">
                Navegar
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {[
                  { to: "/movies", label: "Filmes" },
                  { to: "/series", label: "Séries" },
                  { to: "/anime", label: "Animes" },
                  { to: "/sobre", label: "Sobre" },
                ].map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/80">
                Informações
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {[
                  { to: "/publicidade", label: "Publicidade" },
                  { to: "/contactos", label: "Contactos" },
                  { to: "/privacidade", label: "Privacidade" },
                  { to: "/termos", label: "Termos de Uso" },
                  { to: "/dmca", label: "DMCA" },
                ].map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <a
                    href="https://www.profitableratecpmnetwork.com/spzmzuch0?key=64078af32458fdf3898e014c2f54d949"
                    target="_blank"
                    rel="nofollow noopener"
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    Parceiros
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Mozflix.</p>
            <p className="text-muted-foreground/70">Feito para os amantes de cinema.</p>
          </div>
        </div>
      </footer>
    </QueryClientProvider>
  );
}
