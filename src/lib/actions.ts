"use server";

import { db } from "@/lib/db";
import { petshops, users } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { sendWelcomeEmail } from "@/lib/email";
import { uniqueSlug } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// =============================================================================
// SCHEMAS DE VALIDAÇÃO (Zod)
// =============================================================================

const petshopSchema = z.object({
  name: z.string().min(2, "Nome muito curto").max(255),
  description: z.string().max(2000).optional(),
  phone: z.string().max(20).optional(),
  whatsapp: z.string().max(20).optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  website: z.string().url("URL inválida").optional().or(z.literal("")),
  street: z.string().max(255).optional(),
  number: z.string().max(20).optional(),
  complement: z.string().max(100).optional(),
  neighborhood: z.string().max(100).optional(),
  city: z.string().min(2, "Cidade obrigatória").max(100),
  state: z.string().length(2, "UF inválida"),
  zipCode: z.string().max(9).optional(),
});

export type PetshopFormData = z.infer<typeof petshopSchema>;

// =============================================================================
// SERVER ACTIONS
// =============================================================================

/** Cria um novo petshop para o usuário logado */
export async function createPetshop(formData: PetshopFormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Você precisa estar logado para cadastrar um petshop." };
  }

  const parsed = petshopSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const data = parsed.data;

  // Gera slug único
  const slug = await uniqueSlug(data.name, async (s) => {
    const existing = await db.query.petshops.findFirst({
      where: eq(petshops.slug, s),
      columns: { id: true },
    });
    return !!existing;
  });

  try {
    const [petshop] = await db
      .insert(petshops)
      .values({
        ownerId: session.user.id,
        slug,
        status: "pending", // admin aprova antes de publicar
        ...data,
        email: data.email || null,
        website: data.website || null,
      })
      .returning();

    // Atualiza role do usuário para owner
    await db
      .update(users)
      .set({ role: "owner", updatedAt: new Date() })
      .where(eq(users.id, session.user.id));

    revalidatePath("/dashboard");
    return { success: true, slug: petshop.slug };
  } catch (err) {
    console.error("[createPetshop]", err);
    return { error: "Erro ao cadastrar petshop. Tente novamente." };
  }
}

/** Registra um novo usuário (tutor ou dono de petshop) */
export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const schema = z.object({
    name: z.string().min(2, "Nome muito curto"),
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "Senha deve ter ao menos 8 caracteres"),
  });

  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  // Verifica se email já existe
  const existing = await db.query.users.findFirst({
    where: eq(users.email, parsed.data.email),
    columns: { id: true },
  });
  if (existing) {
    return { error: "Este email já está cadastrado." };
  }

  const bcrypt = await import("bcryptjs");
  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  try {
    const [user] = await db
      .insert(users)
      .values({
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash,
        role: "tutor",
      })
      .returning();

    // Envia email de boas-vindas (não bloqueia a resposta)
    sendWelcomeEmail(user.email, user.name ?? "").catch(console.error);

    return { success: true };
  } catch (err) {
    console.error("[registerUser]", err);
    return { error: "Erro ao criar conta. Tente novamente." };
  }
}

/** Envia lead (mensagem de contato) para o petshop */
export async function sendLead(data: {
  petshopId: string;
  petshopOwnerId: string;
  petshopName: string;
  petshopOwnerEmail: string;
  visitorName: string;
  visitorEmail: string;
  visitorPhone?: string;
  message: string;
}) {
  const schema = z.object({
    petshopId: z.string(),
    visitorName: z.string().min(2),
    visitorEmail: z.string().email(),
    visitorPhone: z.string().optional(),
    message: z.string().min(10, "Mensagem muito curta").max(1000),
  });

  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { sendLeadNotification } = await import("@/lib/email");

  try {
    const { leads } = await import("@/lib/db/schema");
    await db.insert(leads).values({
      petshopId: data.petshopId,
      visitorName: data.visitorName,
      visitorEmail: data.visitorEmail,
      visitorPhone: data.visitorPhone,
      message: data.message,
    });

    // Notifica dono do petshop por email
    await sendLeadNotification({
      ownerEmail: data.petshopOwnerEmail,
      petshopName: data.petshopName,
      visitorName: data.visitorName,
      visitorEmail: data.visitorEmail,
      visitorPhone: data.visitorPhone,
      message: data.message,
    });

    return { success: true };
  } catch (err) {
    console.error("[sendLead]", err);
    return { error: "Erro ao enviar mensagem. Tente novamente." };
  }
}
