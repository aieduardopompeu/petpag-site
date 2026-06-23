import { db } from "./index";
import { petshops, reviews, petshopServices } from "./schema";
import { eq, and, desc, sql, ilike, or } from "drizzle-orm";

// =============================================================================
// PETSHOPS
// =============================================================================

export async function getPetshopBySlug(slug: string) {
  const result = await db.query.petshops.findFirst({
    where: and(eq(petshops.slug, slug), eq(petshops.status, "active")),
    with: {
      owner: { columns: { id: true, name: true, email: true } },
      services: { where: eq(petshopServices.isActive, true) },
      photos: { orderBy: (photos, { asc }) => [asc(photos.order)] },
      reviews: {
        orderBy: [desc(reviews.createdAt)],
        limit: 10,
        with: { user: { columns: { id: true, name: true, image: true } } },
      },
      animals: true,
    },
  });
  return result ?? null;
}

export async function searchPetshops({
  city,
  state,
  query,
  service,
  page = 1,
  limit = 12,
}: {
  city?: string;
  state?: string;
  query?: string;
  service?: string;
  page?: number;
  limit?: number;
}) {
  const offset = (page - 1) * limit;

  const conditions = [eq(petshops.status, "active")];

  if (city) conditions.push(ilike(petshops.city, `%${city}%`));
  if (state) conditions.push(eq(petshops.state, state.toUpperCase()));
  if (query) {
    conditions.push(
      or(ilike(petshops.name, `%${query}%`), ilike(petshops.description, `%${query}%`))!
    );
  }

  const [results, countResult] = await Promise.all([
    db.query.petshops.findMany({
      where: and(...conditions),
      // Plano premium/pro aparece primeiro, depois por rating
      orderBy: [
        sql`CASE plan WHEN 'premium' THEN 0 WHEN 'pro' THEN 1 ELSE 2 END`,
        desc(petshops.avgRating),
        desc(petshops.reviewCount),
      ],
      limit,
      offset,
      with: {
        photos: { limit: 1 },
        animals: true,
      },
    }),
    db
      .select({ count: sql<number>`count(*)` })
      .from(petshops)
      .where(and(...conditions)),
  ]);

  return {
    data: results,
    total: Number(countResult[0].count),
    pages: Math.ceil(Number(countResult[0].count) / limit),
    page,
  };
}

export async function getFeaturedPetshops(limit = 6) {
  return db.query.petshops.findMany({
    where: and(eq(petshops.status, "active"), eq(petshops.isFeatured, true)),
    orderBy: [desc(petshops.avgRating)],
    limit,
    with: { photos: { limit: 1 }, animals: true },
  });
}

export async function getPetshopsByOwner(ownerId: string) {
  return db.query.petshops.findMany({
    where: eq(petshops.ownerId, ownerId),
    with: { services: true, photos: { limit: 1 } },
  });
}

// =============================================================================
// REVIEWS
// =============================================================================

export async function createReview(data: {
  petshopId: string;
  userId: string;
  rating: number;
  title?: string;
  body?: string;
}) {
  const [review] = await db.insert(reviews).values(data).returning();

  // Atualiza média e contagem no petshop (query atômica)
  await db
    .update(petshops)
    .set({
      reviewCount: sql`${petshops.reviewCount} + 1`,
      avgRating: sql`(
        SELECT ROUND(AVG(rating)::numeric, 2)
        FROM reviews
        WHERE petshop_id = ${data.petshopId}
      )`,
      updatedAt: new Date(),
    })
    .where(eq(petshops.id, data.petshopId));

  return review;
}

// =============================================================================
// PAGE VIEWS (analytics)
// =============================================================================

export async function incrementPetshopView(petshopId: string) {
  await db
    .update(petshops)
    .set({ viewCount: sql`${petshops.viewCount} + 1` })
    .where(eq(petshops.id, petshopId));
}
