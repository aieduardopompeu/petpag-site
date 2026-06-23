import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getPetshopsByOwner } from "@/lib/db/queries";
import Link from "next/link";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const myPetshops = await getPetshopsByOwner(session.user.id);
  const hasPetshop = myPetshops.length > 0;
  const petshop = myPetshops[0]; // por ora, 1 petshop por usuário

  return (
    <div className="p-8 lg:p-12">
      {/* Greeting */}
      <div className="border-b-2 border-fg pb-8 mb-10">
        <div className="label-sm text-accent mb-1">Bem-vindo de volta</div>
        <h1 className="text-display-sm">{session.user?.name ?? "Usuário"}</h1>
      </div>

      {!hasPetshop ? (
        /* Onboarding — sem petshop cadastrado */
        <div className="border-2 border-fg p-12 max-w-xl">
          <div className="text-4xl mb-4">🐾</div>
          <div className="text-2xl font-black uppercase tracking-[-0.02em] mb-3">
            Cadastre seu petshop
          </div>
          <p className="text-sm text-fg/60 leading-relaxed mb-8">
            Você ainda não tem um petshop cadastrado no Pet-Pag. Cadastre agora e alcance milhares
            de tutores em todo o Brasil.
          </p>
          <Link href="/petshop/novo" className="btn-primary">
            Cadastrar petshop
          </Link>
        </div>
      ) : (
        <>
          {/* Status banner */}
          {petshop.status === "pending" && (
            <div className="border-2 border-amber bg-amber/10 p-4 mb-8 flex items-center gap-3">
              <span className="text-xl">⏳</span>
              <div>
                <div className="font-bold text-sm uppercase">Aguardando aprovação</div>
                <div className="text-sm text-fg/60">Seu petshop está em análise. Você receberá um email quando for aprovado.</div>
              </div>
            </div>
          )}

          {/* Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 border-2 border-fg mb-10">
            {[
              { label: "Visualizações", value: petshop.viewCount.toLocaleString("pt-BR"), sub: "Total" },
              { label: "Avaliações", value: petshop.reviewCount, sub: petshop.avgRating ? `Média: ${Number(petshop.avgRating).toFixed(1)}★` : "Nenhuma ainda" },
              { label: "Plano atual", value: petshop.plan.toUpperCase(), sub: petshop.plan === "free" ? "Upgrade disponível" : "Ativo" },
              { label: "Status", value: petshop.status === "active" ? "Ativo" : petshop.status === "pending" ? "Pendente" : "Inativo", sub: petshop.isVerified ? "✓ Verificado" : "Não verificado" },
            ].map((metric, i) => (
              <div key={i} className={`p-6 ${i < 3 ? "border-r-2 border-fg" : ""}`}>
                <div className="label-xs text-fg/50 mb-2">{metric.label}</div>
                <div className="text-2xl font-black tracking-[-0.03em]">{metric.value}</div>
                <div className="label-xs text-fg/40 mt-1">{metric.sub}</div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 border-2 border-fg">
            {[
              { icon: "✏️", label: "Editar petshop", desc: "Atualizar dados, fotos e serviços", href: "/dashboard/petshop" },
              { icon: "💬", label: "Ver mensagens", desc: "Responda tutores interessados", href: "/dashboard/mensagens" },
              { icon: "💳", label: "Gerenciar plano", desc: "Upgrade para mais visibilidade", href: "/dashboard/plano" },
            ].map((action, i) => (
              <Link
                key={i}
                href={action.href}
                className={`p-8 no-underline text-fg group hover:bg-fg transition-colors duration-150 ${i < 2 ? "border-r-2 border-fg" : ""}`}
              >
                <div className="text-3xl mb-4">{action.icon}</div>
                <div className="font-bold text-sm uppercase tracking-[-0.01em] group-hover:text-white transition-colors">{action.label}</div>
                <div className="text-sm text-fg/60 group-hover:text-white/60 mt-1 transition-colors">{action.desc}</div>
              </Link>
            ))}
          </div>

          {/* View public profile */}
          <div className="mt-8">
            <Link
              href={`/petshop/${petshop.slug}`}
              className="label-sm text-fg no-underline border-b-2 border-fg pb-0.5 hover:text-accent hover:border-accent transition-colors"
            >
              Ver perfil público → petpag.com.br/petshop/{petshop.slug}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
