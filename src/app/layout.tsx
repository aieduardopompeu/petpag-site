import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Pet-Pag — O Hub Pet do Brasil",
    template: "%s | Pet-Pag",
  },
  description:
    "O maior diretório de petshops, serviços veterinários e produtos pet do Brasil. Encontre, compare e conecte-se com os melhores profissionais da sua região.",
  keywords: ["petshop", "veterinário", "pet", "brasil", "banho", "tosa", "ração"],
  openGraph: {
    title: "Pet-Pag — O Hub Pet do Brasil",
    description: "O maior diretório de petshops do Brasil.",
    url: "https://petpag.com.br",
    siteName: "Pet-Pag",
    locale: "pt_BR",
    type: "website",
  },
  robots: { index: true, follow: true },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://petpag.com.br"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="bg-bg text-fg antialiased">{children}</body>
    </html>
  );
}
