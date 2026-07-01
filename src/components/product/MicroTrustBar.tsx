/**
 * MicroTrustBar — slim trust line for product page, sits below breadcrumb.
 * Mobile-first, three tight bullets. Calm typography, no icons on mobile
 * to keep it whisper-quiet.
 */
export function MicroTrustBar() {
  return (
    <div className="border-y border-border/40 bg-soft/30 -mx-6 md:-mx-10 px-6 md:px-10 py-2.5 mb-6">
      <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] md:text-xs text-muted-foreground tracking-wide">
        <span>Fri fragt over 599 kr</span>
        <span className="text-border">·</span>
        <span>1–2 dages levering</span>
        <span className="text-border">·</span>
        <span>30 dages retur</span>
      </p>
    </div>
  );
}
