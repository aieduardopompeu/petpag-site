import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Rotas que exigem autenticação
const PROTECTED_ROUTES = ["/dashboard", "/petshop/novo", "/petshop/editar"];

// Rotas apenas para admins
const ADMIN_ROUTES = ["/admin"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Rotas admin
  if (ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!session || session.user.role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Rotas protegidas (qualquer usuário logado)
  if (PROTECTED_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!session) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redireciona usuário já logado que tenta acessar /login ou /cadastro
  if (session && (pathname === "/login" || pathname === "/cadastro")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth|api/uploadthing).*)",
  ],
};
