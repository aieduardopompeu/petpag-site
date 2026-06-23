import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  const navItems = [
    { href: "/dashboard", label: "Visão geral", icon: "📊" },
    { href: "/dashboard/petshop", label: "Meu petshop", icon: "🏪" },
    { href: "/dashboard/servicos", label: "Serviços", icon: "✂️" },
    { href: "/dashboard/fotos", label: "Fotos", icon: "📸" },
    { href: "/dashboard/mensagens", label: "Mensagens", icon: "💬" },
    { href: "/dashboard/avaliacoes", label: "Avaliações", icon: "⭐" },
    { href: "/dashboard/plano", label: "Plano", icon: "💳" },
  ];

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[260px_1fr]">
      {/* Sidebar */}
      <aside className="bg-fg border-r-[3px] border-fg lg:min-h-screen">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="font-black text-xl tracking-[-0.04em] uppercase text-white no-underline">
            Pet<span className="text-accent">-Pag</span>
          </Link>
          <div className="label-xs text-white/40 mt-1">Dashboard</div>
        </div>

        <nav className="py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-6 py-3.5 text-sm text-white/60 no-underline hover:bg-white/10 hover:text-white transition-colors duration-150"
            >
              <span className="text-base">{item.icon}</span>
              <span className="font-medium tracking-wide">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 w-[260px] border-t border-white/10 p-6 hidden lg:block">
          <div className="label-xs text-white/40 mb-1">Logado como</div>
          <div className="text-sm text-white font-medium truncate">{session.user?.name ?? session.user?.email}</div>
          <Link
            href="/api/auth/signout"
            className="label-xs text-accent no-underline hover:text-white mt-3 block transition-colors"
          >
            Sair →
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main className="bg-bg min-h-screen">
        {children}
      </main>
    </div>
  );
}
