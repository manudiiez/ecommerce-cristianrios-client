import type { SVGProps } from "react";

export type IconName = keyof typeof Ico;

function base(props: SVGProps<SVGSVGElement>) {
  return { viewBox: "0 0 24 24", width: "1em", height: "1em", ...props } as const;
}

export const Ico = {
  arrow: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  cart: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 4h2l2.4 12.2a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.2L22 8H6" />
      <circle cx={9} cy={21} r={1.4} />
      <circle cx={18} cy={21} r={1.4} />
    </svg>
  ),
  wa: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)} fill="currentColor">
      <path d="M17.5 14.4c-.3-.15-1.7-.84-2-.94-.27-.1-.46-.15-.66.15-.2.3-.76.93-.93 1.12-.17.2-.34.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.6-.9-2.18-.24-.57-.48-.49-.66-.5h-.56c-.2 0-.51.07-.78.37-.27.3-1.02 1-1.02 2.43 0 1.43 1.04 2.81 1.19 3.01.15.2 2.05 3.13 4.97 4.39.69.3 1.24.48 1.66.61.7.22 1.33.19 1.83.12.56-.08 1.7-.7 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.27-.2-.57-.34M12 2a10 10 0 0 0-8.6 15.06L2 22l5.07-1.33A10 10 0 1 0 12 2" />
    </svg>
  ),
  mail: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x={3} y={5} width={18} height={14} rx={2} />
      <path d="m3 7 9 6 9-6" />
    </svg>
  ),
  bolt: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)} fill="currentColor">
      <path d="M13 2 4 14h6l-1 8 9-12h-6z" />
    </svg>
  ),
  menu: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  ),
  x: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  ),
  check: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  tag: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.6 13.4 12 22l-9-9V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z" />
      <circle cx={7.5} cy={7.5} r={1.3} />
    </svg>
  ),
  ruler: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x={2} y={8} width={20} height={8} rx={1.5} />
      <path d="M7 8v3M11 8v4M15 8v3M19 8v4" />
    </svg>
  ),
  brush: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21c3 0 4-2 4-4l-2-2c-2 0-3.5 1.5-3.5 3.5C1.5 20 2 21 3 21Z" />
      <path d="m7 15 9-9 3 3-9 9" />
      <path d="m14 4 3 3" />
    </svg>
  ),
  box: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 8 9-5 9 5v8l-9 5-9-5z" />
      <path d="m3 8 9 5 9-5M12 13v8" />
    </svg>
  ),
  truck: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 7h11v9H2zM13 10h4l3 3v3h-7" />
      <circle cx={6} cy={18} r={1.6} />
      <circle cx={17} cy={18} r={1.6} />
    </svg>
  ),
  spark: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)} fill="currentColor">
      <path d="M12 2c.6 3.8 2.2 5.4 6 6-3.8.6-5.4 2.2-6 6-.6-3.8-2.2-5.4-6-6 3.8-.6 5.4-2.2 6-6Z" />
    </svg>
  ),
  heart: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20s-7-4.5-9.2-9C1.3 8 2.8 5 6 5c2 0 3.2 1.3 4 2.5C10.8 6.3 12 5 14 5c3.2 0 4.7 3 3.2 6-2.2 4.5-9.2 9-9.2 9Z" />
    </svg>
  ),
  chat: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a8 8 0 0 1-11.5 7.2L3 21l1.8-6.5A8 8 0 1 1 21 12Z" />
    </svg>
  ),
  shield: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 5 6v5c0 4.5 3 7.7 7 9 4-1.3 7-4.5 7-9V6z" />
    </svg>
  ),
  expand: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M3 16v3a2 2 0 0 0 2 2h3" />
    </svg>
  ),
};
