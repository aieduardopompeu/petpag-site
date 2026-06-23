import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge de classes Tailwind sem conflito */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Gera slug a partir de string */
export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Garante slug único adicionando sufixo numérico */
export async function uniqueSlug(
  base: string,
  checkExists: (slug: string) => Promise<boolean>
): Promise<string> {
  const baseSlug = toSlug(base);
  let slug = baseSlug;
  let counter = 1;
  while (await checkExists(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  return slug;
}

/** Formata preço em BRL */
export function formatPrice(value: number | string | null): string {
  if (!value) return "A consultar";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));
}

/** Formata data em pt-BR */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

/** Trunca texto com reticências */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}

/** Lista de UFs brasileiras */
export const ESTADOS = [
  { uf: "AC", nome: "Acre" },
  { uf: "AL", nome: "Alagoas" },
  { uf: "AP", nome: "Amapá" },
  { uf: "AM", nome: "Amazonas" },
  { uf: "BA", nome: "Bahia" },
  { uf: "CE", nome: "Ceará" },
  { uf: "DF", nome: "Distrito Federal" },
  { uf: "ES", nome: "Espírito Santo" },
  { uf: "GO", nome: "Goiás" },
  { uf: "MA", nome: "Maranhão" },
  { uf: "MT", nome: "Mato Grosso" },
  { uf: "MS", nome: "Mato Grosso do Sul" },
  { uf: "MG", nome: "Minas Gerais" },
  { uf: "PA", nome: "Pará" },
  { uf: "PB", nome: "Paraíba" },
  { uf: "PR", nome: "Paraná" },
  { uf: "PE", nome: "Pernambuco" },
  { uf: "PI", nome: "Piauí" },
  { uf: "RJ", nome: "Rio de Janeiro" },
  { uf: "RN", nome: "Rio Grande do Norte" },
  { uf: "RS", nome: "Rio Grande do Sul" },
  { uf: "RO", nome: "Rondônia" },
  { uf: "RR", nome: "Roraima" },
  { uf: "SC", nome: "Santa Catarina" },
  { uf: "SP", nome: "São Paulo" },
  { uf: "SE", nome: "Sergipe" },
  { uf: "TO", nome: "Tocantins" },
];

/** Labels dos tipos de serviço */
export const SERVICE_LABELS: Record<string, string> = {
  banho_tosa: "Banho & Tosa",
  veterinario: "Veterinário",
  hotel: "Hotel",
  daycare: "Daycare",
  dog_walker: "Dog Walker",
  taxi_pet: "Táxi Pet",
  spa: "Spa",
  cirurgia: "Cirurgia",
  vacina: "Vacinação",
  microchip: "Microchip",
  outros: "Outros",
};

/** Labels dos tipos de animal */
export const ANIMAL_LABELS: Record<string, string> = {
  cachorro: "Cães 🐕",
  gato: "Gatos 🐈",
  ave: "Aves 🐦",
  peixe: "Peixes 🐟",
  reptil: "Répteis 🦎",
  roedor: "Roedores 🐹",
  outros: "Outros",
};

/** Limites por plano */
export const PLAN_LIMITS = {
  free: { photos: 5, services: 3, leads: false, analytics: false, featured: false },
  pro: { photos: Infinity, services: Infinity, leads: true, analytics: true, featured: false },
  premium: { photos: Infinity, services: Infinity, leads: true, analytics: true, featured: true },
} as const;
