import {
  pgTable,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  decimal,
  pgEnum,
  primaryKey,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// =============================================================================
// ENUMS
// =============================================================================

export const planEnum = pgEnum("plan", ["free", "pro", "premium"]);

export const petshopStatusEnum = pgEnum("petshop_status", [
  "pending",    // aguardando aprovação
  "active",     // ativo e visível
  "suspended",  // suspenso por violação
  "inactive",   // desativado pelo dono
]);

export const userRoleEnum = pgEnum("user_role", [
  "tutor",      // dono de pet, usuário comum
  "owner",      // dono de petshop
  "admin",      // administrador da plataforma
]);

export const serviceTypeEnum = pgEnum("service_type", [
  "banho_tosa",
  "veterinario",
  "hotel",
  "daycare",
  "dog_walker",
  "taxi_pet",
  "spa",
  "cirurgia",
  "vacina",
  "microchip",
  "outros",
]);

export const animalTypeEnum = pgEnum("animal_type", [
  "cachorro",
  "gato",
  "ave",
  "peixe",
  "reptil",
  "roedor",
  "outros",
]);

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "past_due",
  "canceled",
  "trialing",
]);

// =============================================================================
// USERS
// Tutores, donos de petshop e admins compartilham esta tabela
// =============================================================================

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerified: timestamp("email_verified", { mode: "date" }),
    passwordHash: text("password_hash"),
    image: text("image"),
    role: userRoleEnum("role").notNull().default("tutor"),
    phone: varchar("phone", { length: 20 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [uniqueIndex("users_email_idx").on(t.email)]
);

// NextAuth v5 — tabelas obrigatórias
export const accounts = pgTable(
  "accounts",
  {
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    expiresAt: integer("expires_at"),
    tokenType: text("token_type"),
    scope: text("scope"),
    idToken: text("id_token"),
    sessionState: text("session_state"),
  },
  (t) => [primaryKey({ columns: [t.provider, t.providerAccountId] })]
);

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.identifier, t.token] })]
);

// =============================================================================
// PETSHOPS
// Entidade central do marketplace
// =============================================================================

export const petshops = pgTable(
  "petshops",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    ownerId: text("owner_id").notNull().references(() => users.id, { onDelete: "cascade" }),

    // Identidade
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(), // petpag.com.br/petshop/patinhas-felizes
    description: text("description"),
    logoUrl: text("logo_url"),
    coverUrl: text("cover_url"),

    // Contato
    phone: varchar("phone", { length: 20 }),
    whatsapp: varchar("whatsapp", { length: 20 }),
    email: varchar("email", { length: 255 }),
    website: text("website"),

    // Endereço
    street: varchar("street", { length: 255 }),
    number: varchar("number", { length: 20 }),
    complement: varchar("complement", { length: 100 }),
    neighborhood: varchar("neighborhood", { length: 100 }),
    city: varchar("city", { length: 100 }).notNull(),
    state: varchar("state", { length: 2 }).notNull(), // UF
    zipCode: varchar("zip_code", { length: 9 }),
    lat: decimal("lat", { precision: 10, scale: 8 }),
    lng: decimal("lng", { precision: 11, scale: 8 }),

    // Plano e status
    plan: planEnum("plan").notNull().default("free"),
    status: petshopStatusEnum("status").notNull().default("pending"),
    isVerified: boolean("is_verified").notNull().default(false),
    isFeatured: boolean("is_featured").notNull().default(false),

    // Métricas (denormalizadas para performance)
    reviewCount: integer("review_count").notNull().default(0),
    avgRating: decimal("avg_rating", { precision: 3, scale: 2 }).default("0.00"),
    viewCount: integer("view_count").notNull().default(0),

    // Horários (JSON simples)
    openingHours: text("opening_hours"), // JSON: { mon: "08:00-18:00", ... }

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("petshops_slug_idx").on(t.slug),
    index("petshops_city_state_idx").on(t.city, t.state),
    index("petshops_status_idx").on(t.status),
    index("petshops_plan_idx").on(t.plan),
  ]
);

