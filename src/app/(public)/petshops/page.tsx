import Link from "next/link";
import { searchPetshops } from "@/lib/db/queries";
import { ANIMAL_LABELS, SERVICE_LABELS, ESTADOS } from "@/lib/utils";

type PetshopListItem = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  city?: string | null;
  state?: string | null;
  neighborhood?: string | null;
  animals?: {
    animalType: keyof typeof ANIMAL_LABELS;
  }[];
  services?: string[];
  plan?: "free" | "pro" | "premium" | string | null;
  avgRating?: number | string | null;
  reviewCount?: number | string | null;
};

interface Props {
  searchParams: Promise<{
    q?: string;
    cidade?: string;
    estado?: string;
    animal?: string;
    service?: string;
    pagina?: string;
  }>;
}

export const metadata = {
  title: "Encontrar Petshops",
  description: "Busque petshops e serviços veterinários em todo o Brasil.",
};

export default async function PetshopsPage({ searchParams }: Props) {
  const params = await searchParams;

  const { data: petshops, total, pages, page } = await searchPetshops({
    query: params.q,
    city: params.cidade,
    state: params.estado,
    page: Number(params.pagina ?? 1),
  });

  return (
    <div className="max-w-[1280px] mx-auto">
      {/* Header + Search */}
      <div className="border-b-2 border-fg px-8 py-12 swiss-grid">
        <div className="label-sm text-accent mb-2">Diretório Nacional</div>
        <h1 className="text-display-sm mb-8">
          {total > 0 ? `${total.toLocaleString("pt-BR")} petshops` : "Buscar petshops"}
        </h1>
        <form method="GET" className="grid grid-cols-1 md:grid-cols-4 gap-0 border-2 border-fg">
          <input
            name="q"
            defaultValue={params.q}
            placeholder="Nome ou serviço..."
            className="border-r border-fg/20 px-4 h-12 text-sm bg-white outline-none text-fg placeholder:text-fg/40 col-span-1 md:col-span-2"
          />
          <input
            name="cidade"
            defaultValue={params.cidade}
            placeholder="Cidade..."
            className="border-r border-fg/20 px-4 h-12 text-sm bg-white outline-none text-fg placeholder:text-fg/40"
          />
          <div className="flex">
            <select
              name="estado"
              defaultValue={params.estado}
              className="flex-1 px-4 h-12 text-sm bg-white border-none outline-none text-fg appearance-none cursor-pointer"
            >
              <option value="">Todos os estados</option>
              {ESTADOS.map((e) => (
                <option key={e.uf} value={e.uf}>{e.uf} — {e.nome}</option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-fg text-white label-xs px-6 h-12 hover:bg-accent transition-colors cursor-pointer border-l-2 border-fg"
            >
              Buscar
            </button>
          </div>
        </form>

        {/* Active filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          {params.animal && (
            <span className="label-xs border border-accent text-accent px-2.5 py-1">
              {ANIMAL_LABELS[params.animal] ?? params.animal}
            </span>
          )}
          {params.service && (
            <span className="label-xs border border-accent text-accent px-2.5 py-1">
              {SERVICE_LABELS[params.service] ?? params.service}
            </span>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="px-8 py-12">
        {petshops.length === 0 ? (
          <div className="border-2 border-fg p-16 text-center">
            <div className="text-4xl mb-4">🐾</div>
            <div className="text-display-sm mb-2">Nenhum resultado</div>
            <p className="text-fg/60">Tente buscar por outra cidade ou serviço.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-2 border-fg">
            {petshops.map((shop: PetshopListItem, i: number) => {
              const col = i % 3;
              const row = Math.floor(i / 3);
              const totalRows = Math.ceil(petshops.length / 3);
              return (
                <Link
                  key={shop.id}
                  href={`/petshop/${shop.slug}`}
                  className={`
                    p-8 no-underline text-fg bg-white group hover:bg-fg transition-colors duration-150
                    ${col < 2 ? "border-r-2 border-fg" : ""}
                    ${row < totalRows - 1 ? "border-b-2 border-fg" : ""}
                  `}
                >
                  {shop.plan !== "free" && (
                    <div className={`label-xs px-2.5 py-1 inline-block mb-4 ${shop.plan === "premium" ? "bg-amber text-fg" : "bg-teal text-white"}`}>
                      {shop.plan === "premium" ? "Premium" : "Pro"}
                    </div>
                  )}
                  <div className="font-black text-xl tracking-[-0.02em] uppercase leading-none text-fg group-hover:text-white transition-colors">
                    {shop.name}
                  </div>
                  <div className="label-xs text-fg/50 group-hover:text-white/60 mt-1.5 transition-colors">
                    {shop.city} · {shop.state}
                    {shop.neighborhood && ` — ${shop.neighborhood}`}
                  </div>
                  {Number(shop.avgRating) > 0 && (
                    <div className="label-xs text-accent group-hover:text-amber mt-3 transition-colors">
                      ★ {Number(shop.avgRating).toFixed(1)} ({shop.reviewCount})
                    </div>
                  )}
                  {shop.animals && shop.animals.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {shop.animals.slice(0, 3).map((a: { animalType: keyof typeof ANIMAL_LABELS }) => (
                        <span key={a.animalType} className="label-xs border border-fg/20 group-hover:border-white/25 px-2 py-0.5 text-fg/50 group-hover:text-white/60 transition-colors">
                          {ANIMAL_LABELS[a.animalType]?.split(" ")[1] ?? a.animalType}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center gap-0 mt-8 border-2 border-fg w-fit">
            {Array.from({ length: Math.min(pages, 10) }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`?${new URLSearchParams({ ...params, pagina: String(p) })}`}
                className={`
                  w-12 h-12 flex items-center justify-center label-xs no-underline border-r last:border-r-0 border-fg/20 transition-colors
                  ${p === page ? "bg-fg text-white" : "text-fg hover:bg-muted"}
                `}
              >
                {p}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
