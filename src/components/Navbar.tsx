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
      <div className="flex items-center justify-between px-4 md:px-12 h-16">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-primary font-black text-2xl md:text-3xl tracking-tight">
            CINEFLIX
          </Link>
          <nav className="hidden md:flex gap-5 text-sm text-foreground/90">
            <Link to="/" className="hover:text-primary">Início</Link>
            <Link to="/movies" className="hover:text-primary">Filmes</Link>
            <Link to="/series" className="hover:text-primary">Séries</Link>
          </nav>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (q.trim()) navigate({ to: "/search", search: { q } });
          }}
          className="flex items-center gap-2 bg-background/70 border border-border rounded px-2 py-1"
        >
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar..."
            className="bg-transparent text-sm outline-none w-32 md:w-56 placeholder:text-muted-foreground"
          />
        </form>
      </div>
    </header>
  );
}
