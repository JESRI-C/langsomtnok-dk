import { ShieldCheck, Truck, RotateCcw, Package } from "lucide-react";

interface PaymentTrustSectionProps {
  title?: string;
}

/**
 * Discreet payment & trust section.
 * Places visual reassurance after the product block — calm, not commercial.
 */
export function PaymentTrustSection({ title = "Trygt og enkelt" }: PaymentTrustSectionProps) {
  const items = [
    { icon: ShieldCheck, label: "Sikker betaling", text: "Kort og almindelige betalingsløsninger." },
    { icon: Truck, label: "Dansk webshop", text: "Levering fra dansk lager — typisk 2–4 hverdage." },
    { icon: RotateCcw, label: "30 dages returret", text: "Skifter du mening, sender du roligt tilbage." },
    { icon: Package, label: "Pakket med omhu", text: "Naturpapir, bomuldssnor og bæredygtige materialer." },
  ];

  return (
    <section className="section-padding" data-block="payment-trust">
      <div className="container-calm max-w-5xl">
        <h2 className="font-serif text-xl md:text-2xl mb-8 text-center text-foreground">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((it) => (
            <div key={it.label} className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-soft mb-3">
                <it.icon className="w-5 h-5 text-walnut" />
              </div>
              <h3 className="font-serif text-sm mb-1">{it.label}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{it.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
