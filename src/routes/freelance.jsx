import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/AppShell";
import { Card, Button, Input } from "@/components/ui-bits";
import { useT, useAppState, COUNTRY_META } from "@/providers/app-providers";
import { Receipt, Download } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/freelance")({
  head: () => ({ meta: [{ title: "Freelance — ExpatCareer AI" }] }),
  component: FreelancePage,
});

function FreelancePage() {
  const { t } = useT();
  const { country } = useAppState();
  const [client, setClient] = useState("Acme GmbH");
  const [desc, setDesc] = useState("Frontend development services — January 2025");
  const [amount, setAmount] = useState(2400);
  const [vat, setVat] = useState(19);

  const tax = Math.round((amount * vat) / 100);
  const total = amount + tax;
  const inv = `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`;

  return (
    <div>
      <PageHeader badge="17 / 20  ·  FREELANCE" title={t("page.freelance.title")} subtitle={t("page.freelance.subtitle")} />
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-display font-semibold mb-3 flex items-center gap-2"><Receipt className="size-4 text-neon" /> Yangi invoice</h3>
          <div className="space-y-3">
            <div><label className="text-xs text-muted-foreground">Mijoz</label><Input value={client} onChange={(e) => setClient(e.target.value)} /></div>
            <div><label className="text-xs text-muted-foreground">Tavsif</label><Input value={desc} onChange={(e) => setDesc(e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-muted-foreground">Summa</label><Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} /></div>
              <div><label className="text-xs text-muted-foreground">VAT / soliq %</label><Input type="number" value={vat} onChange={(e) => setVat(Number(e.target.value))} /></div>
            </div>
            <Button onClick={() => toast.success(`${inv} tayyor`)} className="w-full"><Download className="size-4" /> {t("page.freelance.invoice")}</Button>
          </div>
        </Card>
        <Card className="neon-border">
          <div className="border-b border-border pb-3 mb-3 flex justify-between items-start">
            <div>
              <div className="text-xs text-muted-foreground">INVOICE</div>
              <div className="font-display text-2xl font-bold gradient-text">{inv}</div>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              <div>{COUNTRY_META[country].flag} {t(`country.${country}`)}</div>
              <div>{new Date().toLocaleDateString()}</div>
            </div>
          </div>
          <div className="text-sm space-y-1 mb-4">
            <div className="text-muted-foreground text-xs">Bill to:</div>
            <div className="font-semibold">{client}</div>
          </div>
          <div className="bg-surface rounded-lg p-3 text-sm mb-3">{desc}</div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${amount.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">VAT {vat}%</span><span>${tax.toLocaleString()}</span></div>
            <div className="flex justify-between border-t border-border pt-2 mt-2 font-bold text-base"><span>Total</span><span className="text-emerald-glow">${total.toLocaleString()}</span></div>
          </div>
        </Card>
      </div>
    </div>
  );
}