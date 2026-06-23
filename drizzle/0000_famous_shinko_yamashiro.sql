CREATE TYPE "public"."animal_type" AS ENUM('cachorro', 'gato', 'ave', 'peixe', 'reptil', 'roedor', 'outros');--> statement-breakpoint
CREATE TYPE "public"."petshop_status" AS ENUM('pending', 'active', 'suspended', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."plan" AS ENUM('free', 'pro', 'premium');--> statement-breakpoint
CREATE TYPE "public"."service_type" AS ENUM('banho_tosa', 'veterinario', 'hotel', 'daycare', 'dog_walker', 'taxi_pet', 'spa', 'cirurgia', 'vacina', 'microchip', 'outros');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'past_due', 'canceled', 'trialing');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('tutor', 'owner', 'admin');--> statement-breakpoint
CREATE TABLE "accounts" (
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "accounts_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" text PRIMARY KEY NOT NULL,
	"petshop_id" text NOT NULL,
	"user_id" text,
	"visitor_name" varchar(255),
	"visitor_email" varchar(255),
	"visitor_phone" varchar(20),
	"message" text NOT NULL,
	"service_interested" "service_type",
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page_views" (
	"id" text PRIMARY KEY NOT NULL,
	"petshop_id" text NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"source" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "petshop_animals" (
	"petshop_id" text NOT NULL,
	"animal_type" "animal_type" NOT NULL,
	CONSTRAINT "petshop_animals_petshop_id_animal_type_pk" PRIMARY KEY("petshop_id","animal_type")
);
--> statement-breakpoint
CREATE TABLE "petshop_photos" (
	"id" text PRIMARY KEY NOT NULL,
	"petshop_id" text NOT NULL,
	"url" text NOT NULL,
	"caption" varchar(255),
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "petshop_services" (
	"id" text PRIMARY KEY NOT NULL,
	"petshop_id" text NOT NULL,
	"type" "service_type" NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"price_from" numeric(10, 2),
	"price_to" numeric(10, 2),
	"duration_minutes" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "petshops" (
	"id" text PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"logo_url" text,
	"cover_url" text,
	"phone" varchar(20),
	"whatsapp" varchar(20),
	"email" varchar(255),
	"website" text,
	"street" varchar(255),
	"number" varchar(20),
	"complement" varchar(100),
	"neighborhood" varchar(100),
	"city" varchar(100) NOT NULL,
	"state" varchar(2) NOT NULL,
	"zip_code" varchar(9),
	"lat" numeric(10, 8),
	"lng" numeric(11, 8),
	"plan" "plan" DEFAULT 'free' NOT NULL,
	"status" "petshop_status" DEFAULT 'pending' NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"review_count" integer DEFAULT 0 NOT NULL,
	"avg_rating" numeric(3, 2) DEFAULT '0.00',
	"view_count" integer DEFAULT 0 NOT NULL,
	"opening_hours" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" text PRIMARY KEY NOT NULL,
	"author_id" text NOT NULL,
	"petshop_id" text,
	"title" varchar(500) NOT NULL,
	"slug" varchar(500) NOT NULL,
	"excerpt" text,
	"content" text NOT NULL,
	"cover_url" text,
	"category" varchar(100),
	"is_published" boolean DEFAULT false NOT NULL,
	"published_at" timestamp,
	"view_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" text PRIMARY KEY NOT NULL,
	"petshop_id" text NOT NULL,
	"user_id" text NOT NULL,
	"rating" integer NOT NULL,
	"title" varchar(255),
	"body" text,
	"service_used" "service_type",
	"is_verified" boolean DEFAULT false NOT NULL,
	"owner_reply" text,
	"owner_replied_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"session_token" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" text PRIMARY KEY NOT NULL,
	"petshop_id" text NOT NULL,
	"plan" "plan" NOT NULL,
	"status" "subscription_status" DEFAULT 'active' NOT NULL,
	"current_period_start" timestamp NOT NULL,
	"current_period_end" timestamp NOT NULL,
	"external_id" text,
	"external_customer_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp,
	"password_hash" text,
	"image" text,
	"role" "user_role" DEFAULT 'tutor' NOT NULL,
	"phone" varchar(20),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verification_tokens_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_petshop_id_petshops_id_fk" FOREIGN KEY ("petshop_id") REFERENCES "public"."petshops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_views" ADD CONSTRAINT "page_views_petshop_id_petshops_id_fk" FOREIGN KEY ("petshop_id") REFERENCES "public"."petshops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "petshop_animals" ADD CONSTRAINT "petshop_animals_petshop_id_petshops_id_fk" FOREIGN KEY ("petshop_id") REFERENCES "public"."petshops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "petshop_photos" ADD CONSTRAINT "petshop_photos_petshop_id_petshops_id_fk" FOREIGN KEY ("petshop_id") REFERENCES "public"."petshops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "petshop_services" ADD CONSTRAINT "petshop_services_petshop_id_petshops_id_fk" FOREIGN KEY ("petshop_id") REFERENCES "public"."petshops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "petshops" ADD CONSTRAINT "petshops_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_petshop_id_petshops_id_fk" FOREIGN KEY ("petshop_id") REFERENCES "public"."petshops"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_petshop_id_petshops_id_fk" FOREIGN KEY ("petshop_id") REFERENCES "public"."petshops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_petshop_id_petshops_id_fk" FOREIGN KEY ("petshop_id") REFERENCES "public"."petshops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "leads_petshop_idx" ON "leads" USING btree ("petshop_id");--> statement-breakpoint
CREATE INDEX "page_views_petshop_date_idx" ON "page_views" USING btree ("petshop_id","date");--> statement-breakpoint
CREATE INDEX "petshop_photos_petshop_idx" ON "petshop_photos" USING btree ("petshop_id");--> statement-breakpoint
CREATE INDEX "petshop_services_petshop_idx" ON "petshop_services" USING btree ("petshop_id");--> statement-breakpoint
CREATE UNIQUE INDEX "petshops_slug_idx" ON "petshops" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "petshops_city_state_idx" ON "petshops" USING btree ("city","state");--> statement-breakpoint
CREATE INDEX "petshops_status_idx" ON "petshops" USING btree ("status");--> statement-breakpoint
CREATE INDEX "petshops_plan_idx" ON "petshops" USING btree ("plan");--> statement-breakpoint
CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "posts_published_idx" ON "posts" USING btree ("is_published","published_at");--> statement-breakpoint
CREATE INDEX "reviews_petshop_idx" ON "reviews" USING btree ("petshop_id");--> statement-breakpoint
CREATE INDEX "reviews_user_idx" ON "reviews" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "reviews_user_petshop_idx" ON "reviews" USING btree ("user_id","petshop_id");--> statement-breakpoint
CREATE INDEX "subscriptions_petshop_idx" ON "subscriptions" USING btree ("petshop_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");