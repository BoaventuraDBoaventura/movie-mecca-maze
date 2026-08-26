import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

const links = [
  { to: "/", label: "Início" },
  { to: "/movies", label: "Filmes" },
  { to: "/series", label: "Séries" },
  { to: "/anime", label: "Animes" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) navigate({ to: "/search", search: { q: q.trim() } });
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border/60"
          : "bg-gradient-to-b from-background/85 to-transparent"
      }`}
    >
      <div className="relative flex items-center justify-between gap-3 px-3 sm:px-4 md:px-12 h-14 sm:h-16">
        <Link
          to="/"
          className="text-primary font-black text-xl sm:text-2xl md:text-3xl tracking-tight shrink-0"
        >
          MOZFLIX
        </Link>

        {/* Menu centralizado */}
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 rounded-full border border-border/60 bg-background/50 backdrop-blur px-1.5 py-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "bg-primary text-primary-foreground" }}
              inactiveProps={{ className: "text-foreground/80 hover:text-foreground hover:bg-foreground/10" }}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Barra de pesquisa */}
        <form
          onSubmit={submit}
          className={`flex items-center gap-2 rounded-full border px-3 h-10 transition-all duration-300 shrink ${
            focused
              ? "border-primary bg-background w-56 sm:w-72 md:w-80 shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-primary)_18%,transparent)]"
              : "border-border bg-background/60 backdrop-blur w-40 sm:w-52 md:w-60 hover:border-foreground/40"
          }`}
        >
          <button type="submit" aria-label="Buscar" className="shrink-0">
            <Search className={`w-4 h-4 ${focused ? "text-primary" : "text-muted-foreground"}`} />
          </button>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Buscar filmes, séries…"
            className="bg-transparent text-sm outline-none w-full placeholder:text-muted-foreground"
          />
          {q && (
            <button
              type="button"
              aria-label="Limpar busca"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setQ("");
                inputRef.current?.focus();
              }}
              className="shrink-0 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>
      </div>

      {/* Menu mobile centralizado */}
      <nav className="md:hidden flex justify-center gap-1 px-3 pb-2 overflow-x-auto no-scrollbar">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            activeOptions={{ exact: l.to === "/" }}
            activeProps={{ className: "bg-primary text-primary-foreground" }}
            inactiveProps={{ className: "text-foreground/80 bg-foreground/5" }}
            className="shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
