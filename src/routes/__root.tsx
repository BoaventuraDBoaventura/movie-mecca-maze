import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import {
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  Youtube as YoutubeIcon,
} from "lucide-react";

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
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" },
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
      <footer className="relative mt-16 overflow-hidden border-t border-border/40 bg-charcoal-950/80 md:mt-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-24 h-24 bg-gradient-to-t from-background to-transparent"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-14 md:px-12 md:py-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="min-w-0">
              <Link
                to="/"
                className="inline-block font-display text-3xl font-black tracking-tighter text-primary"
              >
                MOZFLIX
              </Link>
              <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
                O seu destino para filmes, séries e animes. Descubra histórias incríveis,
                explore novos mundos e assista onde e quando quiser.
              </p>

              <div className="mt-6 flex items-center gap-3">
                {[
                  { label: "Instagram", icon: InstagramIcon },
                  { label: "Twitter", icon: TwitterIcon },
                  { label: "Youtube", icon: YoutubeIcon },
                  { label: "Facebook", icon: FacebookIcon },
                ].map(({ label, icon: Icon }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-card/40 text-muted-foreground transition-all hover:scale-110 hover:border-primary/50 hover:text-primary hover:shadow-[0_0_15px_-3px_color-mix(in_oklab,var(--color-primary)_30%,transparent)]"
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
              <div className="col-span-2 sm:col-span-1">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/90">
                  Navegar
                </h3>
                <ul className="mt-5 space-y-3 text-sm">
                  {[
                    { to: "/", label: "Início" },
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
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/90">
                  Informações
                </h3>
                <ul className="mt-5 space-y-3 text-sm">
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
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/90">
                  Legal
                </h3>
                <ul className="mt-5 space-y-3 text-sm">
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
                  <li>
                    <span className="text-muted-foreground">Cookies</span>
                  </li>
                  <li>
                    <span className="text-muted-foreground">Licenças</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border/40 pt-6 sm:mt-14 sm:flex-row sm:items-center sm:gap-4 sm:pt-8">
            <p className="text-xs leading-5 text-muted-foreground">
              © {new Date().getFullYear()} Mozflix. Todos os direitos reservados.
            </p>
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60">
              Feito para os amantes de cinema
            </p>
          </div>
        </div>
      </footer>
    </QueryClientProvider>
  );
}
