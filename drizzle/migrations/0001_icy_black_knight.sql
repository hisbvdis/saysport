ALTER TABLE "object" DROP CONSTRAINT "object_status_instead_id_object_object_id_fk";
--> statement-breakpoint
ALTER TABLE "object" DROP CONSTRAINT "object_parent_id_object_object_id_fk";
--> statement-breakpoint
ALTER TABLE "object_link" DROP CONSTRAINT "object_link_object_id_object_object_id_fk";
--> statement-breakpoint
ALTER TABLE "object_on_option" DROP CONSTRAINT "object_on_option_object_id_object_object_id_fk";
--> statement-breakpoint
ALTER TABLE "object_on_option" DROP CONSTRAINT "object_on_option_option_id_option_option_id_fk";
--> statement-breakpoint
ALTER TABLE "object_on_section" DROP CONSTRAINT "object_on_section_object_id_object_object_id_fk";
--> statement-breakpoint
ALTER TABLE "object_on_section" DROP CONSTRAINT "object_on_section_section_id_section_section_id_fk";
--> statement-breakpoint
ALTER TABLE "object_phone" DROP CONSTRAINT "object_phone_object_id_object_object_id_fk";
--> statement-breakpoint
ALTER TABLE "object_photo" DROP CONSTRAINT "object_photo_object_id_object_object_id_fk";
--> statement-breakpoint
ALTER TABLE "object_schedule" DROP CONSTRAINT "object_schedule_object_id_object_object_id_fk";
--> statement-breakpoint
ALTER TABLE "section_on_spec" DROP CONSTRAINT "section_on_spec_spec_id_spec_spec_id_fk";
--> statement-breakpoint
ALTER TABLE "object" ALTER COLUMN "created" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "object_phone" ALTER COLUMN "value" DROP NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "object" ADD CONSTRAINT "object_status_instead_id_object_object_id_fk" FOREIGN KEY ("status_instead_id") REFERENCES "public"."object"("object_id") ON DELETE restrict ON UPDATE no action;
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
 ALTER TABLE "object_on_option" ADD CONSTRAINT "object_on_option_option_id_option_option_id_fk" FOREIGN KEY ("option_id") REFERENCES "public"."option"("option_id") ON DELETE restrict ON UPDATE no action;
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
 ALTER TABLE "object_phone" ADD CONSTRAINT "object_phone_object_id_object_object_id_fk" FOREIGN KEY ("object_id") REFERENCES "public"."object"("object_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "object_photo" ADD CONSTRAINT "object_photo_object_id_object_object_id_fk" FOREIGN KEY ("object_id") REFERENCES "public"."object"("object_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "object_schedule" ADD CONSTRAINT "object_schedule_object_id_object_object_id_fk" FOREIGN KEY ("object_id") REFERENCES "public"."object"("object_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "section_on_spec" ADD CONSTRAINT "section_on_spec_spec_id_spec_spec_id_fk" FOREIGN KEY ("spec_id") REFERENCES "public"."spec"("spec_id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "object_phone" DROP COLUMN IF EXISTS "comment";