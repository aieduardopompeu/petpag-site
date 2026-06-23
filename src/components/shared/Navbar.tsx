import Link from "next/link";
import { auth } from "@/lib/auth";

export async function Navbar() {
  const session = await auth();

  return (
    <nav className="border-b-[3px] border-fg bg-white sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto flex items-center h-16 px-8">
        {/* Logo */}
        <Link
          href="/"
          className="font-black text-xl tracking-[-0.04em] uppercase text-fg border-r-2 border-fg pr-6 mr-6 leading-none flex-shrink-0 no-underline"
        >
          Pet<span className="text-accent">-Pag</span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex flex-1">
          <Link href="/petshops" className="nav-link">Petshops</Link>
          <Link href="/produtos" className="nav-link">Produtos</Link>
          <Link href="/servicos" className="nav-link">Serviços</Link>
          <Link href="/veterinarios" className="nav-link">Veterinários</Link>
          <Link href="/blog" className="nav-link">Conteúdo</Link>
          <Link href="/anunciar" className="nav-link border-r-0">Anunciar</Link>
        </div>

        {/* CTA */}
        <div className="ml-auto flex items-center gap-0 flex-shrink-0">
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="nav-link border-r-0 border-l-2 border-fg/10"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="nav-link border-l-2 border-fg/10"
              >
                Entrar
              </Link>
              <Link
                href="/petshop/novo"
                className="bg-accent text-white font-bold text-[0.7rem] tracking-[0.1em] uppercase px-6 h-10 flex items-center transition-colors duration-150 hover:bg-fg ml-0"
              >
                Cadastrar Petshop
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
