"use client";

interface QtyStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
}

export function QtyStepper({ value, onChange, min = 1 }: QtyStepperProps) {
  const btnClass = "h-11 w-[42px] cursor-pointer border-0 bg-surface text-xl text-ink hover:bg-paper-2";
  return (
    <div className="inline-flex items-center overflow-hidden rounded-full border-[1.5px] border-line-strong">
      <button type="button" className={btnClass} onClick={() => onChange(Math.max(min, value - 1))} aria-label="menos">
        –
      </button>
      <span className="w-11 text-center font-bold [font-variant-numeric:tabular-nums]">{value}</span>
      <button type="button" className={btnClass} onClick={() => onChange(value + 1)} aria-label="más">
        +
      </button>
    </div>
  );
}
