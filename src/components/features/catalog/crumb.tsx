import Link from "next/link";
import { Fragment } from "react";

export interface CrumbItem {
  label: string;
  href?: string;
}

export function Crumb({ trail }: { trail: CrumbItem[] }) {
  return (
    <div className="wrap flex items-center gap-2 pt-[22px] pb-1.5 text-[13px] text-ink-soft">
      {trail.map((t, i) => (
        <Fragment key={i}>
          {i > 0 && <span>/</span>}
          {t.href ? (
            <Link href={t.href} className="cursor-pointer hover:text-ink">
              {t.label}
            </Link>
          ) : (
            <span style={{ color: "var(--color-ink)" }}>{t.label}</span>
          )}
        </Fragment>
      ))}
    </div>
  );
}
