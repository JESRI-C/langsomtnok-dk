/**
 * ============================================================================
 * <TrustBlok />
 * ============================================================================
 * Genanvendelig, rolig trust-række til produkt- og kampagnesider.
 *
 * Indhold (én række på desktop, 2-kolonner/lodret på mobil):
 *   1. FSC-mærke  + "FSC-certificeret massiv valnød"
 *   2. "14 dages fortrydelsesret" (linker til /handelsbetingelser)
 *   3. "1-3 dages levering i hele Danmark"
 *   4. Betalingsikoner: MobilePay · Visa · Mastercard (dæmpede)
 *
 * Ingen skygger, ingen kort, ingen animation — kun en tynd toplinje
 * som adskillelse fra indholdet ovenfor. Bruger designsystemets muted-
 * farver og lille typografi (13-14px).
 *
 * Kald blot <TrustBlok /> uden props. Valgfrit `className` til
 * spacing-justering fra kaldsstedet.
 * ============================================================================
 */

import { Link } from "@tanstack/react-router";
import { Truck } from "lucide-react";
import { PaymentIcons } from "@/components/PaymentIcons";
import { cn } from "@/lib/utils";

/** Diskret FSC-mærke i SVG — dæmpet, matcher currentColor */
function FscMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role="img"
      aria-label="FSC-certificeret"
    >
      <rect
        x="1"
        y="1"
        width="30"
        height="30"
        rx="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        opacity="0.55"
      />
      <text
        x="16"
        y="14"
        textAnchor="middle"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="9"
        fontWeight="700"
        letterSpacing="0.3"
        fill="currentColor"
      >
        FSC
      </text>
      {/* Lille træ-glyph */}
      <path
        d="M12 22 L16 17 L20 22 Z M15 22 L15 25 L17 25 L17 22 Z"
        fill="currentColor"
        opacity="0.7"
      />
    </svg>
  );
}

/** Lille genbrugelig række-celle */
function TrustCell({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5 text-foreground/70">
      <span className="shrink-0 text-foreground/50">{icon}</span>
      <span className="text-[13px] leading-snug">{children}</span>
    </div>
  );
}

interface Props {
  className?: string;
}

export function TrustBlok({ className }: Props) {
  return (
    <div
      className={cn(
        "border-t border-foreground/10 pt-5 mt-6",
        className,
      )}
      aria-label="Trust og betalingsmuligheder"
    >
      <div
        className={cn(
          // Mobil: to kolonner for tekst-cellerne, betaling på egen række.
          // Desktop: én rolig vandret række med rigelig luft.
          "grid grid-cols-2 gap-x-6 gap-y-3",
          "md:flex md:flex-wrap md:items-center md:justify-between md:gap-x-8 md:gap-y-3",
        )}
      >
        <TrustCell icon={<FscMark className="w-5 h-5" />}>
          FSC-certificeret massiv valnød
        </TrustCell>

        <TrustCell
          icon={
            <svg
              viewBox="0 0 20 20"
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v4h4M12 3l5 5v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7Z"
              />
            </svg>
          }
        >
          <Link
            to="/handelsbetingelser"
            className="underline-offset-4 hover:text-foreground hover:underline"
          >
            14 dages fortrydelsesret
          </Link>
        </TrustCell>

        <TrustCell icon={<Truck className="w-4 h-4" strokeWidth={1.5} />}>
          1-3 dages levering i hele Danmark
        </TrustCell>

        {/* Betaling — spænder begge kolonner på mobil for at få en rolig linje */}
        <div className="col-span-2 md:col-span-1 md:ml-auto">
          <PaymentIcons variant="light" size="sm" />
        </div>
      </div>
    </div>
  );
}
