import Link from "next/link";
import { getFeaturedPetshops } from "@/lib/db/queries";
import { SERVICE_LABELS, ANIMAL_LABELS } from "@/lib/utils";

export default async function HomePage() {
  const featured = await getFeaturedPetshops(3);

  return (
    <>
      {/* ===== HERO — coluna única, busca centralizada ===== */}
      <section className="border-b-[3px] border-fg swiss-grid py-24 lg:py-36">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="section-label flex items-center gap-3 mb-8">
            <span className="inline-block w-8 h-0.5 bg-accent" />
            O Hub Pet do Brasil
          </div>

          <h1 className="text-display text-fg max-w-4xl">
            Tudo para<br />
            o seu <span className="text-accent">Pet.</span>
          </h1>

          <p className="text-lg leading-relaxed text-fg/60 max-w-2xl mt-8">
            O maior diretório de petshops, serviços veterinários e produtos pet do Brasil.
            Encontre, compare e conecte-se com os melhores profissionais da sua região.
          </p>

          {/* Busca principal */}
          <form action="/petshops" method="GET" className="flex mt-12 max-w-2xl border-2 border-fg">
            <input
              name="q"
              type="text"
              placeholder="Cidade, bairro ou serviço..."
              className="flex-1 border-none bg-white px-5 text-base outline-none h-14 text-fg placeholder:text-fg/40"
            />
            <button
              type="submit"
              className="bg-fg text-white label-xs px-8 h-14 flex-shrink-0 cursor-pointer transition-colors hover:bg-accent"
            >
              Buscar
            </button>
          </form>

          <div className="mt-5">
            <Link
              href="/petshop/novo"
              className="label-sm text-fg/50 no-underline hover:text-accent transition-colors border-b border-fg/20 pb-0.5"
            >
              Cadastre seu petshop gratuitamente →
            </Link>
          </div>

          {/* Stats — 4 colunas */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-t-2 border-fg mt-20 pt-10">
            {[
              { num: "12k+",  label: "Petshops cadastrados" },
              { num: "27",    label: "Estados cobertos" },
              { num: "153M",  label: "Pets no Brasil" },
              { num: "14%",   label: "Crescimento anual do setor" },
            ].map((s, i) => (
              <div
                key={i}
                className={`
                  ${i < 3 ? "border-r-2 border-fg" : ""}
                  ${i > 0 ? "pl-8" : ""}
                  ${i < 2 ? "pb-8 md:pb-0" : ""}
                  pr-8
                `}
              >
                <div className="text-[2.5rem] font-black tracking-[-0.04em] text-fg leading-none">
                  {s.num}
                </div>
                <div className="label-xs text-fg/50 mt-2">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MARQUEE ===== */}
      <div className="border-b-2 border-fg bg-fg overflow-hidden h-11 flex items-center">
        <div
          className="flex whitespace-nowrap"
          style={{ animation: "marquee 22s linear infinite" }}
        >
          {[...Object.values(SERVICE_LABELS), ...Object.values(SERVICE_LABELS)].map((s, i) => (
            <span key={i} className="label-xs text-amber px-8 border-r border-white/15 flex-shrink-0">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* ===== 01. CATEGORIAS — fundo branco ===== */}
      <div className="bg-white border-b-2 border-fg">
        <div className="max-w-[1280px] mx-auto px-8 py-28">
          <div className="flex items-end justify-between border-b-2 border-fg pb-8 mb-14">
            <div>
              <div className="section-label">01. Categorias</div>
              <div className="text-display-sm mt-3">
                Explore<br />por tipo
              </div>
            </div>
            <Link
              href="/petshops"
              className="label-sm text-fg no-underline border-b-2 border-fg pb-0.5 hover:text-accent hover:border-accent transition-colors"
            >
              Ver todas →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border-2 border-fg">
            {[
              { icon: "🐕", name: "Cães",    count: "8.400+", href: "/petshops?animal=cachorro" },
              { icon: "🐈", name: "Gatos",   count: "5.200+", href: "/petshops?animal=gato" },
              { icon: "🐦", name: "Aves",    count: "1.800+", href: "/petshops?animal=ave" },
              { icon: "🐟", name: "Aquário", count: "2.100+", href: "/petshops?animal=peixe" },
              { icon: "🦎", name: "Répteis", count: "640+",   href: "/petshops?animal=reptil" },
              { icon: "💊", name: "Saúde",   count: "3.900+", href: "/petshops?service=veterinario" },
            ].map((cat, i) => (
              <Link
                key={i}
                href={cat.href}
                className="border-r-2 border-fg last:border-r-0 p-8 flex flex-col gap-5 no-underline text-fg group hover:bg-fg hover:text-white transition-colors duration-150"
              >
                <span className="text-4xl leading-none group-hover:scale-110 transition-transform duration-150 inline-block">
                  {cat.icon}
                </span>
                <span className="label-sm">{cat.name}</span>
                <span className="text-[0.6rem] opacity-40 mt-auto">{cat.count} produtos</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ===== 02. DESTAQUES — fundo muted com dots ===== */}
      <div className="bg-muted swiss-dots border-b-2 border-fg">
        <div className="max-w-[1280px] mx-auto px-8 py-28">
          <div className="flex items-end justify-between border-b-2 border-fg pb-8 mb-14">
            <div>
              <div className="section-label">02. Destaques</div>
              <div className="text-display-sm mt-3">
                Petshops<br />em destaque
              </div>
            </div>
            <Link
              href="/petshops"
              className="label-sm text-fg no-underline border-b-2 border-fg pb-0.5 hover:text-accent hover:border-accent transition-colors"
            >
              Ver diretório →
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 border-2 border-fg">
              {featured.map((shop: any, i: number) => (
                <Link
                  key={shop.id}
                  href={`/petshop/${shop.slug}`}
                  className={`${i < featured.length - 1 ? "border-r-2 border-fg" : ""} p-8 bg-white no-underline group hover:bg-fg transition-colors duration-150`}
                >
                  <div className="label-xs bg-amber text-fg px-2.5 py-1 inline-block mb-5 group-hover:bg-accent group-hover:text-white transition-colors">
                    ★ Destaque
                  </div>
                  <div className="text-[1.4rem] font-black tracking-[-0.02em] uppercase leading-none text-fg group-hover:text-white transition-colors">
                    {shop.name}
                  </div>
                  <div className="label-xs text-fg/50 group-hover:text-white/60 mt-1.5 transition-colors">
                    {shop.city} · {shop.state}
                  </div>
                  <hr className="border-fg/10 group-hover:border-white/15 my-5 transition-colors" />
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {shop.animalTypes?.slice(0, 4).map((a: string) => (
                      <span key={a} className="label-xs border border-fg/10 px-2 py-0.5">
                        {ANIMAL_LABELS[a as keyof typeof ANIMAL_LABELS] ?? a}
                      </span>
                    ))}
                  </div>
                  {shop.avgRating && (
                    <div className="label-xs text-accent group-hover:text-amber transition-colors">
                      ★ {Number(shop.avgRating).toFixed(1)} ({shop.reviewCount} avaliações)
                    </div>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 border-2 border-fg">
              {[
                { badge: "★ Top Avaliado", name: "Patinhas\nFelizes",  city: "São Paulo · SP",         rating: "4.9", reviews: 312 },
                { badge: "🚀 Premium",     name: "VetCenter\nAnimal",   city: "Rio de Janeiro · RJ",    rating: "4.8", reviews: 489 },
                { badge: "⚡ Novo",        name: "PetLux\nBoutique",    city: "Belo Horizonte · MG",    rating: "4.6", reviews: 127 },
              ].map((s, i) => (
                <div key={i} className={`${i < 2 ? "border-r-2 border-fg" : ""} p-8 bg-white group hover:bg-fg transition-colors duration-150`}>
                  <div className="label-xs bg-amber text-fg px-2.5 py-1 inline-block mb-5 group-hover:bg-accent group-hover:text-white transition-colors">
                    {s.badge}
                  </div>
                  <div className="text-[1.4rem] font-black tracking-[-0.02em] uppercase leading-none text-fg group-hover:text-white transition-colors whitespace-pre-line">
                    {s.name}
                  </div>
                  <div className="label-xs text-fg/50 group-hover:text-white/60 mt-1.5 transition-colors">{s.city}</div>
                  <hr className="border-fg/10 group-hover:border-white/15 my-5" />
                  <div className="label-xs text-accent group-hover:text-amber transition-colors">
                    ★ {s.rating} ({s.reviews} avaliações)
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== 03. SERVIÇOS — fundo branco ===== */}
      <div className="bg-white border-b-2 border-fg">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-[320px_1fr]">
          <div className="bg-fg p-14 border-b-[3px] md:border-b-0 md:border-r-[3px] border-fg swiss-diagonal flex flex-col justify-between">
            <div>
              <div className="label-sm text-amber">03. Serviços</div>
              <div className="text-[2.2rem] font-black tracking-[-0.03em] uppercase text-white leading-[0.95] mt-3">
                Tudo<br />que o<br />seu pet<br />precisa
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed mt-8">
              Da consulta veterinária ao spa, do daycare ao táxi pet — encontre todos os
              serviços especializados perto de você.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2">
            {[
              { num: "01", name: "Banho & Tosa",        desc: "Higiene, corte e embelezamento com profissionais certificados." },
              { num: "02", name: "Consulta Veterinária", desc: "Clínicos gerais, especialistas e atendimento 24h." },
              { num: "03", name: "Hotel & Daycare",      desc: "Hospedagem e creche com monitoramento em tempo real." },
              { num: "04", name: "Dog Walker & Táxi",    desc: "Passeios diários e transporte seguro até o petshop." },
            ].map((s, i) => (
              <Link
                key={i}
                href={`/petshops?service=${encodeURIComponent(s.name)}`}
                className={`
                  p-12 no-underline text-fg group hover:bg-accent transition-colors duration-150
                  ${i < 2 ? "border-b-2 border-fg" : ""}
                  ${i % 2 === 0 ? "border-r-2 border-fg" : ""}
                `}
              >
                <div className="label-xs text-accent group-hover:text-white/60 mb-5">{s.num} —</div>
                <div className="text-[1.15rem] font-black tracking-[-0.02em] uppercase text-fg group-hover:text-white transition-colors">
                  {s.name}
                </div>
                <div className="text-sm leading-relaxed text-fg/60 group-hover:text-white/80 mt-3 transition-colors">
                  {s.desc}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ===== 04. PLANOS — fundo escuro ===== */}
      <div className="bg-fg border-b-2 border-fg">
        <div className="max-w-[1280px] mx-auto px-8 py-28">
          <div className="border-b border-white/10 pb-8 mb-14">
            <div className="label-sm text-amber">04. Anuncie no Pet-Pag</div>
            <div className="text-display-sm text-white mt-3">
              Planos para<br />seu petshop
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 border border-white/12">
            {[
              {
                name: "Básico",
                price: "Grátis",
                period: "",
                features: ["Perfil no diretório", "Até 5 fotos", "Endereço e telefone", "Avaliações"],
                featured: false,
              },
              {
                name: "Pro",
                price: "R$149",
                period: "/mês",
                features: ["Destaque regional", "Fotos ilimitadas", "Catálogo de serviços", "Agendamento online", "Selo verificado", "Relatórios"],
                featured: true,
              },
              {
                name: "Premium",
                price: "R$349",
                period: "/mês",
                features: ["Tudo do Pro", "Banner na home", "Publicar artigos", "API de integração", "Gerente dedicado"],
                featured: false,
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`${i < 2 ? "border-r border-white/12" : ""} p-10 relative ${plan.featured ? "bg-accent" : ""}`}
              >
                {plan.featured && (
                  <div className="absolute -top-0.5 right-8 bg-amber text-fg label-xs px-3 py-1">
                    Mais popular
                  </div>
                )}
                <div className="label-xs text-white/50 mb-3">{plan.name}</div>
                <div className="text-[3rem] font-black tracking-[-0.04em] text-white leading-none">
                  {plan.price}
                  {plan.period && <span className="text-base font-normal opacity-50 ml-1">{plan.period}</span>}
                </div>
                <div className="mt-8 flex flex-col gap-3">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-white/70">
                      <span className="text-amber font-bold text-xs">→</span>
                      {f}
                    </div>
                  ))}
                </div>
                <Link
                  href={plan.featured ? "/petshop/novo?plano=pro" : i === 0 ? "/petshop/novo" : "/contato"}
                  className={`
                    block w-full mt-10 h-12 flex items-center justify-center label-xs border-2 transition-all duration-150 no-underline text-center
                    ${plan.featured
                      ? "bg-white text-accent border-white hover:bg-fg hover:text-white hover:border-fg"
                      : "bg-transparent text-white border-white/30 hover:bg-white hover:text-fg"
                    }
                  `}
                >
                  {i === 0 ? "Cadastrar grátis" : i === 1 ? "Começar agora" : "Falar com vendas"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== 05. BLOG — fundo muted ===== */}
      <div className="bg-muted border-t-2 border-fg">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-[300px_1fr]">
          <div className="border-b-2 md:border-b-0 md:border-r-2 border-fg px-8 py-28 flex flex-col justify-between">
            <div>
              <div className="section-label">05. Conteúdo</div>
              <div className="text-display-sm mt-3">
                Guias &<br />Dicas<br />Pet
              </div>
              <p className="text-sm leading-relaxed text-fg/60 mt-6">
                Informação confiável sobre saúde, nutrição, comportamento e bem-estar animal.
              </p>
            </div>
            <Link
              href="/blog"
              className="label-sm text-fg no-underline border-b-2 border-fg pb-0.5 hover:text-accent hover:border-accent transition-colors mt-10 inline-block self-start"
            >
              Ver todos os artigos →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2">
            {[
              { cat: "Nutrição",      title: "Ração premium vs. super-premium: qual escolher para o seu cão?",   excerpt: "Entenda as diferenças nos ingredientes e como escolher a melhor opção.", date: "12 Jun 2025" },
              { cat: "Saúde",        title: "Calendário de vacinas 2025: tudo que seu gato precisa saber",      excerpt: "Guia completo com as vacinas obrigatórias e opcionais para felinos.",      date: "8 Jun 2025" },
              { cat: "Comportamento", title: "Ansiedade de separação: como ajudar seu pet quando você sai",     excerpt: "Técnicas validadas por veterinários comportamentalistas.",                   date: "3 Jun 2025" },
              { cat: "Tendências",   title: "Pet humanizado: o mercado que cresce 14% ao ano no Brasil",        excerpt: "Como a humanização dos pets está transformando o setor.",                   date: "28 Mai 2025" },
            ].map((post, i) => (
              <Link
                key={i}
                href={`/blog/${i}`}
                className={`
                  p-10 no-underline text-fg group hover:bg-fg transition-colors duration-150
                  ${i < 2 ? "border-b-2 border-fg" : ""}
                  ${i % 2 === 0 ? "border-r-2 border-fg" : ""}
                `}
              >
                <div className="label-xs text-accent group-hover:text-amber mb-3 transition-colors">{post.cat}</div>
                <div className="text-base font-bold tracking-[-0.01em] uppercase leading-snug text-fg group-hover:text-white transition-colors">
                  {post.title}
                </div>
                <div className="text-sm leading-relaxed text-fg/60 group-hover:text-white/70 mt-3 transition-colors">{post.excerpt}</div>
                <div className="label-xs text-fg/40 group-hover:text-white/50 mt-5 transition-colors">{post.date}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
