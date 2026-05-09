import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Search, ShoppingBag, Menu, X, Package, Shield, RotateCcw, Truck } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import logoHorizontal from "@/assets/logo-horizontal.png";

const navItems = [
  { label: "Shop", to: "/shop" },
  { label: "Knive", to: "/collections/knive" },
  { label: "Slibning & pleje", to: "/collections/slibning-pleje" },
  { label: "Magnetisk opbevaring", to: "/collections/magnetiske-holdere" },
  { label: "Gaver", to: "/collections/gaver" },
  { label: "Guides", to: "/guides" },
  { label: "Universet", to: "/universet" },
  { label: "Langsomt Cirklen", to: "/cirklen" },
];

const trustItems = [
  { icon: Truck, text: "Sendes fra Danmark" },
  { icon: RotateCcw, text: "30 dages returret" },
  { icon: Shield, text: "Sikker betaling" },
  { icon: Package, text: "Pakket med omhu" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const items = useCartStore((s) => s.items);
  const setCartOpen = useCartStore((s) => s.setOpen);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* ── Trust Bar ──────────────────────────────────────── */}
      <div className="bg-soft border-b border-border/40 relative z-50">
        <div className="container-calm">
          {/* Desktop: all 4 items */}
          <div className="hidden md:flex items-center justify-center gap-8 py-2">
            {trustItems.map((item, i) => (
              <div key={item.text} className="flex items-center gap-1.5">
                <item.icon className="w-3.5 h-3.5 text-foreground/40" strokeWidth={1.5} />
                <span className="text-[11px] font-medium text-foreground/50 tracking-wide">{item.text}</span>
                {i < trustItems.length - 1 && (
                  <span className="ml-6 text-border/60">·</span>
                )}
              </div>
            ))}
          </div>
          {/* Mobile: 2 items */}
          <div className="flex md:hidden items-center justify-center gap-6 py-1.5">
            {trustItems.slice(0, 2).map((item) => (
              <div key={item.text} className="flex items-center gap-1.5">
                <item.icon className="w-3 h-3 text-foreground/40" strokeWidth={1.5} />
                <span className="text-[10px] font-medium text-foreground/50 tracking-wide">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Header ───────────────────────────────────── */}
      <header
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 bg-background border-b border-soft ${
          scrolled ? "shadow-sm" : ""
        }`}
      >
        <div className="container-calm">
          <div className="flex items-center justify-between h-16 md:h-[72px]">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0" aria-label="Langsomt Nok — forside">
              <img
                src={logoHorizontal}
                alt="Langsomt Nok logo"
                className="h-10 md:h-12 w-auto"
              />
            </Link>

            {/* Center Navigation — desktop */}
            <nav className="hidden xl:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="text-[14px] font-medium text-foreground/65 hover:text-cta transition-colors duration-300 whitespace-nowrap"
                  activeProps={{ className: "text-foreground" }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-3">
              <button
                className="text-foreground/50 hover:text-foreground transition-colors p-1.5"
                aria-label="Søg"
              >
                <Search className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </button>
              <button
                onClick={() => setCartOpen(true)}
                className="text-foreground/50 hover:text-foreground transition-colors p-1.5 relative"
                aria-label="Indkøbskurv"
              >
                <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-cta text-cta-foreground text-[9px] font-semibold flex items-center justify-center leading-none">
                    {totalItems}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="xl:hidden text-foreground/50 hover:text-foreground transition-colors p-1.5"
                aria-label={mobileOpen ? "Luk menu" : "Åbn menu"}
              >
                {mobileOpen ? <X className="w-5 h-5" strokeWidth={1.5} /> : <Menu className="w-5 h-5" strokeWidth={1.5} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="xl:hidden fixed inset-x-0 top-[92px] bottom-0 bg-background/99 backdrop-blur-sm z-40 overflow-y-auto">
            <nav className="container-calm py-8 flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className="text-lg font-serif text-foreground/70 hover:text-foreground transition-colors py-3 border-b border-border/20"
                >
                  {item.label}
                </Link>
              ))}
              {/* Mobile trust items */}
              <div className="mt-8 pt-6 border-t border-border/30 space-y-3">
                {trustItems.map((item) => (
                  <div key={item.text} className="flex items-center gap-2">
                    <item.icon className="w-4 h-4 text-copper/60" strokeWidth={1.5} />
                    <span className="text-sm text-muted-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
