/**
 * PaymentIcons — diskrete betalingsikoner (MobilePay, Visa, Mastercard).
 * Bruges to steder: ved kurven/checkout og i footeren.
 * Rendered i gråtone/dæmpet stil, så de signalerer tryghed uden at råbe.
 * SVG'er er inline så de matcher currentColor/tonet baggrund.
 */
import { cn } from "@/lib/utils";

function IconVisa({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 32" className={className} aria-label="Visa" role="img">
      <rect width="48" height="32" rx="4" fill="currentColor" opacity="0.06" />
      <text
        x="24"
        y="21"
        textAnchor="middle"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="12"
        fontWeight="700"
        letterSpacing="0.5"
        fill="currentColor"
      >
        VISA
      </text>
    </svg>
  );
}

function IconMastercard({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 32" className={className} aria-label="Mastercard" role="img">
      <rect width="48" height="32" rx="4" fill="currentColor" opacity="0.06" />
      <circle cx="20" cy="16" r="7" fill="currentColor" opacity="0.55" />
      <circle cx="28" cy="16" r="7" fill="currentColor" opacity="0.35" />
    </svg>
  );
}

function IconMobilePay({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 32" className={className} aria-label="MobilePay" role="img">
      <rect width="48" height="32" rx="4" fill="currentColor" opacity="0.06" />
      <text
        x="24"
        y="21"
        textAnchor="middle"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="10"
        fontWeight="700"
        letterSpacing="0.3"
        fill="currentColor"
      >
        MobilePay
      </text>
    </svg>
  );
}

interface Props {
  className?: string;
  /** dæmp yderligere når det står på lys baggrund */
  variant?: "light" | "dark";
  size?: "sm" | "md";
}

export function PaymentIcons({ className, variant = "light", size = "md" }: Props) {
  const tone =
    variant === "dark" ? "text-deep-foreground/55" : "text-foreground/45";
  const w = size === "sm" ? "w-8 h-[22px]" : "w-10 h-[26px]";

  return (
    <div
      className={cn("flex items-center gap-2", tone, className)}
      aria-label="Accepterede betalingsmuligheder"
    >
      <IconMobilePay className={w} />
      <IconVisa className={w} />
      <IconMastercard className={w} />
    </div>
  );
}
