import Link from "next/link";
import { Fragment } from "react";

export interface CrumbItem {
  label: string;
  href?: string;
}

export function Crumb({ trail }: { trail: CrumbItem[] }) {
  return (
    <div className="wrap crumb">
      {trail.map((t, i) => (
        <Fragment key={i}>
          {i > 0 && <span>/</span>}
          {t.href ? <Link href={t.href}>{t.label}</Link> : <span style={{ color: "var(--ink)" }}>{t.label}</span>}
        </Fragment>
      ))}
    </div>
  );
}
