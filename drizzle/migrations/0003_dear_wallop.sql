ALTER TABLE "section" RENAME COLUMN "name_plural" TO "name_public_plural";--> statement-breakpoint
ALTER TABLE "section" RENAME COLUMN "name_singular" TO "name_public_singular";--> statement-breakpoint
ALTER TABLE "section" ALTER COLUMN "name_service" DROP DEFAULT;