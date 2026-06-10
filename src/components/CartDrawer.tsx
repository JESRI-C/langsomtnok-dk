/**
 * ============================================================================
 * CART DRAWER — Slide-in cart panel
 * ============================================================================
 *
 * SHOPIFY CONNECTION POINTS:
 * - Cart state: synced with Shopify via Storefront Cart API (see cartStore.ts)
 * - Cart items: each has a lineId from Shopify for update/remove operations
 * - Checkout: redirects to Shopify checkout via checkoutUrl from cartCreate
 * - Upsell: "Det giver mening sammen med…" — connect to product recommendations
 * - Trust/shipping: customize thresholds based on Shopify shipping rules
 *
 * CHECKOUT FLOW:
 * 1. User adds items → cartCreate mutation creates Shopify cart
 * 2. Subsequent adds → cartLinesAdd mutation
 * 3. "Gå til betaling" → window.open(checkoutUrl, '_blank')
 * 4. checkoutUrl includes channel=online_store parameter
 * ============================================================================
 */

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice, fetchProductRecommendations, fetchProductsByHandles, type ShopifyProduct } from "@/lib/shopify";
import { trackAddToCart, trackBeginCheckout, trackCartOpen, trackEvent } from "@/lib/analytics";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";

/** Free shipping threshold in store currency (DKK) */
const FREE_SHIPPING_THRESHOLD = 499;

