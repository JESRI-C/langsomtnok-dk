import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, Loader2, ArrowRight } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/shopify";

export function CartDrawer() {
  const { items, isLoading, isSyncing, isOpen, setOpen, updateQuantity, removeItem, getCheckoutUrl, syncCart } = useCartStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + parseFloat(item.price.amount) * item.quantity, 0);
  const currency = items[0]?.price.currencyCode || 'DKK';

  const handleCheckout = () => {
    const url = getCheckoutUrl();
    if (url) {
      window.open(url, '_blank');
      setOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(o) => { setOpen(o); if (o) syncCart(); }}>
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
              <div className="text-center">
                <p className="font-serif text-lg text-muted-foreground mb-2">Intet i kurven endnu</p>
                <p className="text-sm text-muted-foreground/70">Udforsk vores køkkenritualer og find dit første værktøj.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {items.map((item) => (
                  <div key={item.variantId} className="flex gap-4 p-3 rounded-lg bg-soft/50">
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

              <div className="flex-shrink-0 pt-4 mt-4 border-t border-border space-y-4">
                <p className="text-xs text-muted-foreground text-center italic">
                  Din ordre pakkes med ro og omhu.
                </p>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="text-lg font-serif font-medium">
                    {formatPrice(totalPrice.toString(), currency)}
                  </span>
                </div>
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
                <div className="flex justify-center gap-4 text-xs text-muted-foreground">
                  <span>Fri fragt over 499 kr</span>
                  <span>·</span>
                  <span>Sikker betaling</span>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
