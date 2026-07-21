import { Ico } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

export function Toast({ msg }: { msg: string }) {
  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 z-[200] flex -translate-x-1/2 items-center gap-2.5 rounded-full bg-ink py-3.5 px-[22px] text-sm font-semibold text-paper shadow-[0_16px_40px_-16px_rgba(0,0,0,.5)] transition-all duration-[250ms]",
        msg ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
      )}
    >
      {msg && (
        <>
          <Ico.check style={{ fontSize: 16 }} /> {msg}
        </>
      )}
    </div>
  );
}