export function CartDrawer() {
  const { items, isLoading, isSyncing, isOpen, setOpen, updateQuantity, removeItem, getCheckoutUrl, syncCart } = useCartStore();
  const [upsellProducts, setUpsellProducts] = useState<ShopifyProduct[]>([]);

  const addItem = useCartStore((s) => s.addItem);
  const viewedUpsellRef = useState<Set<string>>(new Set())[0];

  // Rule-based upsell selection — calm cross-sell tied to what's in the cart.
  // Magnetic holder → slibesten · slibesten → slibestensholder/læderstrop · kniv → slibesten/magnetisk.
  useEffect(() => {
    if (!isOpen || items.length === 0) {
      setUpsellProducts([]);
      return;
    }

    const cartText = items
      .map((i) =>
        [
          i.product.node.handle,
          i.product.node.productType,
          i.product.node.title,
          (i.product.node.tags || []).join(" "),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase(),
      )
      .join(" ");

    const has = (...kw: string[]) => kw.some((k) => cartText.includes(k));
    const hasMagnetic = has("magnetic", "magnet", "knivlist", "knivholder", "knivstander");
    const hasWhetstone = has("whetstone", "slibesten", "sliber");
    const hasKnife = has("knife", "kniv", "chef-knife", "kokkekniv", "santoku");

    // Priority-ordered handle candidates for each rule. First available wins.
    const candidates: string[] = [];
    if (hasMagnetic && !hasWhetstone) {
      candidates.push(
        "double-sided-whetstone-1000-5000",
        "walnut-sharpener-xz-mdq01-htm",
      );
    }
    if (hasWhetstone) {
      candidates.push(
        "slibestensholder",
        "stone-holder",
        "leather-strop",
        "laederstrop",
        "walnut-sharpener-xz-mdq01-htm",
      );
    }
    if (hasKnife && !hasWhetstone) {
      candidates.push(
        "double-sided-whetstone-1000-5000",
        "magnetic-knife-display-stand-walnut",
        "magnetic-knife-holder-acacia-19-6",
      );
    }
    // Fallback: empty candidates → use Shopify's product recommendations
    const cartVariantIds = new Set(items.map((i) => i.variantId));
    const cartProductIds = new Set(items.map((i) => i.product.node.id));

    const filterValid = (recs: ShopifyProduct[]) =>
      recs.filter(
        (r) =>
          !cartProductIds.has(r.node.id) &&
          r.node.variants.edges.every((v) => !cartVariantIds.has(v.node.id)) &&
          r.node.variants.edges[0]?.node?.availableForSale,
      );

    if (candidates.length > 0) {
      fetchProductsByHandles(candidates)
        .then((list) => {
          const valid = filterValid(list).slice(0, 3);
          if (valid.length > 0) {
            setUpsellProducts(valid);
            return;
          }
          // Fallback to Shopify recommendations
          const firstProductId = items[0]?.product?.node?.id;
          if (firstProductId) {
            fetchProductRecommendations(firstProductId).then((recs) =>
              setUpsellProducts(filterValid(recs).slice(0, 3)),
            );
          }
        })
        .catch(() => setUpsellProducts([]));
    } else {
      const firstProductId = items[0]?.product?.node?.id;
      if (!firstProductId) return;
      fetchProductRecommendations(firstProductId)
        .then((recs) => setUpsellProducts(filterValid(recs).slice(0, 3)))
        .catch(() => setUpsellProducts([]));
    }
  }, [isOpen, items]);

  // Fire cart_upsell_view once per session per product when shown
  useEffect(() => {
    if (!isOpen || upsellProducts.length === 0) return;
    upsellProducts.forEach((p) => {
      if (viewedUpsellRef.has(p.node.id)) return;
      viewedUpsellRef.add(p.node.id);
      trackEvent("cart_upsell_view", {
        product_id: p.node.id,
        product_title: p.node.title,
        handle: p.node.handle,
      });
    });
  }, [isOpen, upsellProducts, viewedUpsellRef]);

  const handleUpsellAdd = async (rec: ShopifyProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const variant = rec.node.variants.edges[0]?.node;
    if (!variant) return;
    trackEvent("cart_upsell_add", {
      product_id: rec.node.id,
      product_title: rec.node.title,
      handle: rec.node.handle,
    });
    await addItem({
      product: rec,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    trackAddToCart({
      product_id: rec.node.id,
      product_title: rec.node.title,
      variant_id: variant.id,
      price: parseFloat(variant.price.amount),
      currency: variant.price.currencyCode,
      quantity: 1,
      product_type: rec.node.productType,
    });
    toast.success("Tilføjet med ro.", { description: rec.node.title, position: "top-center" });
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + parseFloat(item.price.amount) * item.quantity, 0);
  const currency = items[0]?.price.currencyCode || 'DKK';
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - totalPrice);

  /**
   * SHOPIFY CONNECTION: Checkout redirect.
   * The checkoutUrl is generated by the Storefront Cart API cartCreate mutation.
   * It includes channel=online_store to bypass store password protection.
   * Opens in a new tab — the cart syncs on tab focus return (see useCartSync).
   */
  const handleCheckout = () => {
    const url = getCheckoutUrl();
    if (url) {
      trackBeginCheckout({
        items: items.map(item => ({
          product_id: item.product.node.id,
          product_title: item.product.node.title,
          variant_id: item.variantId,
          price: parseFloat(item.price.amount),
          currency: item.price.currencyCode,
          quantity: item.quantity,
        })),
        total: totalPrice,
        currency,
      });
      window.open(url, '_blank');
      setOpen(false);
    }
  };

  const handleOpenChange = (o: boolean) => {
    setOpen(o);
    if (o) {
      syncCart();
      if (items.length > 0) {
        trackCartOpen({
          items: items.map(item => ({
            product_id: item.product.node.id,
            product_title: item.product.node.title,
            variant_id: item.variantId,
            price: parseFloat(item.price.amount),
            currency: item.price.currencyCode,
            quantity: item.quantity,
          })),
          total: totalPrice,
          currency,
        });
      }
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full bg-background border-l border-border">
        <SheetHeader className="flex-shrink-0 pb-4 border-b border-border">
          <SheetTitle className="font-serif text-xl">Dit ritual</SheetTitle>
          <p className="text-sm text-muted-foreground">
            {totalItems === 0 ? "Din kurv er tom" : `${totalItems} ${totalItems === 1 ? 'genstand' : 'genstande'}`}
          </p>
        </SheetHeader>

        <div className="flex flex-col flex-1 min-h-0 pt-4">
          {items.length === 0 ? (
           <div className="flex-1 flex items-center justify-center">
              <div className="text-center px-6">
                <p className="font-serif text-lg text-muted-foreground mb-2">Dit ritual er endnu ikke begyndt.</p>
                <p className="text-sm text-muted-foreground/70">
                  Udforsk vores køkkenritualer og find dit første værktøj.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Free shipping progress */}
              {totalPrice > 0 && (
                <div className="mb-4 px-1">
                  {remainingForFreeShipping > 0 ? (
                    <p className="text-xs text-muted-foreground text-center mb-2">
                      Du er tæt på fri fragt. Tilføj pleje eller tilbehør, hvis det giver mening for dit ritual.
                    </p>
                  ) : (
                    <p className="text-xs text-cta text-center mb-2 font-medium">
                      ✓ Du har fri fragt
                    </p>
                  )}
                  <div className="h-1 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cta rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (totalPrice / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Cart items */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {items.map((item) => (
                  <div key={item.variantId} className="flex gap-4 p-3 rounded-lg bg-soft/50">
                    {/* SHOPIFY CONNECTION: Product image from Shopify CDN */}
                    <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-linen">
                      {item.product.node.images?.edges?.[0]?.node && (
                        <img
                          src={item.product.node.images.edges[0].node.url}
                          alt={item.product.node.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm leading-tight">{item.product.node.title}</h4>
                      {item.variantTitle !== "Default Title" && (
                        <p className="text-xs text-muted-foreground mt-0.5">{item.variantTitle}</p>
                      )}
                      <p className="text-sm font-medium mt-1">
                        {formatPrice(item.price.amount, item.price.currencyCode)}
                      </p>
                      {/* SHOPIFY CONNECTION: Quantity updates via cartLinesUpdate mutation */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="w-7 h-7 rounded-md border border-border flex items-center justify-center hover:bg-accent transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="w-7 h-7 rounded-md border border-border flex items-center justify-center hover:bg-accent transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        {/* SHOPIFY CONNECTION: Remove via cartLinesRemove mutation */}
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Upsell Block — live Shopify recommendations ────────── */}
              {upsellProducts.length > 0 && (
                <div className="flex-shrink-0 py-3 border-t border-border">
                  <p className="text-xs text-muted-foreground font-medium mb-2 px-1">
                    Det giver mening sammen med…
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-1 px-1">
                    {upsellProducts.map((rec) => {
                      const variant = rec.node.variants.edges[0]?.node;
                      return (
                        <Link
                          key={rec.node.id}
                          to="/products/$handle"
                          params={{ handle: rec.node.handle }}
                          onClick={() => {
                            setOpen(false);
                            trackEvent('cart_upsell_click', { product_id: rec.node.id, product_title: rec.node.title });
                          }}
                          className="flex-shrink-0 px-3 py-2 rounded-md border border-border bg-soft/30 text-xs text-foreground hover:border-walnut/30 transition-colors"
                        >
                          <span className="text-muted-foreground">+</span> {rec.node.title}
                          {variant && (
                            <span className="ml-1 text-muted-foreground">
                              {formatPrice(variant.price.amount, variant.price.currencyCode)}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Checkout footer */}
              <div className="flex-shrink-0 pt-4 border-t border-border space-y-4">
                {/* Secure payment info box */}
                <div className="rounded-lg p-4 bg-soft/40 border border-foreground/10">
                  <div className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-cta mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    <div>
                      <p className="text-xs font-medium text-foreground mb-1">Sikker betaling</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Du betaler trygt via Shopify checkout. Betalingsmulighederne vises, når du går videre til checkout.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground text-center italic">
                  Din ordre pakkes med ro og omhu.
                </p>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="text-lg font-serif font-medium">
                    {formatPrice(totalPrice.toString(), currency)}
                  </span>
                </div>
                {/* SHOPIFY CONNECTION: Checkout redirect via Storefront Cart API */}
                <Button
                  variant="cta"
                  size="lg"
                  className="w-full"
                  onClick={handleCheckout}
                  disabled={items.length === 0 || isLoading || isSyncing}
                >
                  {isLoading || isSyncing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Gå til betaling
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Betaling håndteres sikkert i checkout.
                </p>
                <div className="flex justify-center gap-6 text-xs text-muted-foreground">
                  <span>Pakket med omhu</span>
                  <span>·</span>
                  <span>Sikker betaling</span>
                  <span>·</span>
                  <span>30 dages returret</span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors pt-2"
                >
                  Fortsæt med at udforske
                </button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
