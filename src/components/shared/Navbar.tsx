import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";

export async function Navbar() {
  const session = await auth();

  return (
    <nav className="bg-fg border-b-[3px] border-fg">
      <div className="max-w-[1280px] mx-auto flex items-center h-28 px-8">
        {/* Logo */}
        <Link
          href="/"
          className="border-r border-white/10 pr-8 mr-8 flex-shrink-0 flex items-center self-stretch"
        >
          <Image
            src="/logo-pet-pag-com.png"
            alt="Pet-Pag"
            width={160}
            height={160}
            className="h-32 w-auto brightness-0 invert"
            priority
          />
        </Link>

        {/* Links */}
        <div className="hidden md:flex flex-1">
          {[
            ["Petshops", "/petshops"],
            ["Produtos", "/produtos"],
            ["Serviços", "/servicos"],
            ["Veterinários", "/veterinarios"],
            ["Conteúdo", "/blog"],
            ["Anunciar", "/anunciar"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="text-white/60 hover:text-white transition-colors duration-150 text-[0.7rem] font-bold tracking-[0.08em] uppercase px-5 border-r border-white/10 h-28 flex items-center"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="ml-auto flex items-center flex-shrink-0">
          {session ? (
            <Link
              href="/dashboard"
              className="text-white/60 hover:text-white transition-colors duration-150 text-[0.7rem] font-bold tracking-[0.08em] uppercase px-5 border-l border-white/10 h-28 flex items-center"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-white/60 hover:text-white transition-colors duration-150 text-[0.7rem] font-bold tracking-[0.08em] uppercase px-5 border-l border-white/10 h-28 flex items-center"
              >
                Entrar
              </Link>
              <Link
                href="/petshop/novo"
                className="bg-accent text-white font-bold text-[0.7rem] tracking-[0.1em] uppercase px-6 h-10 flex items-center transition-colors duration-150 hover:opacity-90 ml-4"
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
