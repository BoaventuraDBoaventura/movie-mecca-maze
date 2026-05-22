import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur" : "bg-gradient-to-b from-background/80 to-transparent"
      }`}
    >
      <div className="flex items-center justify-between gap-2 px-3 sm:px-4 md:px-12 h-14 sm:h-16">
        <div className="flex items-center gap-4 sm:gap-8 min-w-0">
          <Link to="/" className="text-primary font-black text-xl sm:text-2xl md:text-3xl tracking-tight shrink-0">
            CINEFLIX
          </Link>
          <nav className="hidden sm:flex gap-3 md:gap-5 text-sm text-foreground/90">
            <Link to="/" className="hover:text-primary">Início</Link>
            <Link to="/movies" className="hover:text-primary">Filmes</Link>
            <Link to="/series" className="hover:text-primary">Séries</Link>
            <Link to="/anime" className="hover:text-primary">Animes</Link>
          </nav>

        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (q.trim()) navigate({ to: "/search", search: { q } });
          }}
          className="flex items-center gap-2 bg-background/70 border border-border rounded px-2 py-1 shrink"
        >
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar..."
            className="bg-transparent text-sm outline-none w-24 sm:w-40 md:w-56 placeholder:text-muted-foreground"
          />
        </form>
      </div>
      <nav className="sm:hidden flex gap-4 px-3 pb-2 text-sm text-foreground/90 overflow-x-auto no-scrollbar">
        <Link to="/" className="hover:text-primary shrink-0">Início</Link>
        <Link to="/movies" className="hover:text-primary shrink-0">Filmes</Link>
        <Link to="/series" className="hover:text-primary shrink-0">Séries</Link>
        <Link to="/anime" className="hover:text-primary shrink-0">Animes</Link>
      </nav>

    </header>
  );
}
