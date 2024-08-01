DO $$ BEGIN
 CREATE TYPE "public"."sectionType" AS ENUM('section', 'common', 'usage');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "section" ADD COLUMN "section_type" "sectionType";