/**
 * Sticky mobile "Tilføj til ritualet" bar.
 * Appears on product pages after user scrolls past the main CTA.
 * Calm, minimal — no urgency.
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface StickyMobileCTAProps {
  productTitle: string;
  price: string;
  onAddToCart: () => Promise<void>;
  isLoading: boolean;
  isAvailable: boolean;
}

export function StickyMobileCTA({ productTitle, price, onAddToCart, isLoading, isAvailable }: StickyMobileCTAProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 600px (past main CTA area)
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible || !isAvailable) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-background/97 backdrop-blur-md border-t border-border px-4 py-3 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.18)] transition-transform duration-500 ease-out">
      <div className="flex items-center gap-3 max-w-xl mx-auto">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{productTitle}</p>
          <p className="text-xs text-muted-foreground">{price}</p>
        </div>
        <Button
          variant="cta"
          size="default"
          className="flex-shrink-0 min-h-[44px] px-5"
          onClick={onAddToCart}
          disabled={isLoading}
          data-event="sticky_cta_click"
          data-section="product_sticky_mobile"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Tilføj til ritualet"}
        </Button>
      </div>
    </div>
  );
}