// =============================================================================
// SERVICES
// Serviços que cada petshop oferece
// =============================================================================

export const petshopServices = pgTable(
  "petshop_services",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    petshopId: text("petshop_id").notNull().references(() => petshops.id, { onDelete: "cascade" }),
    type: serviceTypeEnum("type").notNull(),
    name: varchar("name", { length: 255 }).notNull(),        // "Banho Completo Porte Médio"
    description: text("description"),
    priceFrom: decimal("price_from", { precision: 10, scale: 2 }),
    priceTo: decimal("price_to", { precision: 10, scale: 2 }),
    durationMinutes: integer("duration_minutes"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("petshop_services_petshop_idx").on(t.petshopId)]
);

// =============================================================================
// PHOTOS
// Fotos do petshop (plano free: máx 5, pro/premium: ilimitado)
// =============================================================================

export const petshopPhotos = pgTable(
  "petshop_photos",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    petshopId: text("petshop_id").notNull().references(() => petshops.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    caption: varchar("caption", { length: 255 }),
    order: integer("order").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("petshop_photos_petshop_idx").on(t.petshopId)]
);

// =============================================================================
// ANIMAL TYPES ACCEPTED
// Quais animais o petshop atende (many-to-many simples)
// =============================================================================

export const petshopAnimals = pgTable(
  "petshop_animals",
  {
    petshopId: text("petshop_id").notNull().references(() => petshops.id, { onDelete: "cascade" }),
    animalType: animalTypeEnum("animal_type").notNull(),
  },
  (t) => [primaryKey({ columns: [t.petshopId, t.animalType] })]
);

// =============================================================================
// REVIEWS
// Avaliações de tutores sobre petshops
// =============================================================================

export const reviews = pgTable(
  "reviews",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    petshopId: text("petshop_id").notNull().references(() => petshops.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(),           // 1-5
    title: varchar("title", { length: 255 }),
    body: text("body"),
    serviceUsed: serviceTypeEnum("service_used"),
    isVerified: boolean("is_verified").notNull().default(false), // compra verificada futuramente
    ownerReply: text("owner_reply"),
    ownerRepliedAt: timestamp("owner_replied_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    index("reviews_petshop_idx").on(t.petshopId),
    index("reviews_user_idx").on(t.userId),
    uniqueIndex("reviews_user_petshop_idx").on(t.userId, t.petshopId), // 1 review por usuário por petshop
  ]
);

// =============================================================================
// SUBSCRIPTIONS
// Controle de assinaturas (integrar com Stripe/Pagar.me futuramente)
// =============================================================================

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    petshopId: text("petshop_id").notNull().references(() => petshops.id, { onDelete: "cascade" }),
    plan: planEnum("plan").notNull(),
    status: subscriptionStatusEnum("status").notNull().default("active"),
    currentPeriodStart: timestamp("current_period_start").notNull(),
    currentPeriodEnd: timestamp("current_period_end").notNull(),
    // Para integração futura com gateway de pagamento
    externalId: text("external_id"),     // ID no Stripe/Pagar.me
    externalCustomerId: text("external_customer_id"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [index("subscriptions_petshop_idx").on(t.petshopId)]
);

// =============================================================================
// LEADS / CONTATOS
// Mensagens enviadas por tutores via portal (plano pro/premium)
// =============================================================================

export const leads = pgTable(
  "leads",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    petshopId: text("petshop_id").notNull().references(() => petshops.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    // Dados do visitante (caso não esteja logado)
    visitorName: varchar("visitor_name", { length: 255 }),
    visitorEmail: varchar("visitor_email", { length: 255 }),
    visitorPhone: varchar("visitor_phone", { length: 20 }),
    message: text("message").notNull(),
    serviceInterested: serviceTypeEnum("service_interested"),
    isRead: boolean("is_read").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("leads_petshop_idx").on(t.petshopId)]
);

// =============================================================================
// PAGE VIEWS
// Analytics simples de visitas por petshop (sem terceiros)
// =============================================================================

export const pageViews = pgTable(
  "page_views",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    petshopId: text("petshop_id").notNull().references(() => petshops.id, { onDelete: "cascade" }),
    date: timestamp("date").notNull().defaultNow(), // truncar para dia na query
    source: varchar("source", { length: 50 }),     // "google", "direct", "petpag"
  },
  (t) => [index("page_views_petshop_date_idx").on(t.petshopId, t.date)]
);

