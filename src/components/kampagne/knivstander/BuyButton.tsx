export function BuyButton({ href, label = "Køb nu" }: { href: string; label?: string }) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-full bg-[#2D2D2D] px-8 py-4 text-[#F4F1EA] text-sm tracking-[0.14em] uppercase font-medium transition-all hover:bg-[#6E7B4F] focus:outline-none focus:ring-2 focus:ring-[#6E7B4F] focus:ring-offset-2 focus:ring-offset-[#F4F1EA]"
    >
      {label}
    </a>
  );
}
