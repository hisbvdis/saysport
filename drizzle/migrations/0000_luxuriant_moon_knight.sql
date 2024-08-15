DO $$ BEGIN
 CREATE TYPE "public"."costTYpe" AS ENUM('paid', 'free');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."objectStatus" AS ENUM('works', 'open_soon', 'might_closed', 'closed_temp', 'closed_forever');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."objectType" AS ENUM('org', 'place', 'class');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."optionsNumber" AS ENUM('many', 'one');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."sectionType" AS ENUM('section', 'common');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "category" (
	"category_id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "category_on_section" (
	"category_id" integer NOT NULL,
	"section_id" integer NOT NULL,
	CONSTRAINT "category_on_section_category_id_section_id_pk" PRIMARY KEY("category_id","section_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "city" (
	"city_id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"name_preposition" varchar,
	"admin1" varchar,
	"admin2" varchar,
	"country" varchar NOT NULL,
	"coord_lat" double precision NOT NULL,
	"coord_lon" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "object" (
	"object_id" serial PRIMARY KEY NOT NULL,
	"type" "objectType" NOT NULL,
	"name_type" varchar NOT NULL,
	"name_title" varchar,
	"name_where" varchar,
	"name_locative" varchar,
	"status_inherit" boolean,
	"status" "objectStatus" NOT NULL,
	"status_comment" varchar,
	"status_source" varchar,
	"status_instead_id" integer,
	"city_id" integer NOT NULL,
	"parent_id" integer,
	"address" varchar,
	"address_2" varchar,
	"coord_inherit" boolean,
	"coord_lat" double precision NOT NULL,
	"coord_lon" double precision NOT NULL,
	"description" varchar,
	"created" timestamp NOT NULL,
	"modified" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "object_link" (
	"object_id" integer NOT NULL,
	"order" integer NOT NULL,
	"value" varchar NOT NULL,
	"comment" varchar,
	CONSTRAINT "object_link_object_id_order_pk" PRIMARY KEY("object_id","order")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "object_on_option" (
	"object_id" integer NOT NULL,
	"option_id" integer NOT NULL,
	CONSTRAINT "object_on_option_object_id_option_id_pk" PRIMARY KEY("object_id","option_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "object_on_schedule" (
	"object_id" integer NOT NULL,
	"usage_id" integer NOT NULL,
	"schedule_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "object_on_section" (
	"object_id" integer NOT NULL,
	"section_id" integer NOT NULL,
	"description" varchar,
	CONSTRAINT "object_on_section_object_id_section_id_pk" PRIMARY KEY("object_id","section_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "object_on_usage" (
	"object_id" integer NOT NULL,
	"usage_id" integer NOT NULL,
	"description" varchar,
	"cost" "costTYpe" NOT NULL,
	"schedule_inherit" boolean,
	"schedule_date" timestamp,
	"schedule_source" varchar,
	"schedule_comment" varchar,
	"schedule_24_7" boolean
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "object_phone" (
	"object_id" integer NOT NULL,
	"order" integer NOT NULL,
	"value" varchar NOT NULL,
	"comment" varchar,
	CONSTRAINT "object_phone_object_id_order_pk" PRIMARY KEY("object_id","order")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "object_photo" (
	"photo_id" serial PRIMARY KEY NOT NULL,
	"object_id" integer NOT NULL,
	"order" integer NOT NULL,
	"name" varchar NOT NULL,
	"uploaded" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "option" (
	"option_id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"order" integer NOT NULL,
	"spec_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "schedule" (
	"schedule_id" serial PRIMARY KEY NOT NULL,
	"day_num" integer NOT NULL,
	"time" varchar NOT NULL,
	"from" integer NOT NULL,
	"to" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "section" (
	"section_id" serial PRIMARY KEY NOT NULL,
	"section_type" "sectionType" NOT NULL,
	"name_service" varchar NOT NULL,
	"name_public_plural" varchar NOT NULL,
	"name_public_singular" varchar NOT NULL,
	"object_type" "objectType" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "section_on_spec" (
	"section_id" integer NOT NULL,
	"spec_id" integer NOT NULL,
	CONSTRAINT "section_on_spec_section_id_spec_id_pk" PRIMARY KEY("section_id","spec_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "section_on_usage" (
	"section_id" integer,
	"usage_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "spec" (
	"spec_id" serial PRIMARY KEY NOT NULL,
	"name_service" varchar NOT NULL,
	"name_public" varchar NOT NULL,
	"object_type" "objectType" NOT NULL,
	"options_number" "optionsNumber" NOT NULL,
	"order" integer NOT NULL,
	"is_and_in_search" boolean
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "usage" (
	"usage_id" serial PRIMARY KEY NOT NULL,
	"name_service" varchar NOT NULL,
	"name_public" varchar NOT NULL,
	"object_type" "objectType" NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "category_on_section" ADD CONSTRAINT "category_on_section_category_id_category_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("category_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "category_on_section" ADD CONSTRAINT "category_on_section_section_id_section_section_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."section"("section_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "object" ADD CONSTRAINT "object_status_instead_id_object_object_id_fk" FOREIGN KEY ("status_instead_id") REFERENCES "public"."object"("object_id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "object" ADD CONSTRAINT "object_city_id_city_city_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."city"("city_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "object" ADD CONSTRAINT "object_parent_id_object_object_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."object"("object_id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "object_link" ADD CONSTRAINT "object_link_object_id_object_object_id_fk" FOREIGN KEY ("object_id") REFERENCES "public"."object"("object_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "object_on_option" ADD CONSTRAINT "object_on_option_object_id_object_object_id_fk" FOREIGN KEY ("object_id") REFERENCES "public"."object"("object_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "object_on_option" ADD CONSTRAINT "object_on_option_option_id_option_option_id_fk" FOREIGN KEY ("option_id") REFERENCES "public"."option"("option_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "object_on_schedule" ADD CONSTRAINT "object_on_schedule_object_id_object_object_id_fk" FOREIGN KEY ("object_id") REFERENCES "public"."object"("object_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "object_on_schedule" ADD CONSTRAINT "object_on_schedule_usage_id_usage_usage_id_fk" FOREIGN KEY ("usage_id") REFERENCES "public"."usage"("usage_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "object_on_schedule" ADD CONSTRAINT "object_on_schedule_schedule_id_schedule_schedule_id_fk" FOREIGN KEY ("schedule_id") REFERENCES "public"."schedule"("schedule_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "object_on_section" ADD CONSTRAINT "object_on_section_object_id_object_object_id_fk" FOREIGN KEY ("object_id") REFERENCES "public"."object"("object_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "object_on_section" ADD CONSTRAINT "object_on_section_section_id_section_section_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."section"("section_id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "object_on_usage" ADD CONSTRAINT "object_on_usage_object_id_object_object_id_fk" FOREIGN KEY ("object_id") REFERENCES "public"."object"("object_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "object_on_usage" ADD CONSTRAINT "object_on_usage_usage_id_usage_usage_id_fk" FOREIGN KEY ("usage_id") REFERENCES "public"."usage"("usage_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "object_phone" ADD CONSTRAINT "object_phone_object_id_object_object_id_fk" FOREIGN KEY ("object_id") REFERENCES "public"."object"("object_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "object_photo" ADD CONSTRAINT "object_photo_object_id_object_object_id_fk" FOREIGN KEY ("object_id") REFERENCES "public"."object"("object_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "option" ADD CONSTRAINT "option_spec_id_spec_spec_id_fk" FOREIGN KEY ("spec_id") REFERENCES "public"."spec"("spec_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "section_on_spec" ADD CONSTRAINT "section_on_spec_section_id_section_section_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."section"("section_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "section_on_spec" ADD CONSTRAINT "section_on_spec_spec_id_spec_spec_id_fk" FOREIGN KEY ("spec_id") REFERENCES "public"."spec"("spec_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "section_on_usage" ADD CONSTRAINT "section_on_usage_section_id_section_section_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."section"("section_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "section_on_usage" ADD CONSTRAINT "section_on_usage_usage_id_usage_usage_id_fk" FOREIGN KEY ("usage_id") REFERENCES "public"."usage"("usage_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
