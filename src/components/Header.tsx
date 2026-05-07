import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

const navItems = [
  { label: "Shop", to: "/shop" },
  { label: "Knive", to: "/collections/knive" },
  { label: "Slibning", to: "/collections/slibesten" },
  { label: "Guides", to: "/guides" },
  { label: "Langsomt Cirklen", to: "/cirklen" },
  { label: "Om", to: "/om" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const items = useCartStore((s) => s.items);
  const setCartOpen = useCartStore((s) => s.setOpen);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container-calm">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="font-serif text-xl md:text-2xl tracking-tight">
            Langsomt Nok
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-sm font-medium tracking-wide text-foreground/70 hover:text-foreground transition-colors duration-300"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button className="text-foreground/70 hover:text-foreground transition-colors" aria-label="Søg">
              <Search className="w-5 h-5" />
            </button>
            <button className="text-foreground/70 hover:text-foreground transition-colors hidden md:block" aria-label="Konto">
              <User className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="text-foreground/70 hover:text-foreground transition-colors relative"
              aria-label="Indkøbskurv"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-cta text-cta-foreground text-[10px] font-medium flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-foreground/70 hover:text-foreground"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-background/98 backdrop-blur-lg border-t border-border">
          <nav className="container-calm py-6 flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className="text-lg font-serif text-foreground/80 hover:text-foreground transition-colors py-2"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
