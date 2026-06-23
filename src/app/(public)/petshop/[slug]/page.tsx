import { notFound } from "next/navigation";
import { getPetshopBySlug, incrementPetshopView } from "@/lib/db/queries";
import { formatPrice, SERVICE_LABELS, ANIMAL_LABELS } from "@/lib/utils";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

type PetshopPlan = "free" | "pro" | "premium";

type PetshopAnimal = {
  animalType: keyof typeof ANIMAL_LABELS | string;
};

type PetshopService = {
  id: string;
  type: keyof typeof SERVICE_LABELS | string;
  name: string;
  description?: string | null;
  priceFrom?: number | string | null;
  priceTo?: number | string | null;
};

type PetshopReview = {
  id: string;
  rating: number;
  title?: string | null;
  body?: string | null;
  ownerReply?: string | null;
  user?: {
    name?: string | null;
  } | null;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const petshop = await getPetshopBySlug(slug);
  if (!petshop) return {};
  return {
    title: `${petshop.name} — ${petshop.city}/${petshop.state}`,
    description:
      petshop.description ?? `Petshop em ${petshop.city}, ${petshop.state}.`,
  };
}

export default async function PetshopPage({ params }: Props) {
  const { slug } = await params;
  const petshop = await getPetshopBySlug(slug);
  if (!petshop) notFound();

  // Incrementa visualizações (fire-and-forget)
  incrementPetshopView(petshop.id).catch(console.error);

  const planBadges: Record<
    PetshopPlan,
    { label: string; color: string } | null
  > = {
    free: null,
    pro: { label: "Pro", color: "bg-teal text-white" },
    premium: { label: "Premium", color: "bg-amber text-fg" },
  };

  const allowedPlans = ["free", "pro", "premium"] as const;
  const currentPlan: PetshopPlan = allowedPlans.includes(
    petshop.plan as PetshopPlan,
  )
    ? (petshop.plan as PetshopPlan)
    : "free";
  const planBadge = planBadges[currentPlan];

  return (
    <div className="max-w-[1280px] mx-auto">
      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] border-b-2 border-fg">
        <div className="p-8 lg:p-16 border-b-2 lg:border-b-0 lg:border-r-2 border-fg">
          <div className="flex items-center gap-3 mb-4">
            {planBadge && (
              <span className={`label-xs px-2.5 py-1 ${planBadge.color}`}>
                {planBadge.label}
              </span>
            )}
            {petshop.isVerified && (
              <span className="label-xs px-2.5 py-1 bg-teal text-white">
                ✓ Verificado
              </span>
            )}
          </div>
          <h1 className="text-display-sm text-fg">{petshop.name}</h1>
          <div className="label-xs text-fg/50 mt-2">
            {[petshop.neighborhood, petshop.city, petshop.state]
              .filter(Boolean)
              .join(" · ")}
          </div>
          {petshop.avgRating && Number(petshop.avgRating) > 0 && (
            <div className="flex items-center gap-3 mt-4">
              <div className="text-2xl text-amber">
                {"★".repeat(Math.round(Number(petshop.avgRating)))}
              </div>
              <div className="label-sm text-fg">
                {Number(petshop.avgRating).toFixed(1)} ({petshop.reviewCount}{" "}
                avaliações)
              </div>
            </div>
          )}
          {petshop.description && (
            <p className="text-base leading-relaxed text-fg/70 mt-6 max-w-2xl">
              {petshop.description}
            </p>
          )}

          {/* Animals */}
          {petshop.animals && petshop.animals.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {petshop.animals.map((a: PetshopAnimal) => (
                <span
                  key={a.animalType}
                  className="label-xs border border-fg px-2.5 py-1 text-fg"
                >
                  {ANIMAL_LABELS[a.animalType as keyof typeof ANIMAL_LABELS] ??
                    a.animalType}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar — contact */}
        <div className="p-8 flex flex-col gap-6">
          <div>
            <div className="label-xs text-fg/50 mb-3">Contato</div>
            <div className="flex flex-col gap-3">
              {petshop.phone && (
                <a
                  href={`tel:${petshop.phone}`}
                  className="flex items-center gap-2 text-sm text-fg hover:text-accent transition-colors no-underline"
                >
                  📞 {petshop.phone}
                </a>
              )}
              {petshop.whatsapp && (
                <a
                  href={`https://wa.me/55${petshop.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-fg hover:text-accent transition-colors no-underline"
                >
                  💬 WhatsApp
                </a>
              )}
              {petshop.email && (
                <a
                  href={`mailto:${petshop.email}`}
                  className="flex items-center gap-2 text-sm text-fg hover:text-accent transition-colors no-underline"
                >
                  ✉️ {petshop.email}
                </a>
              )}
            </div>
          </div>

          {petshop.street && (
            <div>
              <div className="label-xs text-fg/50 mb-2">Endereço</div>
              <p className="text-sm text-fg leading-relaxed">
                {petshop.street}, {petshop.number}
                {petshop.complement && `, ${petshop.complement}`}
                <br />
                {petshop.neighborhood && `${petshop.neighborhood}, `}
                {petshop.city}/{petshop.state}
                {petshop.zipCode && ` — CEP ${petshop.zipCode}`}
              </p>
            </div>
          )}

          {/* Contact CTA */}
          <a
            href="#contato"
            className="btn-primary flex items-center justify-center mt-auto"
          >
            Enviar mensagem
          </a>
        </div>
      </div>

      {/* Services */}
      {petshop.services && petshop.services.length > 0 && (
        <div className="border-b-2 border-fg">
          <div className="p-8 lg:p-16">
            <div className="label-sm text-accent mb-2">Serviços</div>
            <div className="text-display-sm mb-8">O que oferecemos</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-2 border-fg">
              {petshop.services.map((s: PetshopService, i: number) => (
                <div
                  key={s.id}
                  className={`
                    p-6
                    ${i % 3 !== 2 ? "border-r-2 border-fg" : ""}
                    ${i < petshop.services.length - 3 ? "border-b-2 border-fg" : ""}
                  `}
                >
                  <div className="label-xs text-accent mb-2">
                    {SERVICE_LABELS[s.type as keyof typeof SERVICE_LABELS] ??
                      s.type}
                  </div>
                  <div className="font-bold text-sm uppercase tracking-[-0.01em]">
                    {s.name}
                  </div>
                  {s.description && (
                    <p className="text-sm text-fg/60 leading-relaxed mt-1">
                      {s.description}
                    </p>
                  )}
                  {s.priceFrom && (
                    <div className="label-xs text-teal mt-3">
                      A partir de {formatPrice(s.priceFrom)}
                      {s.priceTo && ` até ${formatPrice(s.priceTo)}`}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reviews */}
      {petshop.reviews && petshop.reviews.length > 0 && (
        <div className="border-b-2 border-fg">
          <div className="p-8 lg:p-16">
            <div className="label-sm text-accent mb-2">Avaliações</div>
            <div className="text-display-sm mb-8">
              {Number(petshop.avgRating).toFixed(1)} de 5 estrelas
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-2 border-fg">
              {petshop.reviews.map((r: PetshopReview, i: number) => (
                <div
                  key={r.id}
                  className={`
                    p-6
                    ${i % 2 === 0 ? "border-r-2 border-fg" : ""}
                    ${i < petshop.reviews.length - 2 ? "border-b-2 border-fg" : ""}
                  `}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-bold text-sm">
                      {r.user?.name ?? "Tutor"}
                    </div>
                    <div className="text-amber text-sm">
                      {"★".repeat(r.rating)}
                    </div>
                  </div>
                  {r.title && (
                    <div className="font-bold text-sm uppercase mb-1">
                      {r.title}
                    </div>
                  )}
                  {r.body && (
                    <p className="text-sm text-fg/70 leading-relaxed">
                      {r.body}
                    </p>
                  )}
                  {r.ownerReply && (
                    <div className="mt-3 pl-4 border-l-2 border-accent">
                      <div className="label-xs text-accent mb-1">
                        Resposta do estabelecimento
                      </div>
                      <p className="text-sm text-fg/70">{r.ownerReply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
