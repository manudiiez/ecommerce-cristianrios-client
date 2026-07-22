import { notFound } from "next/navigation";
import { Crumb } from "@/components/features/catalog/crumb";
import { FlashDetailView } from "@/components/features/flash/flash-detail-view";
import { api } from "@/lib/api";

export default async function FlashDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deal = await api.flash.getById(id);
  if (!deal) notFound();

  return (
    <main className="animate-fade-in" id="main">
      <Crumb
        trail={[
          { label: "Inicio", href: "/" },
          { label: "Ofertas Flash", href: "/ofertas-flash" },
          { label: deal.name },
        ]}
      />
      <FlashDetailView deal={deal} />
    </main>
  );
}
