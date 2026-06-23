import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-fg border-t-[3px] border-fg">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-0 border-b border-white/10 px-8 py-16">
        {/* Brand */}
        <div className="border-b md:border-b-0 md:border-r border-white/10 pb-8 md:pb-0 md:pr-8">
          <div className="font-black text-2xl tracking-[-0.04em] uppercase text-white">
            Pet<span className="text-accent">-Pag</span>
          </div>
          <p className="text-sm text-white/40 mt-4 leading-relaxed">
            O maior hub de informação e diretório de petshops do Brasil. Conectando tutores e
            profissionais pet.
          </p>
        </div>

        {/* Tutores */}
        <div className="md:pl-8 pt-8 md:pt-0">
          <div className="label-sm text-amber mb-5">Para tutores</div>
          {[
            ["Encontrar petshop", "/petshops"],
            ["Buscar veterinário", "/veterinarios"],
            ["Comparar produtos", "/produtos"],
            ["Guias e dicas", "/blog"],
            ["App Pet-Pag", "/app"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="block text-sm text-white/50 mb-2.5 no-underline hover:text-white transition-colors duration-150"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Petshops */}
        <div className="md:pl-8 pt-8 md:pt-0">
          <div className="label-sm text-amber mb-5">Para petshops</div>
          {[
            ["Cadastrar loja", "/petshop/novo"],
            ["Planos e preços", "/anunciar#planos"],
            ["Central de ajuda", "/ajuda"],
            ["Anunciar no site", "/anunciar"],
            ["Blog para lojistas", "/blog/lojistas"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="block text-sm text-white/50 mb-2.5 no-underline hover:text-white transition-colors duration-150"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Empresa */}
        <div className="md:pl-8 pt-8 md:pt-0">
          <div className="label-sm text-amber mb-5">Pet-Pag</div>
          {[
            ["Sobre nós", "/sobre"],
            ["Imprensa", "/imprensa"],
            ["Contato", "/contato"],
            ["Trabalhe conosco", "/vagas"],
            ["Investidores", "/investidores"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="block text-sm text-white/50 mb-2.5 no-underline hover:text-white transition-colors duration-150"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="label-xs text-white/30">© {new Date().getFullYear()} Pet-Pag. Todos os direitos reservados.</p>
        <div className="flex gap-6">
          {[["Privacidade", "/privacidade"], ["Termos", "/termos"], ["Cookies", "/cookies"]].map(
            ([label, href]) => (
              <Link
                key={href}
                href={href}
                className="label-xs text-white/30 no-underline hover:text-white transition-colors duration-150"
              >
                {label}
              </Link>
            )
          )}
        </div>
      </div>
    </footer>
  );
}
