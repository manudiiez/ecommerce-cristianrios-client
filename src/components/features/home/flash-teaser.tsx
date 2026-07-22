import Link from "next/link";
import type { FlashDeal } from "@/lib/api";
import { Countdown } from "@/components/ui/countdown";
import { Ico } from "@/components/ui/icon";
import { btnBase } from "@/components/ui/button";
import { pillBase } from "@/components/ui/pill";
import { ars } from "@/lib/utils";

export function FlashTeaser({ deal }: { deal: FlashDeal }) {
  return (
    <section className="flash-zone">
      <div className="glow g1"></div>
      <div className="glow g2"></div>
      <div className="wrap relative py-[60px]">
        <div className="flash-banner relative my-[30px] grid grid-cols-[1fr_auto] items-center gap-7 overflow-hidden rounded-lg p-11 max-[700px]:grid-cols-1 max-[700px]:p-7">
          <div className="stripes"></div>
          <div className="relative">
            <span className={pillBase} style={{ background: "rgba(0,0,0,.25)", color: "#fff" }}>
              <Ico.bolt style={{ fontSize: 13 }} /> {deal.kicker}
            </span>
            <h3 className="font-display relative my-2 text-[clamp(26px,3.4vw,40px)] font-bold text-white">{deal.name}</h3>
            <p className="relative m-0 max-w-[44ch] text-[rgba(255,255,255,.88)]">{deal.blurb}</p>
            <div className="mt-[18px] flex flex-wrap items-center gap-4">
              <Link href="/ofertas-flash" className={btnBase} style={{ background: "#fff", color: "#b8210f" }}>
                Ver Ofertas Flash <Ico.arrow />
              </Link>
              <span className="font-bold text-white">
                Solo {ars(deal.price)} <s className="font-normal opacity-70">{ars(deal.regular)}</s>
              </span>
            </div>
          </div>
          <Countdown endsAt={deal.endsAt} />
        </div>
        <p className="mt-1.5 text-center text-[13.5px] text-[rgba(255,255,255,.6)]">
          Productos invitados por tiempo limitado. Cuando se va la fecha, se va de la tienda.
        </p>
      </div>
    </section>
  );
}
