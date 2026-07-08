import { Ico } from "@/components/ui/icon";

export function Toast({ msg }: { msg: string }) {
  return (
    <div className={"toast " + (msg ? "show" : "")}>
      {msg && (
        <>
          <Ico.check style={{ fontSize: 16 }} /> {msg}
        </>
      )}
    </div>
  );
}
