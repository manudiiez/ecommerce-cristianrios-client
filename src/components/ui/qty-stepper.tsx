"use client";

interface QtyStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
}

export function QtyStepper({ value, onChange, min = 1 }: QtyStepperProps) {
  return (
    <div className="qty">
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} aria-label="menos">
        –
      </button>
      <span>{value}</span>
      <button type="button" onClick={() => onChange(value + 1)} aria-label="más">
        +
      </button>
    </div>
  );
}