// =============================================================================
// BLOG POSTS
// Conteúdo editorial do portal (plano premium pode publicar artigos)
// =============================================================================

export const posts = pgTable(
  "posts",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    authorId: text("author_id").notNull().references(() => users.id),
    petshopId: text("petshop_id").references(() => petshops.id, { onDelete: "set null" }), // null = editorial Pet-Pag
    title: varchar("title", { length: 500 }).notNull(),
    slug: varchar("slug", { length: 500 }).notNull(),
    excerpt: text("excerpt"),
    content: text("content").notNull(),       // Markdown
    coverUrl: text("cover_url"),
    category: varchar("category", { length: 100 }),
    isPublished: boolean("is_published").notNull().default(false),
    publishedAt: timestamp("published_at"),
    viewCount: integer("view_count").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("posts_slug_idx").on(t.slug),
    index("posts_published_idx").on(t.isPublished, t.publishedAt),
  ]
);

// =============================================================================
// RELATIONS (Drizzle typed relations for joins)
// =============================================================================

export const usersRelations = relations(users, ({ many }) => ({
  petshops: many(petshops),
  reviews: many(reviews),
  accounts: many(accounts),
  sessions: many(sessions),
}));

export const petshopsRelations = relations(petshops, ({ one, many }) => ({
  owner: one(users, { fields: [petshops.ownerId], references: [users.id] }),
  services: many(petshopServices),
  photos: many(petshopPhotos),
  animals: many(petshopAnimals),
  reviews: many(reviews),
  subscription: many(subscriptions),
  leads: many(leads),
  pageViews: many(pageViews),
  posts: many(posts),
}));

export const petshopServicesRelations = relations(petshopServices, ({ one }) => ({
  petshop: one(petshops, { fields: [petshopServices.petshopId], references: [petshops.id] }),
}));

export const petshopPhotosRelations = relations(petshopPhotos, ({ one }) => ({
  petshop: one(petshops, { fields: [petshopPhotos.petshopId], references: [petshops.id] }),
}));

export const petshopAnimalsRelations = relations(petshopAnimals, ({ one }) => ({
  petshop: one(petshops, { fields: [petshopAnimals.petshopId], references: [petshops.id] }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  petshop: one(petshops, { fields: [subscriptions.petshopId], references: [petshops.id] }),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
  petshop: one(petshops, { fields: [leads.petshopId], references: [petshops.id] }),
  user: one(users, { fields: [leads.userId], references: [users.id] }),
}));

export const pageViewsRelations = relations(pageViews, ({ one }) => ({
  petshop: one(petshops, { fields: [pageViews.petshopId], references: [petshops.id] }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  petshop: one(petshops, { fields: [reviews.petshopId], references: [petshops.id] }),
  user: one(users, { fields: [reviews.userId], references: [users.id] }),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, { fields: [posts.authorId], references: [users.id] }),
  petshop: one(petshops, { fields: [posts.petshopId], references: [petshops.id] }),
}));

// =============================================================================
// TYPES (inferidos do schema — use em toda a app)
// =============================================================================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Petshop = typeof petshops.$inferSelect;
export type NewPetshop = typeof petshops.$inferInsert;
export type PetshopService = typeof petshopServices.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type Lead = typeof leads.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Subscription = typeof subscriptions.$inferSelect;
